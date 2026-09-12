/**
 * Os projetos do portfólio, num lugar só.
 *
 * Vive aqui, e não dentro de page.tsx, porque agora duas rotas leem estes
 * dados: a home (bento + modal, no cliente) e /projetos/[slug] (renderizada
 * no servidor). Antes disso, a descrição de cada projeto só existia depois
 * que o JavaScript montava o modal — invisível para buscador e para quem
 * quisesse mandar o link de um case específico.
 */

export interface ProjectDetail {
  title: string;
  year: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  link?: string;
  appStoreLink?: string;
  playStoreLink?: string;
  /** Capturas de celular ficam num slide mais estreito. */
  portrait?: boolean;
}

export interface Projeto extends ProjectDetail {
  /** Pedaço final da URL em /projetos/. */
  slug: string;
}

const dados: ProjectDetail[] = [
  {
    title: "Onsite Seguros",
    year: "2023",
    category: "Website",
    description: "Plataforma completa para gestão de seguros, com foco na experiência do usuário e otimização de fluxos de contratação.",
    images: [
      "/images/1on.webp",
      "/images/2on.webp",
      "/images/3on.webp"
    ],
    tags: ["Figma", "Framer"],
  },
  {
    title: "CupidLove",
    year: "2025",
    category: "Website",
    description: "Serviço de criação de sites personalizados como presentes digitais, transformando histórias, fotos e músicas em experiências interativas únicas para eternizar momentos especiais de forma criativa e emocional.",
    images: [
      "/images/1c.webp",
      "/images/2c.webp",
      "/images/3c.webp",
      "/images/4c.webp",
      "/images/5c.webp",
      "/images/6c.webp"
    ],
    tags: ["Figma", "Framer"],
    link: "https://cupidlove.com.br",
  },
  {
    title: "Verbo",
    year: "2025",
    category: "Mobile Design",
    description: "App com dinâmica estilo Duolingo, com trilhas, quizzes e progressão gamificada. Bíblia offline em vários idiomas, com navegação simples e intuitiva. Inclui áudio, marcações e busca inteligente para estudo diário. Conta com mais de 100 mil downloads e alto engajamento.",
    images: [
      "/images/Home.webp",
      "/images/Mensagens-do-dia.webp",
      "/images/Quiz.webp",
      "/images/reflexao.webp",
      "/images/Versiculo.webp"
    ],
    tags: ["Figma"],
    appStoreLink: "https://apps.apple.com/br/app/verbo-li%C3%A7%C3%B5es-da-b%C3%ADblia/id6751657587",
    playStoreLink: "https://play.google.com/store/apps/details?id=com.ver.bo&hl=pt_BR",
  },
  {
    title: "Sintony",
    year: "2025",
    category: "Mobile App",
    description: "App de relacionamento com IA que gera matches por afinidade real, usando filtros inteligentes de idade, distância e interesses, com chat seguro focado em privacidade e controle, já ultrapassando 500 mil downloads.",
    images: [
      "/images/1sintonywebp.webp",
      "/images/2sintony.webp",
      "/images/3sintony.webp",
      "/images/4sintony.webp",
      "/images/5sintony.webp",
      "/images/6sintony.webp"
    ],
    tags: ["Figma", "UI/UX", "Mobile"],
    appStoreLink: "https://apps.apple.com/br/app/sintony-namoro-e-match-por-ia/id6746660562",
    playStoreLink: "https://play.google.com/store/apps/details?id=com.sintony.go&hl=pt_BR",
  },
  {
    title: "KingChat",
    year: "2025",
    category: "Web App",
    description: "Plataforma de automação de conversas que utiliza chatbots e fluxos inteligentes para organizar, escalar e otimizar o atendimento, centralizando a comunicação e tornando as interações mais eficientes e estratégicas.",
    images: [
      "/images/Webchat-1.webp"
    ],
    tags: ["Figma", "Antigravity"],
  },
  {
    title: "Zé dos Concursos",
    year: "2025",
    category: "App Mobile & Website",
    description: "Plataforma web e aplicativo mobile que centralizam informações de concursos públicos, com busca inteligente, notícias atualizadas e assistente com IA, facilitando o acesso a oportunidades e otimizando a jornada de quem está se preparando.",
    images: [
      "/images/ze1.webp",
      "/images/ze2.webp",
      "/images/ze3.webp",
      "/images/ze4.webp",
      "/images/ze5.webp",
      "/images/ze6.webp",
      "/images/ze7.webp",
      "/images/ze8.webp"
    ],
    tags: ["React Native", "Expo", "TypeScript"],
    link: "https://zedosconcursos.com.br",
    appStoreLink: "https://apps.apple.com/br/app/z%C3%A9-dos-concursos/id6757822635",
    playStoreLink: "https://play.google.com/store/apps/details?id=com.zedosconcursos.app&hl=pt_BR",
  },
  {
    title: "Protech",
    year: "2026",
    category: "Website",
    description: "Serviço de criação de sites, páginas e sistemas com foco em conversão, unindo estratégia e design, com investimento acessível e modelo recorrente que garante manutenção contínua e suporte 24h, voltado a fortalecer a presença digital de negócios locais e sustentar seu crescimento.",
    images: [
      "/images/pt1.webp",
      "/images/pt2.webp",
      "/images/pt3.webp",
      "/images/pt4.webp",
      "/images/pt5.webp",
      "/images/pt6.webp",
      "/images/pt7.webp",
      "/images/pt8.webp"
    ],
    tags: ["Figma", "Antigravity"],
    link: "https://protech.studio",
  },
  {
    title: "Isaac the Barber",
    year: "2026",
    category: "Website",
    description: "Site premium desenvolvido para barbearia com foco em fortalecer a presença digital local, otimizado para SEO e alta performance, valorizando os serviços e transmitindo uma identidade visual sofisticada que atrai e converte clientes.",
    images: [
      "/images/Isaac1.webp",
      "/images/Isaac2.webp",
      "/images/Isaac3.webp",
      "/images/Isaac4.webp",
      "/images/Isaac5.webp"
    ],
    tags: ["Figma", "Web Design", "UI/UX"],
    link: "https://isaacthebarber.com.br"
  },
];

/**
 * Slug escrito à mão, não gerado do título.
 *
 * Gerar a partir do título faria a URL mudar sozinha se o título mudasse, e
 * URL publicada não pode quebrar. Também evita a transliteração de "Zé".
 */
const slugs: Record<string, string> = {
  "Verbo": "verbo",
  "Onsite Seguros": "onsite-seguros",
  "CupidLove": "cupidlove",
  "Sintony": "sintony",
  "KingChat": "kingchat",
  "Zé dos Concursos": "ze-dos-concursos",
  "Protech": "protech",
  "Isaac the Barber": "isaac-the-barber",
};

export const projetos: Projeto[] = dados.map((p) => {
  const slug = slugs[p.title];
  // Falha no build, não em produção: projeto novo sem slug seria uma página
  // fantasma no sitemap.
  if (!slug) throw new Error(`Projeto "${p.title}" está sem slug em projects-data.ts`);
  return { ...p, slug };
});

export function acharProjeto(slug: string): Projeto | undefined {
  return projetos.find((p) => p.slug === slug);
}

export function acharPorTitulo(titulo: string): Projeto {
  const p = projetos.find((x) => x.title === titulo);
  if (!p) throw new Error(`Projeto "${titulo}" não existe em projects-data.ts`);
  return p;
}
