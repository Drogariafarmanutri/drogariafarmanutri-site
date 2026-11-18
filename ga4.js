/*
 * FARMANUTRI - Google Analytics 4 (GA4)
 * Propriedade: Drogaria Farmanutri - GA4  |  ID de medicao: G-F2D5XCN4D2
 *
 * Como instalar: copie este arquivo para a pasta do site (ao lado do app.js)
 * e coloque no <head> do index.html, logo depois do <meta charset>:
 *
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=G-F2D5XCN4D2"></script>
 *   <script src="ga4.js"></script>
 *
 * Nao precisa mexer no app.js: este arquivo observa os cliques do site.
 *
 * Eventos enviados:
 *   page_view        - cada tela do site (#inicio, #ofertas, #busca...)
 *   search           - busca de produtos (search_term)
 *   view_item        - abriu "Ver detalhes" de um produto
 *   add_to_cart      - "Adicionar" / "Adicionar ao pedido"
 *   view_cart        - abriu "Meu pedido"
 *   begin_checkout   - clicou em "Enviar pedido pelo WhatsApp" (com itens e total)
 *   generate_lead    - mesmo clique acima, com o valor do pedido (EVENTO PRINCIPAL)
 *   contato_whatsapp - clicou em qualquer outro link de WhatsApp do site
 *   select_store     - escolheu uma loja no seletor
 */
(function () {
  "use strict";

  var ID = "G-F2D5XCN4D2";
  var MOEDA = "BRL";
  // Para testar no DebugView, abra o site com ?ga_debug=1 no endereco.
  var DEBUG = /[?&]ga_debug=1/.test(location.search);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag("js", new Date());
  // send_page_view: false porque o site muda de tela pelo "#" do endereco;
  // as visualizacoes de pagina sao enviadas abaixo, uma por tela.
  gtag("config", ID, { send_page_view: false, debug_mode: DEBUG || undefined });

  function ev(nome, params) {
    params = params || {};
    if (DEBUG) params.debug_mode = true;
    window.gtag("event", nome, params);
  }

  /* ---------- telas (#inicio, #ofertas, #busca ...) ---------- */
  var ultimaTela = null;
  function tela() {
    var h = (location.hash || "#inicio").slice(1);
    // #produto:123 vira /produto/123 ; #busca:dipirona vira /busca ; #cat-1004 vira /categoria/1004
    var caminho = "/" + h
      .replace(/^produto:(\d+).*$/, "produto/$1")
      .replace(/^busca(:.*)?$/, "busca")
      .replace(/^cat-(\d+)$/, "categoria/$1")
      .replace(/^categoria:(.+)$/, "categoria/$1");
    if (caminho === ultimaTela) return;
    ultimaTela = caminho;
    ev("page_view", {
      page_location: location.origin + caminho + location.search,
      page_path: caminho,
      page_title: document.title
    });
  }
  window.addEventListener("hashchange", tela);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tela);
  else tela();

  /* ---------- ajudantes para ler nome e preco do produto na tela ---------- */
  function reais(txt) {
    var m = /R\$\s*([\d.]+,\d{2})/.exec(txt || "");
    return m ? Number(m[1].replace(/\./g, "").replace(",", ".")) : undefined;
  }
  function produto(el, id) {
    var nome = "", preco;
    var no = el;
    for (var i = 0; no && i < 7; i++, no = no.parentElement) {
      if (!nome) {
        var n = no.querySelector && no.querySelector(".card__nome, h1, h2, h3, [class*='nome']");
        if (n && n.textContent.trim()) nome = n.textContent.trim();
      }
      if (preco === undefined && no.querySelector) {
        // preco "Por" (o que o cliente paga); so cai no bloco .preco se nao houver "Por"
        var p = no.querySelector(".preco__por") || no.querySelector(".preco");
        if (p) {
          var vals = (p.textContent.match(/R\$\s*[\d.]+,\d{2}/g) || []);
          if (vals.length) preco = reais(vals[vals.length - 1]);
        }
      }
      if (nome && preco !== undefined) break;
    }
    if (!nome) {
      var lbl = document.querySelector("[data-abrir='" + id + "'][aria-label]");
      if (lbl) nome = lbl.getAttribute("aria-label").replace(/^Ver (detalhes de )?/, "");
    }
    var item = { item_id: String(id), item_name: nome || ("Produto " + id), quantity: 1 };
    if (preco !== undefined) item.price = preco;
    return item;
  }
  function lojaAtual() {
    try { return String(JSON.parse(localStorage.getItem("farmanutri_loja")) || ""); } catch (e) { return ""; }
  }

  /* ---------- itens e total a partir do link do WhatsApp do pedido ---------- */
  function lerPedido(href) {
    // O link pode vir direto (wa.me/...?text=) ou pela pagina pedido-whatsapp.html?u=...
    // com o texto codificado mais de uma vez: decodifica ate estabilizar.
    var txt = String(href || "");
    for (var k = 0; k < 4; k++) {
      var dec;
      try { dec = decodeURIComponent(txt.replace(/\+/g, " ")); } catch (e) { break; }
      if (dec === txt) break;
      txt = dec;
    }
    var pos = txt.indexOf("text=");
    if (pos < 0) return null;
    txt = txt.slice(pos + 5);
    var itens = [];
    txt.split("\n").forEach(function (l) {
      var m = /^•\s*(\d+)x\s+(.+?)\s+\(cód\.\s*(\d+)\)(?:\s*-\s*R\$\s*([\d.]+,\d{2}))?/.exec(l.trim());
      if (m) {
        var it = { item_id: m[3], item_name: m[2], quantity: Number(m[1]) };
        if (m[4]) it.price = Number(m[4].replace(/\./g, "").replace(",", "."));
        itens.push(it);
      }
    });
    var total = reais((/Total estimado:[^\n]*/.exec(txt) || [""])[0]);
    if (total === undefined) {
      total = itens.reduce(function (s, it) { return s + (it.price || 0) * it.quantity; }, 0);
    }
    var loja = (/retirar na loja\s+([^:\n]+)/.exec(txt) || [])[1];
    return { itens: itens, total: Math.round(total * 100) / 100, loja: loja ? loja.trim() : "" };
  }

  /* ---------- cliques ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var el;

    if ((el = t.closest("#enviar-pedido"))) {
      var ped = lerPedido(el.getAttribute("href") || "");
      if (ped) {
        var base = { currency: MOEDA, value: ped.total, items: ped.itens };
        ev("begin_checkout", base);
        ev("generate_lead", {
          currency: MOEDA, value: ped.total,
          lead_source: "pedido_whatsapp", loja: ped.loja,
          qtd_itens: ped.itens.reduce(function (s, it) { return s + it.quantity; }, 0)
        });
      }
      return;
    }
    if ((el = t.closest("a[href*='wa.me'], a[href*='whatsapp']"))) {
      ev("contato_whatsapp", { link_text: (el.textContent || "").trim().slice(0, 80), link_id: el.id || "" });
      return;
    }
    if ((el = t.closest("[data-add]"))) {
      var item = produto(el, el.getAttribute("data-add"));
      ev("add_to_cart", { currency: MOEDA, value: item.price || 0, items: [item], loja: lojaAtual() });
      return;
    }
    if ((el = t.closest("[data-abrir]"))) {
      var it2 = produto(el, el.getAttribute("data-abrir"));
      ev("view_item", { currency: MOEDA, value: it2.price || 0, items: [it2] });
      return;
    }
    if ((el = t.closest("#btn-pedido"))) {
      ev("view_cart", {});
      return;
    }
    if ((el = t.closest("[data-loja]"))) {
      var nomeLoja = (el.querySelector("strong") || el).textContent.trim();
      ev("select_store", { loja: nomeLoja || el.getAttribute("data-loja") });
    }
  }, true);

  /* ---------- busca ---------- */
  document.addEventListener("submit", function (e) {
    if (!e.target || e.target.id !== "form-busca") return;
    var q = (document.getElementById("q") || {}).value || "";
    q = q.trim();
    if (q) ev("search", { search_term: q.slice(0, 100) });
  }, true);
})();
