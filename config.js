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

  // Vitrines da pagina inicial: parte do nome da categoria do Automatiza.
  // Vazio = as categorias com mais produtos.
  vitrines: [],

  // Dados sanitarios obrigatorios (RDC 44/2009). Preencha antes de divulgar o site.
  afe: "",
  licenca_sanitaria: { "1": "", "3": "", "4": "", "6": "" }
};
