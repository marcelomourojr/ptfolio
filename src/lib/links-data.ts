/**
 * Dados da página /links.
 *
 * Para adicionar um produto, basta acrescentar um item em `products`.
 * A ordem do array é a ordem que aparece na tela.
 */

export type StoreId = "mercadolivre" | "amazon" | "shopee" | "aliexpress";

/**
 * Cor de destaque da página inteira. Trocar aqui muda a faixa dos cards,
 * a seta no hover e o anel de foco de uma vez.
 */
export const ACCENT = "#F43F5E";

export interface Store {
  label: string;
}

// Mantido como referência: já não aparece na tela, mas diz de qual loja é
// cada link na hora de trocar pelas URLs reais de afiliado.
export const STORES: Record<StoreId, Store> = {
  mercadolivre: { label: "Mercado Livre" },
  amazon: { label: "Amazon" },
  shopee: { label: "Shopee" },
  aliexpress: { label: "AliExpress" },
};

export interface ProductLink {
  id: string;
  title: string;
  store: StoreId;
  category: string;
  url: string;
  /** Fixa o item no topo, num card maior. Use em no máximo um produto. */
  featured?: boolean;
  /** Opcional: caminho de uma imagem em /public. Se ausente, o card fica tipográfico. */
  image?: string;
}

export const profile = {
  /** Título exibido no topo da página. */
  title: "Links dos produtos",
  /** Não aparece no corpo da página — só no © do rodapé. */
  name: "Marcelo Mouro Jr",
};

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/marcelomourojr/" },
  // Caminho de volta ao portfólio: sem ele a /links fica sem nenhum link
  // interno de entrada nem de saída, e o buscador a trata como página solta.
  { label: "Portfólio", href: "/" },
];

// Produtos reais, com os links de afiliado do usuário (encurtadores do ML e
// da Shopee — eles carregam a atribuição, não trocar pela URL longa). As
// fotos são a imagem principal do carrossel de cada anúncio, reexportadas
// para /public/images/links a q75.
export const products: ProductLink[] = [
  {
    id: "easysmx-s15",
    image: "/images/links/easysmx-s15.webp",
    title: "Controle EasySMX S15 — Switch",
    store: "mercadolivre",
    category: "Controles",
    url: "https://meli.la/1jyAoru",
    featured: true,
  },
  {
    id: "ks42-hall",
    image: "/images/links/ks42-hall.webp",
    title: "Controle LinYuvo KS42 Efeito Hall — Switch",
    store: "mercadolivre",
    category: "Controles",
    url: "https://meli.la/2CBuSYN",
  },
  {
    id: "ks42-branco",
    image: "/images/links/ks42-branco.webp",
    title: "Controle LinYuvo KS42 Branco — Switch",
    store: "mercadolivre",
    category: "Controles",
    url: "https://meli.la/2Tv4B3Z",
  },
  {
    id: "gamepad-pro",
    image: "/images/links/gamepad-pro.webp",
    title: "Gamepad Pro Bluetooth — Switch/PC/Android",
    store: "shopee",
    category: "Controles",
    url: "https://s.shopee.com.br/4qFHVjXKQk",
  },
];
