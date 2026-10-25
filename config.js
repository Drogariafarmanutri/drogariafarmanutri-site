/*
 * FARMANUTRI - configuracoes do site
 * Edite os valores entre aspas. Nao apague as virgulas nem as chaves.
 */
window.FARMANUTRI = {
  // WhatsApp com DDI + DDD + numero, so numeros.
  whatsapp_padrao: "553832124433",

  // WhatsApp de cada loja (codigo da loja no Automatiza). Vazio = usa o padrao.
  whatsapp_lojas: { "1": "", "3": "", "4": "", "6": "" },

  // Nome de cada loja como os clientes conhecem. Vazio = bairro do Automatiza.
  nome_lojas: { "1": "João Alves", "3": "Maracanã", "4": "Interlagos", "6": "São Geraldo" },

  // Horario de atendimento (aparece no rodape). Vazio = nao mostra.
  horario: "",

  // Logo do cabecalho. Vazio = usa o logo da Drogaria Popular Farmanutri que ja esta no site.
  // Para trocar, envie outro arquivo para a pasta do site e escreva o nome aqui (ex.: "logo-novo.png").
  logo: "",

  // Banners da pagina inicial (passam sozinhos).
  // link: "#ofertas", "#busca:protetor solar", "#categoria:HIGIENE" ou "whatsapp"
  // estilo: "vermelho", "amarelo", "verde" ou "escuro".  icone: "logo", "oferta", "whatsapp", "cruz", "bebe", "brilho"
  banners: [
    { titulo: "Drogaria Popular Farmanutri", texto: "Lojas em vários bairros de Montes Claros. Consulte preço e estoque e faça seu pedido pelo WhatsApp.",
      botao: "Ver ofertas", link: "#ofertas", estilo: "vermelho", icone: "logo" },
    { titulo: "Ofertas da semana", texto: "Preços especiais em higiene, beleza e cuidados, direto do estoque das nossas lojas.",
      botao: "Ver ofertas", link: "#ofertas", estilo: "amarelo", icone: "oferta" },
    { titulo: "Peça pelo WhatsApp e retire na loja", texto: "Escolha os produtos, envie o pedido e a gente confirma tudo antes de você sair de casa.",
      botao: "Como funciona", link: "#como-funciona", estilo: "verde", icone: "whatsapp" },
    { titulo: "Farmácia Popular", texto: "Medicamentos gratuitos ou com desconto pelo programa do Governo Federal. Traga receita, documento com foto e CPF.",
      botao: "Tirar dúvidas", link: "whatsapp", estilo: "escuro", icone: "cruz" }
  ],

  // ===================== DESTAQUES DE PRODUTO =====================
  // Como escolher o produto: use o CODIGO do produto no Automatiza. Foto, nome e preco
  // (com a oferta da loja) vem sempre do site, atualizados a cada 30 minutos.
  // de / ate: periodo em que aparece (AAAA-MM-DD). Fora do periodo some sozinho.
  // Produto sem estoque some sozinho. Medicamento de venda sob prescricao NAO aparece (RDC 96/2008);
  // medicamento isento aparece com a advertencia obrigatoria.
  // estilo: "amarelo", "vermelho", "verde" ou "escuro".
  // Tambem aceita uma ARTE PRONTA: envie a imagem para o GitHub (ex.: banners/natal.jpg) e use
  //   { imagem: "banners/natal.jpg", imagem_celular: "banners/natal-celular.jpg", link: "#busca:panetone", ate: "2026-12-25" }
  //   (tamanho sugerido: 1240x400 no computador e 800x800 no celular)
  // link aceita: "#ofertas", "#leve-mais", "#busca:protetor solar", "#categoria:Mamae", "#produto:54340" ou "whatsapp"

  // 1) BANNERS de produto: entram no carrossel da pagina inicial, antes dos banners acima
  destaques: [
    { codigo: 54340, titulo: "Oferta da semana", texto: "Proteção alta para o sol de Montes Claros.", estilo: "amarelo",
      de: "2026-10-24", ate: "2026-10-31" },
    { codigo: 50221, titulo: "Mamãe e bebê", estilo: "verde", de: "2026-10-24", ate: "2026-10-31" }
  ],

  // 2) FAIXA de aviso logo abaixo do menu, em todas as paginas (se tiver mais de uma, elas se revezam)
  faixas: [
    { texto: "Leve mais, pague menos: descontos maiores levando mais unidades.", botao: "Ver produtos", link: "#leve-mais",
      estilo: "amarelo", de: "2026-10-24", ate: "2026-10-31" },
    { texto: "Fralda Personal Baby Jumbo G com preço especial.", botao: "Ver oferta", codigo: 50221,
      estilo: "verde", de: "2026-10-24", ate: "2026-10-31" }
  ],

  // 3) CORTINA: janela que abre sozinha ao entrar no site (uma vez por dia para cada cliente).
  //    Use codigo (produto) OU imagem (arte pronta). Para desligar: cortina: null
  cortina: { codigo: 54340, titulo: "Imperdível", texto: "Só enquanto durar o estoque.", de: "2026-10-24", ate: "2026-10-31" },

  // Vitrines da pagina inicial: parte do nome da categoria do Automatiza.
  // Vazio = as categorias com mais produtos.
  vitrines: [],

  // Dados sanitarios obrigatorios (RDC 44/2009). Preencha antes de divulgar o site.
  afe: "",
  licenca_sanitaria: { "1": "", "3": "", "4": "", "6": "" }
};
