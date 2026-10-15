(function () {
  "use strict";

  var CFG = window.FARMANUTRI || {};
  var POR_PAGINA = 40;
  var CHAVE_PEDIDO = "farmanutri_pedido";
  var CHAVE_LOJA = "farmanutri_loja";

  var dados = { lojas: [], categorias: [], produtos: [] };
  var porId = {}, lojaPorId = {}, catPorId = {}, filhos = {};
  var estado = { tela: "inicio", q: "", cat: null, ofertas: false, loja: "todas", ordem: "relevancia", limite: POR_PAGINA };
  var pedido = {};
  var lojaPedido = "";

  var $ = function (id) { return document.getElementById(id); };

  /* ================= icones ================= */
  var ICONES = {
    cruz: '<path fill="currentColor" d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    pilula: '<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M9.2 7.9 14.8 16"/></g>',
    coracao: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6 12.5h3l1.5-2.5 2 4 1.5-1.5H18"/>',
    gota: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    brilho: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M18.5 16v4M16.5 18h4"/>',
    bebe: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M9 7h6l1 3v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-9z"/><path d="M10 7V5a2 2 0 0 1 4 0v2"/><path d="M8 13h8"/></g>',
    sol: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/></g>',
    folha: '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5 19l8-8"/>',
    oferta: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/></g>',
    whatsapp: '<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/>',
    loja: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 10v10h16V10"/><path d="M3 10l2-6h14l2 6c0 1.7-1.3 3-3 3s-3-1.3-3-3c0 1.7-1.3 3-3 3s-3-1.3-3-3c0 1.7-1.3 3-3 3s-3-1.3-3-3Z"/><path d="M10 20v-5h4v5"/></g>',
    jaleco: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="7" r="3.5"/><path d="M4.5 21c.5-4.5 3.5-7 7.5-7s7 2.5 7.5 7"/><path d="M12 14v4M10 16h4"/></g>',
    relogio: '<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>',
    seta: '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>',
    setaE: '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/>'
  };
  function icone(nome, extra) {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"' + (extra || "") + '>' + (ICONES[nome] || ICONES.cruz) + '</svg>';
  }
  function iconeCategoria(nome) {
    var n = norm(nome);
    if (/medic|remedio|generic|dor|febre|gripe|alerg|infec/.test(n)) return "pilula";
    if (/bebe|mamae|infantil|fralda|crianca/.test(n)) return "bebe";
    if (/solar|sol\b|protetor|bronze/.test(n)) return "sol";
    if (/dermo|pele|skin|rosto|facial/.test(n)) return "gota";
    if (/beleza|maqui|cabel|perfum|unha|esmalte|cosmet/.test(n)) return "brilho";
    if (/higien|banho|bucal|dental|desodor|sabonete|absorv|barbe/.test(n)) return "gota";
    if (/vitamin|suplement|nutri|natur|fitness|emagrec/.test(n)) return "folha";
    if (/saude|bem|diabet|pressao|ortoped|primeiros|curativo/.test(n)) return "coracao";
    if (/oferta|promo/.test(n)) return "oferta";
    return "cruz";
  }

  /* ================= utilitarios ================= */
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function reais(v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  var ACENTOS = {
    saude: "saúde", mamae: "mamãe", bebe: "bebê", acessorios: "acessórios", dermocosmeticos: "dermocosméticos",
    infeccoes: "infecções", alergicos: "alérgicos", ortopedicos: "ortopédicos", protecao: "proteção", nutricao: "nutrição",
    farmacia: "farmácia", conveniencia: "conveniência", diabeticos: "diabéticos", higienico: "higiênico", oleos: "óleos",
    estetica: "estética", cosmeticos: "cosméticos", termometros: "termômetros", analgesicos: "analgésicos",
    antiinflamatorios: "anti-inflamatórios", gastricos: "gástricos", higiene: "higiene", medicamentos: "medicamentos",
    pes: "pés", maos: "mãos", labios: "lábios", oculos: "óculos", genericos: "genéricos", eticos: "éticos",
    dieteticos: "dietéticos", cha: "chá", chas: "chás", cafe: "café", rapido: "rápido", liquido: "líquido", unico: "único"
  };
  var MINUSCULAS = { de: 1, da: 1, do: 1, das: 1, dos: 1, e: 1, com: 1, para: 1, em: 1, a: 1, o: 1 };
  function nomeCategoria(s) {
    return String(s || "").toLowerCase().split(/(\s+|-|\/)/).map(function (w, i) {
      if (!w.trim() || w === "-" || w === "/") return w;
      var k = norm(w);
      var t = ACENTOS[k] || w;
      if (i > 0 && MINUSCULAS[k]) return t;
      return t.charAt(0).toUpperCase() + t.slice(1);
    }).join("").replace(/\s+/g, " ").trim();
  }
  function nomeProduto(s) {
    s = String(s || "").replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").replace(/,\s*$/, "").trim();
    var letras = s.replace(/[^A-Za-zÀ-ÿ]/g, "");
    if (letras && letras === letras.toUpperCase()) s = s.toLowerCase();
    s = s.replace(/\b(fps|ml|mg|kg|un)\b/gi, function (m) { return /fps/i.test(m) ? "FPS" : m.toLowerCase(); });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function nomeMarca(s) {
    s = String(s || "").trim();
    if (!s) return "";
    return s.toLowerCase().replace(/(^|\s)\S/g, function (m) { return m.toUpperCase(); });
  }
  function nomeLoja(id) {
    var n = (CFG.nome_lojas || {})[id];
    if (n) return n;
    var l = lojaPorId[id];
    return l ? (l.bairro || l.nome) : "Loja " + id;
  }
  function telefone(t) {
    var d = String(t || "").replace(/\D/g, "");
    if (d.length === 8 || d.length === 9) d = "38" + d;
    if (d.length === 12 || d.length === 13) d = d.slice(2);
    if (d.length === 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    if (d.length === 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    return t || "";
  }
  function cnpj(c) {
    var d = String(c || "").replace(/\D/g, "");
    return d.length === 14 ? d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : (c || "");
  }
  function numeroWhats(lojaId) {
    return String((CFG.whatsapp_lojas || {})[lojaId] || CFG.whatsapp_padrao || "").replace(/\D/g, "");
  }
  function linkWhats(lojaId, texto) {
    return "https://wa.me/" + numeroWhats(lojaId) + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }
  function salvar(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* sem armazenamento */ } }
  function ler(chave) { try { return JSON.parse(localStorage.getItem(chave)); } catch (e) { return null; } }

  /* ================= preco e estoque ================= */
  function promoDe(p, loja) {
    if (!p.promo || p.consulta) return null;
    if (loja && loja !== "todas") return p.promo[loja] ? { valor: p.promo[loja], loja: loja } : null;
    var com = Object.keys(p.estoque).filter(function (k) { return lojaPorId[k]; });
    if (com.length && com.every(function (k) { return p.promo[k]; })) {
      return { valor: Math.max.apply(null, com.map(function (k) { return p.promo[k]; })), geral: true };
    }
    var melhor = null;
    Object.keys(p.promo).forEach(function (k) {
      if (p.estoque[k] && (!melhor || p.promo[k] < melhor.valor)) melhor = { valor: p.promo[k], loja: k };
    });
    return melhor;
  }
  // Promocao que vale para o que esta sendo mostrado (loja escolhida ou todas as lojas)
  function promoValida(p, loja) {
    var pr = promoDe(p, loja);
    return pr && (loja !== "todas" || pr.geral) ? pr : null;
  }
  function precoNaLoja(p, loja) {
    if (p.consulta) return null;
    var pr = promoValida(p, loja);
    return pr ? pr.valor : p.preco;
  }
  function desconto(p) {
    var pr = promoValida(p, estado.loja);
    return pr ? Math.round((1 - pr.valor / p.preco) * 100) : 0;
  }
  function descontoMax(p) {
    var pr = promoDe(p, estado.loja);
    return pr ? Math.round((1 - pr.valor / p.preco) * 100) : 0;
  }
  function lojasCom(p) { return Object.keys(p.estoque).filter(function (k) { return lojaPorId[k]; }); }

  /* ================= cartao de produto ================= */
  function foto(p, classe) {
    if (p.consulta) return '<img src="img-caixa-medicamento.webp" alt="" loading="lazy" width="400" height="400"' + (classe ? ' class="' + classe + '"' : "") + '>';
    var ph = '<span class="ph">' + icone(p._icone) + '</span>';
    if (!p.img) return ph;
    return '<img src="img/' + p.id + '.webp" alt="" loading="lazy" width="400" height="400" data-ph="' + p._icone + '"' + (classe ? ' class="' + classe + '"' : "") + '>';
  }

  function htmlPreco(p) {
    if (p.consulta) return '<div class="preco"><span class="preco__consulta">Preço na loja<small>Consulte pelo WhatsApp</small></span></div>';
    var pr = promoDe(p, estado.loja);
    if (pr && (estado.loja !== "todas" || pr.geral)) {
      return '<div class="preco"><span class="preco__de">R$ ' + reais(p.preco) + '</span>' +
        '<span class="preco__por preco__por--oferta">R$ ' + reais(pr.valor) + '</span></div>';
    }
    return '<div class="preco">' +
      (pr ? '<span class="preco__nota">R$ ' + reais(pr.valor) + ' no ' + esc(nomeLoja(pr.loja)) + '</span>' : "") +
      '<span class="preco__por">R$ ' + reais(p.preco) + '</span></div>';
  }

  function htmlDisp(p) {
    if (estado.loja !== "todas") {
      var q = p.estoque[estado.loja];
      return q <= 2 ? '<p class="disp disp--pouco">Últimas unidades</p>' : '<p class="disp">Disponível nesta loja</p>';
    }
    var n = lojasCom(p).length;
    if (n === 1) return '<p class="disp' + (p.estoque[lojasCom(p)[0]] <= 2 ? " disp--pouco" : "") + '">Só no ' + esc(nomeLoja(lojasCom(p)[0])) + '</p>';
    return '<p class="disp">Disponível em ' + n + ' lojas</p>';
  }

  function htmlBotao(p) {
    var q = pedido[p.id];
    if (q) {
      return '<div class="qtd" role="group" aria-label="Quantidade de ' + esc(p._nome) + '">' +
        '<button type="button" data-menos="' + p.id + '" aria-label="Diminuir">−</button><output>' + q + '</output>' +
        '<button type="button" data-mais="' + p.id + '" aria-label="Aumentar">+</button></div>';
    }
    return '<button class="botao ' + (p.consulta ? "botao--contorno" : "botao--marca") + '" type="button" data-add="' + p.id + '">' +
      (p.consulta ? "Consultar" : "Adicionar") + '</button>';
  }

  function card(p) {
    var d = desconto(p);
    var selo = d >= 1 ? '<span class="selo">-' + d + '%</span>' :
      (promoDe(p, "todas") ? '<span class="selo">Oferta</span>' : (p.med ? '<span class="selo selo--med">Medicamento</span>' : ""));
    return '<article class="card" data-card="' + p.id + '">' +
      '<button class="card__foto" type="button" data-abrir="' + p.id + '" aria-label="Ver detalhes de ' + esc(p._nome) + '">' + selo + foto(p) + '</button>' +
      '<div class="card__corpo">' +
      '<p class="card__marca">' + esc(p._marca || " ") + '</p>' +
      '<h3 class="card__nome"><button type="button" data-abrir="' + p.id + '">' + esc(p._nome) + '</button></h3>' +
      htmlPreco(p) + htmlDisp(p) +
      '<div class="card__acao">' + htmlBotao(p) + '</div>' +
      '</div></article>';
  }

  function atualizarCards(id) {
    document.querySelectorAll('[data-card="' + id + '"] .card__acao').forEach(function (el) { el.innerHTML = htmlBotao(porId[id]); });
  }

  /* ================= filtros ================= */
  function visivel(p, loja) { return loja === "todas" || !!p.estoque[loja]; }

  function buscar(termo, loja) {
    var t = norm(termo).trim();
    var termos = t.split(/\s+/).filter(Boolean);
    var digitos = /^\d{5,}$/.test(t);
    return dados.produtos.filter(function (p) {
      if (!visivel(p, loja)) return false;
      if (digitos) return p.ean.indexOf(t) >= 0 || String(p.id) === t;
      for (var i = 0; i < termos.length; i++) if (p._busca.indexOf(termos[i]) < 0) return false;
      return true;
    });
  }

  function listaAtual() {
    var lista = estado.q ? buscar(estado.q, estado.loja) : dados.produtos.filter(function (p) { return visivel(p, estado.loja); });
    if (estado.cat) lista = lista.filter(function (p) { return p._cats[estado.cat]; });
    if (estado.ofertas) lista = lista.filter(function (p) { return promoDe(p, estado.loja); });
    var primeiro = norm(estado.q).split(/\s+/)[0] || "";
    var ordem = estado.ordem;
    lista.sort(function (a, b) {
      if (ordem === "menor" || ordem === "maior") {
        var pa = precoNaLoja(a, estado.loja), pb = precoNaLoja(b, estado.loja);
        if (pa == null && pb != null) return 1;
        if (pb == null && pa != null) return -1;
        if (pa != null && pb != null && pa !== pb) return ordem === "menor" ? pa - pb : pb - pa;
      } else if (ordem === "desconto") {
        var d = descontoMax(b) - descontoMax(a);
        if (d) return d;
      } else if (ordem === "relevancia") {
        if (primeiro) {
          var ia = a._nomeNorm.indexOf(primeiro) === 0 ? 0 : 1, ib = b._nomeNorm.indexOf(primeiro) === 0 ? 0 : 1;
          if (ia !== ib) return ia - ib;
        }
        var fa = a.img ? 0 : 1, fb = b.img ? 0 : 1;
        if (fa !== fb) return fa - fb;
        var ca = a.consulta ? 1 : 0, cb = b.consulta ? 1 : 0;
        if (ca !== cb) return ca - cb;
      }
      return a._nomeNorm < b._nomeNorm ? -1 : a._nomeNorm > b._nomeNorm ? 1 : 0;
    });
    return lista;
  }

  /* ================= cabecalho, menu, rodape ================= */
  function htmlLogo() {
    if (CFG.logo) return '<img src="' + esc(CFG.logo) + '" alt="Drogaria Popular Farmanutri">';
    return '<img class="logo__icone" src="logo-cruz.png" alt="" width="180" height="185">' +
      '<img src="logo-texto.png" alt="Drogaria Popular Farmanutri" width="385" height="200">';
  }

  function raizes() {
    return dados.categorias.filter(function (c) { return !c.pai || !catPorId[c.pai]; })
      .sort(function (a, b) { return b._qtd - a._qtd; });
  }

  function montarMenu() {
    var html = raizes().slice(0, 9).map(function (c) {
      return '<li><a href="#cat-' + c.id + '" data-cat="' + c.id + '">' + esc(c._nome) + '</a></li>';
    }).join("");
    if (dados.produtos.some(function (p) { return p.promo; })) {
      html = '<li><a class="menu__ofertas" href="#ofertas" data-ir="ofertas">Ofertas</a></li>' + html;
    }
    $("menu-lista").innerHTML = html;
    $("lista-categorias").innerHTML = '<ul class="cat-arvore">' + raizes().map(function (c) {
      var sub = (filhos[c.id] || []).filter(function (f) { return f._qtd; });
      return '<li><a href="#cat-' + c.id + '" data-cat="' + c.id + '">' + esc(c._nome) + '</a>' +
        (sub.length ? '<ul>' + sub.map(function (f) { return '<li><a href="#cat-' + f.id + '" data-cat="' + f.id + '">' + esc(f._nome) + '</a></li>'; }).join("") + '</ul>' : "") +
        '</li>';
    }).join("") + '</ul>';
  }

  function montarLojas() {
    var opcoes = [{ id: "todas", nome: "Todas as lojas", txt: "Ver o estoque de todas" }].concat(dados.lojas.map(function (l) {
      return { id: String(l.id), nome: nomeLoja(l.id), txt: l.endereco + " - " + l.bairro };
    }));
    $("menu-lojas").innerHTML = '<p>Mostramos o estoque e as ofertas da loja escolhida.</p>' + opcoes.map(function (o) {
      return '<button type="button" role="menuitemradio" aria-checked="' + (estado.loja === o.id) + '" data-loja="' + o.id + '"><strong>' +
        esc(o.nome) + '</strong><span>' + esc(o.txt) + '</span></button>';
    }).join("");
    $("loja-atual").textContent = estado.loja === "todas" ? "Todas as lojas" : nomeLoja(estado.loja);
  }

  function montarRodape() {
    $("logo").innerHTML = htmlLogo();
    $("logo-rodape").innerHTML = '<img src="logo-completo.png" alt="Drogaria Popular Farmanutri" width="344" height="360">';
    var w = linkWhats("", "Olá! Vim pelo site da Farmanutri.");
    ["faixa-whats", "rodape-whats", "btn-atendimento"].forEach(function (id) { $(id).href = w; });
    var tel = telefone(CFG.whatsapp_padrao);
    $("faixa-whats").textContent = tel;
    $("rodape-whats").textContent = tel;
    $("rodape-horario").textContent = CFG.horario || "";
    $("rodape-lojas").innerHTML = dados.lojas.map(function (l) {
      var t = telefone(l.telefone);
      var lic = (CFG.licenca_sanitaria || {})[l.id];
      return '<li class="loja"><h3>' + esc(nomeLoja(l.id)) + '</h3>' +
        '<p>' + esc(l.endereco) + '<br>' + esc(l.bairro) + ', ' + esc(l.cidade) +
        (l.cep ? '<br>CEP ' + esc(String(l.cep).replace(/^(\d{5})(\d{3})$/, "$1-$2")) : "") +
        (t ? '<br>Telefone ' + esc(t) : "") + '</p>' +
        '<p class="loja__legal">' +
        (l.farmaceutico ? "Farmacêutica responsável: " + esc(l.farmaceutico) + (l.crf ? " (CRF-MG " + esc(l.crf) + ")" : "") + "<br>" : "") +
        esc(l.razao_social) + (l.cnpj ? "<br>CNPJ " + esc(cnpj(l.cnpj)) : "") +
        (lic ? "<br>Licença sanitária " + esc(lic) : "") + (CFG.afe ? "<br>AFE ANVISA " + esc(CFG.afe) : "") +
        '</p></li>';
    }).join("");
    var nota = $("rodape-nota");
    var at = quandoAtualizou(dados.gerado_em);
    if (at) nota.textContent = at + " " + nota.textContent;
  }

  function quandoAtualizou(iso) {
    var d = new Date(iso);
    if (!iso || isNaN(d)) return "";
    var hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    var hoje = d.toDateString() === new Date().toDateString();
    return "Preços e estoque atualizados " + (hoje ? "hoje" : "em " + d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })) + " às " + hora + ".";
  }

  /* ================= pagina inicial ================= */
  var ATALHOS_PADRAO = [
    { titulo: "Proteção solar", busca: "protetor" }, { titulo: "Cabelos", busca: "shampoo" },
    { titulo: "Vitaminas", busca: "vitamina" }, { titulo: "Fraldas", busca: "fralda" },
    { titulo: "Higiene bucal", busca: "dental" }, { titulo: "Desodorantes", busca: "desodorante" },
    { titulo: "Hidratantes", busca: "hidratante" }, { titulo: "Absorventes", busca: "absorvente" }
  ];
  var BUSCAS_PADRAO = ["protetor solar", "fralda", "vitamina c", "shampoo", "desodorante", "fio dental", "álcool em gel", "termômetro"];

  function linkBanner(b) {
    var l = String(b.link || "");
    if (l === "whatsapp") return { href: linkWhats("", "Olá! Quero tirar uma dúvida: " + b.titulo + "."), ext: true };
    return { href: l || "#ofertas", ext: false };
  }

  function telaInicio() {
    var banners = (CFG.banners || []).map(function (b, i) {
      var l = linkBanner(b);
      var estilo = b.estilo || "verde";
      var arte = b.icone === "oferta" ? '<span class="banner__pct">%</span>' :
        b.icone === "logo" ? '<img src="logo-vermelho.webp" alt="" width="600" height="600">' : icone(b.icone || "cruz");
      return '<section class="banner banner--' + esc(estilo) + '" aria-roledescription="banner" aria-label="' + (i + 1) + ' de ' + CFG.banners.length + '">' +
        '<div><h2>' + esc(b.titulo) + '</h2><p>' + esc(b.texto) + '</p>' +
        '<a class="botao ' + (estilo === "amarelo" ? "botao--escuro" : "botao--branco") + '" href="' + esc(l.href) + '"' +
        (l.ext ? ' target="_blank" rel="noopener"' : ' data-link="' + esc(l.href) + '"') + '>' + esc(b.botao || "Ver mais") + '</a></div>' +
        '<div class="banner__arte" aria-hidden="true">' + arte + '</div></section>';
    }).join("");

    var beneficios = [
      ["whatsapp", "Pedido pelo WhatsApp", "Monte a lista aqui e envie para a loja"],
      ["loja", "Retire na loja", "Escolha a Farmanutri mais perto de você"],
      ["jaleco", "Orientação farmacêutica", "Tire dúvidas antes de comprar"],
      ["relogio", "Estoque atualizado", "Preços e estoque conferidos a cada 30 minutos"]
    ].map(function (b) {
      return '<li class="beneficio">' + icone(b[0]) + '<div><strong>' + b[1] + '</strong><span>' + b[2] + '</span></div></li>';
    }).join("");

    var circulos = raizes().slice(0, 12).map(function (c) {
      return '<a class="circulo" href="#cat-' + c.id + '" data-cat="' + c.id + '"><span class="circulo__img">' + icone(iconeCategoria(c.nome)) + '</span>' + esc(c._nome) + '</a>';
    }).join("");

    var ofertas = dados.produtos.filter(function (p) { return visivel(p, estado.loja) && promoDe(p, estado.loja); })
      .sort(function (a, b) { return descontoMax(b) - descontoMax(a) || (b.img || 0) - (a.img || 0); }).slice(0, 18);

    var atalhos = (CFG.atalhos || ATALHOS_PADRAO).map(function (a) {
      var n = buscar(a.busca, "todas").length;
      return n ? '<a class="atalho" href="#busca" data-busca="' + esc(a.busca) + '"><strong>' + esc(a.titulo) + '</strong><span>' + n + (n === 1 ? " produto" : " produtos") + '</span></a>' : "";
    }).filter(Boolean).slice(0, 8);

    var nomesVitrine = CFG.vitrines && CFG.vitrines.length ? CFG.vitrines : null;
    var vitrines = (nomesVitrine ? nomesVitrine.map(function (n) {
      return raizes().concat(dados.categorias).filter(function (c) { return norm(c.nome).indexOf(norm(n)) >= 0; })[0];
    }).filter(Boolean) : raizes().filter(function (c) { return !/medic/.test(norm(c.nome)); }).slice(0, 3));

    var html = '<div class="in">' +
      (banners ? '<div class="banners" id="banners"><div class="banners__trilho" id="banners-trilho">' + banners + '</div>' +
        (CFG.banners.length > 1 ? '<button class="seta seta--esq" type="button" data-banner="-1" aria-label="Banner anterior">' + icone("setaE", ' width="20" height="20"') + '</button>' +
          '<button class="seta seta--dir" type="button" data-banner="1" aria-label="Próximo banner">' + icone("seta", ' width="20" height="20"') + '</button>' +
          '<div class="banners__pontos" id="banners-pontos">' + CFG.banners.map(function (b, i) { return '<button type="button" data-ponto="' + i + '" aria-label="Banner ' + (i + 1) + '"></button>'; }).join("") + '</div>' : "") +
        '</div>' : "") +
      '<ul class="beneficios">' + beneficios + '</ul>' +
      (circulos ? '<section class="secao"><div class="secao__topo"><h2>Categorias</h2></div><div class="circulos">' + circulos + '</div></section>' : "") +
      (ofertas.length ? faixaProdutos("Ofertas em destaque" + (estado.loja !== "todas" ? " no " + nomeLoja(estado.loja) : ""), ofertas, "#ofertas", 'data-ir="ofertas"') : "") +
      (atalhos.length ? '<section class="secao"><div class="secao__topo"><h2>Do que você precisa hoje?</h2></div><div class="atalhos">' + atalhos.join("") + '</div></section>' : "");

    vitrines.forEach(function (c) {
      var itens = dados.produtos.filter(function (p) { return p._cats[c.id] && visivel(p, estado.loja); })
        .sort(function (a, b) { return (b.img || 0) - (a.img || 0) || (promoDe(b, estado.loja) ? 1 : 0) - (promoDe(a, estado.loja) ? 1 : 0); }).slice(0, 16);
      if (itens.length) html += faixaProdutos(c._nome, itens, "#cat-" + c.id, 'data-cat="' + c.id + '"');
    });

    html += '<section class="secao" id="como-funciona"><div class="secao__topo"><h2>Como pedir pelo site</h2></div><ol class="passos">' +
      '<li class="passo"><strong>Escolha os produtos</strong><span>Busque pelo nome ou navegue pelas categorias e toque em Adicionar.</span></li>' +
      '<li class="passo"><strong>Envie pelo WhatsApp</strong><span>Em Meu pedido, escolha a loja e toque em Enviar pedido. A mensagem já vai pronta.</span></li>' +
      '<li class="passo"><strong>Retire na loja</strong><span>A gente confirma preço e estoque pelo WhatsApp e separa tudo para você.</span></li>' +
      '</ol></section>';

    html += '<section class="secao"><div class="secao__topo"><h2>Buscas em alta</h2></div><div class="chips">' +
      (CFG.buscas_alta || BUSCAS_PADRAO).map(function (b) { return '<a class="chip" href="#busca" data-busca="' + esc(b) + '">' + esc(b) + '</a>'; }).join("") +
      '</div></section></div>';

    $("tela-inicio").innerHTML = html;
    iniciarBanners();
    document.querySelectorAll("#tela-inicio .trilho").forEach(function (tr) {
      var esq = tr.previousElementSibling, dir = tr.nextElementSibling;
      function setas() {
        esq.disabled = tr.scrollLeft < 8;
        dir.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 8;
      }
      tr.addEventListener("scroll", setas, { passive: true });
      setas();
    });
  }

  function faixaProdutos(titulo, itens, href, attr) {
    var id = "f" + Math.random().toString(36).slice(2, 8);
    return '<section class="secao"><div class="secao__topo"><h2>' + esc(titulo) + '</h2>' +
      '<a class="ver-todos" href="' + href + '" ' + attr + '>Ver todos</a></div>' +
      '<div class="faixa-prod"><button class="seta seta--esq" type="button" data-rolar="' + id + '" data-dir="-1" aria-label="Voltar" disabled>' + icone("setaE", ' width="20" height="20"') + '</button>' +
      '<div class="trilho" id="' + id + '">' + itens.map(card).join("") + '</div>' +
      '<button class="seta seta--dir" type="button" data-rolar="' + id + '" data-dir="1" aria-label="Avançar">' + icone("seta", ' width="20" height="20"') + '</button></div></section>';
  }

  var timerBanner;
  function iniciarBanners() {
    clearInterval(timerBanner);
    var trilho = $("banners-trilho");
    if (!trilho) return;
    var pontos = $("banners-pontos");
    var total = trilho.children.length;
    function atual() { return Math.round(trilho.scrollLeft / trilho.clientWidth); }
    function marcar() {
      if (!pontos) return;
      var a = atual();
      Array.prototype.forEach.call(pontos.children, function (b, i) { b.setAttribute("aria-current", i === a ? "true" : "false"); });
    }
    trilho.addEventListener("scroll", function () { window.requestAnimationFrame(marcar); }, { passive: true });
    marcar();
    window.irBanner = function (i) { trilho.scrollTo({ left: ((i + total) % total) * trilho.clientWidth, behavior: "smooth" }); };
    window.passoBanner = function (d) { window.irBanner(atual() + d); };
    var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (total > 1 && !calmo) {
      var pausado = false;
      $("banners").addEventListener("mouseenter", function () { pausado = true; });
      $("banners").addEventListener("mouseleave", function () { pausado = false; });
      $("banners").addEventListener("touchstart", function () { pausado = true; }, { passive: true });
      timerBanner = setInterval(function () { if (!pausado && !document.hidden) window.passoBanner(1); }, 7000);
    }
  }

  /* ================= lista (busca, categoria, ofertas) ================= */
  function telaLista() {
    var lista = listaAtual();
    var titulo = estado.q ? "Resultados para “" + estado.q + "”" : estado.cat ? catPorId[estado.cat]._nome : estado.ofertas ? "Ofertas" : "Todos os produtos";
    var trilha = '<a href="#inicio" data-ir="inicio">Início</a> <span aria-hidden="true">›</span> ';
    if (estado.cat && catPorId[estado.cat] && catPorId[estado.cat].pai && catPorId[catPorId[estado.cat].pai]) {
      var pai = catPorId[catPorId[estado.cat].pai];
      trilha += '<a href="#cat-' + pai.id + '" data-cat="' + pai.id + '">' + esc(pai._nome) + '</a> <span aria-hidden="true">›</span> ';
    }
    trilha += '<span>' + esc(titulo) + '</span>';

    // Base para contar subcategorias (sem o filtro de categoria)
    var base = estado.q ? buscar(estado.q, estado.loja) : dados.produtos.filter(function (p) { return visivel(p, estado.loja); });
    if (estado.ofertas) base = base.filter(function (p) { return promoDe(p, estado.loja); });
    var cand = estado.cat ? (filhos[estado.cat] || []) : raizes();
    var contagem = cand.map(function (c) {
      return { c: c, n: base.filter(function (p) { return p._cats[c.id]; }).length };
    }).filter(function (x) { return x.n; });

    var filtroCat = contagem.length ? '<section><h2>' + (estado.cat ? "Subcategorias" : "Categorias") + '</h2>' +
      contagem.map(function (x) {
        return '<label><input type="checkbox" data-filtro-cat="' + x.c.id + '"> ' + esc(x.c._nome) + ' <span>' + x.n + '</span></label>';
      }).join("") + '</section>' : "";
    if (estado.cat) {
      filtroCat = '<section><h2>Categoria</h2><label><input type="checkbox" checked data-limpar-cat> ' + esc(catPorId[estado.cat]._nome) + '</label></section>' + filtroCat;
    }
    var filtroLoja = '<section><h2>Loja</h2>' + [{ id: "todas", n: "Todas as lojas" }].concat(dados.lojas.map(function (l) { return { id: String(l.id), n: nomeLoja(l.id) }; }))
      .map(function (o) { return '<label><input type="radio" name="f-loja" data-loja="' + o.id + '"' + (estado.loja === o.id ? " checked" : "") + '> ' + esc(o.n) + '</label>'; }).join("") + '</section>';
    var filtroOferta = '<section><h2>Preço</h2><label><input type="checkbox" id="f-ofertas"' + (estado.ofertas ? " checked" : "") + '> Só ofertas</label></section>';

    var visiveis = lista.slice(0, estado.limite);
    var corpo = lista.length ? '<div class="grade">' + visiveis.map(card).join("") + '</div>' +
      (lista.length > estado.limite ? '<div class="mais"><button class="botao botao--contorno" type="button" id="ver-mais">Mostrar mais produtos</button></div>' : "")
      : '<div class="vazio"><strong>' + (estado.q ? "Não encontramos “" + esc(estado.q) + "”" : "Nenhum produto aqui") +
        (estado.loja !== "todas" ? " no " + esc(nomeLoja(estado.loja)) : "") + '.</strong>' +
        '<p>Tente outra palavra ou veja todas as lojas. Se preferir, pergunte pelo WhatsApp: a gente confere e pode encomendar.</p>' +
        '<a class="botao botao--marca" target="_blank" rel="noopener" href="' + esc(linkWhats(estado.loja === "todas" ? "" : estado.loja, "Olá! Vocês têm " + (estado.q || "este produto") + "?")) + '">Perguntar pelo WhatsApp</a></div>';

    $("tela-lista").innerHTML = '<div class="in">' +
      '<nav class="trilha" aria-label="Você está em">' + trilha + '</nav>' +
      '<div class="lista__titulo"><h1>' + esc(titulo) + '</h1><span>' + lista.length.toLocaleString("pt-BR") + (lista.length === 1 ? " produto" : " produtos") +
      (estado.loja !== "todas" ? " no " + esc(nomeLoja(estado.loja)) : "") + '</span></div>' +
      '<div class="lista"><aside class="filtros" id="filtros" aria-label="Filtros">' + filtroCat + filtroLoja + filtroOferta + '</aside>' +
      '<div><div class="barra-lista"><button class="botao botao--contorno btn-filtros" type="button" id="btn-filtros" aria-controls="filtros" aria-expanded="false">Filtrar</button>' +
      '<label>Ordenar por <select id="ordem">' +
      [["relevancia", "Mais relevantes"], ["menor", "Menor preço"], ["maior", "Maior preço"], ["desconto", "Maior desconto"], ["nome", "Nome de A a Z"]]
        .map(function (o) { return '<option value="' + o[0] + '"' + (estado.ordem === o[0] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("") +
      '</select></label></div>' + corpo + '</div></div></div>';
  }

  /* ================= navegacao ================= */
  function desenhar(rolarTopo) {
    var inicio = estado.tela === "inicio";
    $("tela-inicio").hidden = !inicio;
    $("tela-lista").hidden = inicio;
    if (inicio) telaInicio(); else telaLista();
    document.querySelectorAll("#menu-lista a").forEach(function (a) {
      var ativo = (a.getAttribute("data-cat") && String(estado.cat) === a.getAttribute("data-cat") && !estado.q) ||
        (a.getAttribute("data-ir") === "ofertas" && estado.ofertas && !estado.cat && !estado.q);
      if (ativo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (rolarTopo) window.scrollTo(0, 0);
  }

  function ir(tela, opcoes) {
    opcoes = opcoes || {};
    estado.tela = tela;
    estado.q = opcoes.q || "";
    estado.cat = opcoes.cat || null;
    estado.ofertas = !!opcoes.ofertas;
    estado.limite = POR_PAGINA;
    if (tela !== "inicio" && !opcoes.manterOrdem) estado.ordem = opcoes.ofertas ? "desconto" : "relevancia";
    $("q").value = estado.q;
    var hash = tela === "inicio" ? "#inicio" : estado.q ? "#busca" : estado.cat ? "#cat-" + estado.cat : "#ofertas";
    if (location.hash !== hash) { try { history.pushState(null, "", hash); } catch (e) { /* sem historico */ } }
    fecharTudo();
    desenhar(true);
  }

  function lerHash() {
    var h = (location.hash || "").slice(1);
    var m = /^cat-(\d+)$/.exec(h);
    if (m && catPorId[m[1]]) return ir("lista", { cat: Number(m[1]) });
    if (h === "ofertas") return ir("lista", { ofertas: true });
    if (h === "busca" && estado.q) return ir("lista", { q: estado.q });
    if (h === "como-funciona") { ir("inicio"); var el = $("como-funciona"); if (el) el.scrollIntoView(); return; }
    ir("inicio");
  }

  function seguirLink(href) {
    href = String(href || "");
    var m = /^#busca:(.+)$/.exec(href);
    if (m) return ir("lista", { q: decodeURIComponent(m[1]) });
    m = /^#categoria:(.+)$/.exec(href);
    if (m) {
      var c = dados.categorias.filter(function (x) { return norm(x.nome).indexOf(norm(decodeURIComponent(m[1]))) >= 0; })[0];
      return c ? ir("lista", { cat: c.id }) : ir("lista", { q: decodeURIComponent(m[1]) });
    }
    if (href === "#ofertas") return ir("lista", { ofertas: true });
    if (href === "#como-funciona") {
      if (estado.tela !== "inicio") ir("inicio");
      var el = $("como-funciona"); if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    var c2 = /^#cat-(\d+)$/.exec(href);
    if (c2) return ir("lista", { cat: Number(c2[1]) });
    ir("inicio");
  }

  /* ================= pedido ================= */
  function totalItens() { return Object.keys(pedido).reduce(function (s, k) { return s + pedido[k]; }, 0); }

  function mudarQtd(id, delta) {
    id = String(id);
    var p = porId[id];
    if (!p) return;
    var antes = pedido[id] || 0;
    var q = Math.max(0, Math.min(99, antes + delta));
    if (q) pedido[id] = q; else delete pedido[id];
    salvar(CHAVE_PEDIDO, pedido);
    atualizarCards(id);
    contador();
    if ($("painel-pedido").open) desenharPedido();
    if ($("modal-produto").open && $("modal-corpo").getAttribute("data-id") === id) abrirProduto(id, true);
    if (!antes && q) toast((p.consulta ? "Adicionado para consultar: " : "Adicionado: ") + p._nome);
  }

  function contador() {
    var n = totalItens();
    var el = $("contador");
    el.hidden = !n;
    el.textContent = n > 99 ? "99+" : n;
    $("btn-pedido").setAttribute("aria-label", "Meu pedido, " + n + (n === 1 ? " item" : " itens"));
  }

  function desenharPedido() {
    var ids = Object.keys(pedido).filter(function (id) { return porId[id]; });
    if (!lojaPedido || !lojaPorId[lojaPedido]) lojaPedido = estado.loja !== "todas" ? estado.loja : (dados.lojas[0] ? String(dados.lojas[0].id) : "");
    if (!ids.length) {
      $("pedido-corpo").innerHTML = '<div class="pedido-vazio"><strong>Seu pedido está vazio</strong>Adicione produtos para enviar a lista pelo WhatsApp.</div>';
      $("pedido-pe").innerHTML = '<button class="botao botao--contorno botao--largo" type="button" data-fechar>Continuar olhando</button>';
      return;
    }
    var total = 0, consultas = 0;
    $("pedido-corpo").innerHTML = ids.map(function (id) {
      var p = porId[id], q = pedido[id];
      var preco = precoNaLoja(p, lojaPedido);
      if (preco != null) total += preco * q; else consultas++;
      var falta = !p.estoque[lojaPedido];
      return '<div class="item"><div class="item__foto">' + foto(p) + '</div><div>' +
        '<p class="item__nome">' + esc(p._nome) + '</p>' +
        (falta ? '<p class="item__alerta">Sem estoque no ' + esc(nomeLoja(lojaPedido)) + '. Tem em: ' + esc(lojasCom(p).map(nomeLoja).join(", ")) + '.</p>' : "") +
        '<div class="item__linha"><div class="qtd" role="group" aria-label="Quantidade"><button type="button" data-menos="' + id + '" aria-label="Diminuir">−</button><output>' + q + '</output><button type="button" data-mais="' + id + '" aria-label="Aumentar">+</button></div>' +
        '<span class="item__preco">' + (preco != null ? "R$ " + reais(preco * q) : "Preço na loja") + '</span></div>' +
        '<button class="remover" type="button" data-remover="' + id + '">Remover</button></div></div>';
    }).join("");
    $("pedido-pe").innerHTML =
      '<label class="pe__loja" for="pedido-loja">Retirar na loja<select id="pedido-loja">' + dados.lojas.map(function (l) {
        return '<option value="' + l.id + '"' + (String(l.id) === lojaPedido ? " selected" : "") + '>' + esc(nomeLoja(l.id)) + ' - ' + esc(l.endereco) + '</option>';
      }).join("") + '</select></label>' +
      '<div class="pe__total"><span>Total estimado</span><strong>R$ ' + reais(total) + '</strong></div>' +
      (consultas ? '<p class="pe__nota">Mais ' + consultas + (consultas === 1 ? " item" : " itens") + ' com preço informado na loja.</p>' : "") +
      '<p class="pe__nota">O pagamento é feito na loja. A gente confirma preço e estoque pelo WhatsApp antes de separar.</p>' +
      '<a class="botao botao--marca botao--largo" id="enviar-pedido" target="_blank" rel="noopener" href="' + esc(linkPedido(ids, total)) + '">' +
      icone("whatsapp", ' width="20" height="20"') + 'Enviar pedido pelo WhatsApp</a>' +
      '<button class="remover" type="button" data-limpar-pedido>Limpar pedido</button>';
  }

  function linkPedido(ids, total) {
    var linhas = ids.map(function (id) {
      var p = porId[id], q = pedido[id], preco = precoNaLoja(p, lojaPedido);
      return "• " + q + "x " + p._nome + " (cód. " + p.id + ")" + (preco != null ? " - R$ " + reais(preco) + " cada" : " - consultar preço");
    });
    var txt = "Olá! Quero fazer um pedido pelo site para retirar na loja " + nomeLoja(lojaPedido) + ":\n\n" + linhas.join("\n") +
      (total ? "\n\nTotal estimado: R$ " + reais(total) : "") + "\n\nPode confirmar, por favor?";
    return linkWhats(lojaPedido, txt);
  }

  /* ================= detalhe do produto ================= */
  function abrirProduto(id, soAtualizar) {
    var p = porId[id];
    if (!p) return;
    var lojas = dados.lojas.map(function (l) {
      var q = p.estoque[l.id];
      var st = !q ? '<span class="nao">Sem estoque</span>' : q <= 2 ? '<span class="pouco">Últimas unidades</span>' : '<span class="tem">Disponível</span>';
      var pr = p.promo && p.promo[l.id] && q ? ' <small>(R$ ' + reais(p.promo[l.id]) + ')</small>' : "";
      return '<li><span>' + esc(nomeLoja(l.id)) + pr + '</span>' + st + '</li>';
    }).join("");
    var d = desconto(p);
    var msg = (p.consulta ? "Olá! Quero saber o preço e a disponibilidade de: " : "Olá! Tenho uma dúvida sobre: ") + p._nome + " (cód. " + p.id + ").";
    $("modal-corpo").setAttribute("data-id", id);
    $("modal-corpo").innerHTML = '<div class="detalhe">' +
      '<div class="detalhe__foto">' + (d ? '<span class="selo">-' + d + '%</span>' : "") + foto(p) + '</div>' +
      '<div><p class="card__marca">' + esc(p._marca) + '</p><h2>' + esc(p._nome) + '</h2>' +
      htmlPreco(p) +
      (p.consulta ? '<p class="detalhe__aviso">Medicamento: o preço e a venda são feitos na loja, com orientação farmacêutica.</p>' : "") +
      '<ul class="detalhe__lojas" aria-label="Estoque por loja">' + lojas + '</ul>' +
      '<div class="detalhe__acoes"><div class="card__acao" data-card="' + p.id + '">' + htmlBotao(p) + '</div>' +
      '<a class="botao botao--contorno" target="_blank" rel="noopener" href="' + esc(linkWhats(estado.loja === "todas" ? "" : estado.loja, msg)) + '">Perguntar pelo WhatsApp</a></div>' +
      '<p class="detalhe__cod">Código ' + p.id + (p.ean ? " · EAN " + esc(p.ean) : "") + '</p></div></div>';
    if (!soAtualizar && !$("modal-produto").open) abrirDialogo($("modal-produto"));
  }

  /* ================= dialogos e avisos ================= */
  function abrirDialogo(d) {
    if (d.open) return;
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  function fecharTudo() {
    ["painel-categorias", "painel-pedido", "modal-produto"].forEach(function (id) { var d = $(id); if (d.open) d.close(); });
    fecharLojas();
  }
  function fecharLojas() { $("menu-lojas").hidden = true; $("btn-loja").setAttribute("aria-expanded", "false"); }

  var timerToast;
  function toast(txt) {
    var t = $("toast");
    t.innerHTML = '<span>' + esc(txt) + '</span><button type="button" data-ver-pedido>Ver pedido</button>';
    t.hidden = false;
    clearTimeout(timerToast);
    timerToast = setTimeout(function () { t.hidden = true; }, 3500);
  }

  function trocarLoja(id) {
    estado.loja = id;
    salvar(CHAVE_LOJA, id);
    if (id !== "todas") lojaPedido = id;
    montarLojas();
    fecharLojas();
    estado.limite = POR_PAGINA;
    desenhar(false);
  }

  /* ================= eventos ================= */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var el;
    if ((el = t.closest("[data-add]"))) { mudarQtd(el.getAttribute("data-add"), 1); return; }
    if ((el = t.closest("[data-mais]"))) { mudarQtd(el.getAttribute("data-mais"), 1); return; }
    if ((el = t.closest("[data-menos]"))) { mudarQtd(el.getAttribute("data-menos"), -1); return; }
    if ((el = t.closest("[data-remover]"))) { mudarQtd(el.getAttribute("data-remover"), -99); return; }
    if ((el = t.closest("[data-abrir]"))) { abrirProduto(el.getAttribute("data-abrir")); return; }
    if (t.closest("[data-limpar-pedido]")) { pedido = {}; salvar(CHAVE_PEDIDO, pedido); contador(); desenharPedido(); desenhar(false); return; }
    if (t.closest("[data-ver-pedido]")) { $("toast").hidden = true; desenharPedido(); abrirDialogo($("painel-pedido")); return; }
    if ((el = t.closest("[data-fechar]"))) { var d = el.closest("dialog"); if (d) d.close(); return; }
    if ((el = t.closest("[data-cat]")) && el.tagName === "A") { e.preventDefault(); ir("lista", { cat: Number(el.getAttribute("data-cat")) }); return; }
    if ((el = t.closest("[data-busca]"))) { e.preventDefault(); ir("lista", { q: el.getAttribute("data-busca") }); return; }
    if ((el = t.closest("[data-ir]"))) {
      e.preventDefault();
      if (el.getAttribute("data-ir") === "ofertas") ir("lista", { ofertas: true }); else ir("inicio");
      return;
    }
    if ((el = t.closest("[data-link]"))) { e.preventDefault(); seguirLink(el.getAttribute("data-link")); return; }
    if ((el = t.closest("[data-loja]")) && el.tagName === "BUTTON") { trocarLoja(el.getAttribute("data-loja")); return; }
    if ((el = t.closest("[data-banner]"))) { window.passoBanner(Number(el.getAttribute("data-banner"))); return; }
    if ((el = t.closest("[data-ponto]"))) { window.irBanner(Number(el.getAttribute("data-ponto"))); return; }
    if ((el = t.closest("[data-rolar]"))) {
      var tr = $(el.getAttribute("data-rolar"));
      tr.scrollBy({ left: Number(el.getAttribute("data-dir")) * tr.clientWidth * 0.85, behavior: "smooth" });
      return;
    }
    if (t.closest("#ver-mais")) { estado.limite += POR_PAGINA; desenhar(false); return; }
    if ((el = t.closest("#btn-filtros"))) {
      var f = $("filtros"); f.classList.toggle("aberto"); el.setAttribute("aria-expanded", f.classList.contains("aberto")); return;
    }
    if (t.closest("#btn-loja")) {
      var aberto = !$("menu-lojas").hidden;
      $("menu-lojas").hidden = aberto;
      $("btn-loja").setAttribute("aria-expanded", String(!aberto));
      return;
    }
    if (t.closest("#btn-categorias")) { abrirDialogo($("painel-categorias")); return; }
    if (t.closest("#btn-pedido")) { $("toast").hidden = true; desenharPedido(); abrirDialogo($("painel-pedido")); return; }
    if (!t.closest(".loja-escolha")) fecharLojas();
    if (t.tagName === "DIALOG") t.close(); // clique fora
  });

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.id === "ordem") { estado.ordem = t.value; estado.limite = POR_PAGINA; desenhar(false); return; }
    if (t.id === "f-ofertas") { estado.ofertas = t.checked; estado.limite = POR_PAGINA; desenhar(false); return; }
    if (t.id === "pedido-loja") { lojaPedido = t.value; desenharPedido(); return; }
    if (t.name === "f-loja") { trocarLoja(t.getAttribute("data-loja")); return; }
    if (t.hasAttribute("data-filtro-cat")) {
      estado.cat = Number(t.getAttribute("data-filtro-cat")); estado.limite = POR_PAGINA; desenhar(false); return;
    }
    if (t.hasAttribute("data-limpar-cat")) {
      var c = catPorId[estado.cat];
      estado.cat = c && c.pai && catPorId[c.pai] ? c.pai : null;
      estado.limite = POR_PAGINA;
      if (!estado.cat && !estado.q && !estado.ofertas) estado.ordem = "relevancia";
      desenhar(false);
    }
  });

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharLojas(); });
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (img.tagName === "IMG" && img.hasAttribute("data-ph")) {
      var s = document.createElement("span");
      s.className = "ph";
      s.innerHTML = icone(img.getAttribute("data-ph"));
      img.replaceWith(s);
    }
  }, true);

  $("form-busca").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("q").value.trim();
    if (q) ir("lista", { q: q }); else ir("inicio");
    $("q").blur();
  });
  window.addEventListener("popstate", lerHash);

  /* ================= inicio ================= */
  function iniciar(json) {
    dados = json;
    dados.categorias = dados.categorias || [];
    dados.lojas.forEach(function (l) { lojaPorId[String(l.id)] = l; });
    dados.categorias.forEach(function (c) { c._nome = nomeCategoria(c.nome); c._qtd = 0; catPorId[c.id] = c; });
    dados.categorias.forEach(function (c) { if (c.pai && catPorId[c.pai]) (filhos[c.pai] = filhos[c.pai] || []).push(c); });
    dados.produtos.forEach(function (p) {
      p.ean = p.ean || "";
      p._nome = nomeProduto(p.nome);
      p._marca = nomeMarca(p.marca || p.lab || "");
      p._nomeNorm = norm(p._nome);
      p._busca = norm(p._nome + " " + p._marca + " " + p.ean + " " + p.id);
      p._cats = {};
      (p.cats || []).forEach(function (c) { if (catPorId[c]) { p._cats[c] = 1; catPorId[c]._qtd++; } });
      var raiz = (p.cats || []).map(function (c) { return catPorId[c]; }).filter(function (c) { return c && !c.pai; })[0];
      p._icone = iconeCategoria(raiz ? raiz.nome : (p.med ? "medicamento" : ""));
      porId[String(p.id)] = p;
    });
    Object.keys(filhos).forEach(function (k) { filhos[k].sort(function (a, b) { return b._qtd - a._qtd; }); });

    var salva = ler(CHAVE_LOJA);
    if (salva && (salva === "todas" || lojaPorId[salva])) estado.loja = salva;
    var ped = ler(CHAVE_PEDIDO) || {};
    Object.keys(ped).forEach(function (id) { if (porId[id] && ped[id] > 0) pedido[id] = Math.min(99, ped[id]); });

    montarRodape();
    montarLojas();
    montarMenu();
    contador();
    var termo = new URLSearchParams(location.search).get("q");
    if (termo) { ir("lista", { q: termo }); return; }
    lerHash();
  }

  var versao = Math.floor(Date.now() / 300000);
  var fonte = window.CATALOGO_PREVIA ? Promise.resolve(window.CATALOGO_PREVIA) :
    fetch("catalogo.json?v=" + versao).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  fonte.then(iniciar).catch(function () {
    $("tela-inicio").innerHTML = '<div class="in"><div class="vazio" style="margin-top:24px"><strong>Não foi possível carregar os produtos agora.</strong><p>Atualize a página em alguns instantes ou fale com a gente pelo WhatsApp (38) 3212-4433.</p></div></div>';
  });
})();
