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
  bio: "Testo equipamento de setup, áudio e casa antes de indicar. Se não presta, não entra na lista.",
};

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/marcelomourojr/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marcelomourojr/" },
  { label: "GitHub", href: "https://github.com/marcelomourojr" },
  { label: "Portfólio", href: "/" },
];

// Dados fictícios — troque pelos produtos e links de afiliado reais.
// As fotos são do Unsplash só para demonstração; os dois últimos itens ficaram
// sem `image` de propósito, para mostrar como o card se comporta sem foto.
export const products: ProductLink[] = [
  {
    id: "fone-anc",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&q=75&auto=format&fit=crop",
    title: "Fone Bluetooth com cancelamento ativo",
    store: "mercadolivre",
    category: "Áudio",
    url: "https://exemplo.com/afiliado/fone-anc",
    featured: true,
  },
  {
    id: "teclado-75",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=640&q=75&auto=format&fit=crop",
    title: "Teclado mecânico 75% hot-swap",
    store: "amazon",
    category: "Setup",
    url: "https://exemplo.com/afiliado/teclado-75",
  },
  {
    id: "monitor-27",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=640&q=75&auto=format&fit=crop",
    title: 'Monitor 27" QHD 144Hz',
    store: "amazon",
    category: "Setup",
    url: "https://exemplo.com/afiliado/monitor-27",
  },
  {
    id: "microfone",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=640&q=75&auto=format&fit=crop",
    title: "Microfone condensador USB",
    store: "mercadolivre",
    category: "Áudio",
    url: "https://exemplo.com/afiliado/microfone",
  },
  {
    id: "suporte-notebook",
    image:
      "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?w=640&q=75&auto=format&fit=crop",
    title: "Suporte de notebook em alumínio",
    store: "shopee",
    category: "Setup",
    url: "https://exemplo.com/afiliado/suporte-notebook",
  },
  {
    id: "luminaria",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=640&q=75&auto=format&fit=crop",
    title: "Luminária de mesa com temperatura ajustável",
    store: "shopee",
    category: "Casa",
    url: "https://exemplo.com/afiliado/luminaria",
  },
  {
    id: "mousepad",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=640&q=75&auto=format&fit=crop",
    title: "Mousepad extenso 90x40cm",
    store: "shopee",
    category: "Setup",
    url: "https://exemplo.com/afiliado/mousepad",
  },
  {
    id: "cabo-usbc",
    title: "Cabo USB-C trançado 2m — 100W",
    store: "aliexpress",
    category: "Setup",
    url: "https://exemplo.com/afiliado/cabo-usbc",
  },
  {
    id: "organizador-cabos",
    title: "Kit organizador de cabos adesivo",
    store: "aliexpress",
    category: "Casa",
    url: "https://exemplo.com/afiliado/organizador-cabos",
  },
];
