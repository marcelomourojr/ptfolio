export type Language = "pt" | "en";

// O português continua no conteúdo original. Só a apresentação em inglês
// passa por este dicionário; nomes, métricas, URLs e slugs são preservados.
const english: Record<string, string> = {
  "Idioma do site": "Site language",
  "Início": "Home", "Sobre": "About", "Projetos": "Projects", "Criativos": "Creatives", "Contato": "Contact",
  "Seções do site": "Site sections", "Abrir navegação": "Open navigation", "Fechar navegação": "Close navigation",
  "Você": "You", "Produto": "Product",
  "Desenho produtos digitais que as pessoas entendem sem precisar de manual.": "I design digital products people understand without needing a manual.",
  "Product Designer UI/UX há mais de 5 anos. Interfaces que precisam funcionar fora do Figma.": "UI/UX Product Designer for over 5 years. Interfaces that need to work beyond Figma.",
  "Da pesquisa ao handoff: fluxo, protótipo, interface e a conversa difícil sobre escopo.": "From research to handoff: flows, prototypes, interfaces and the tough conversations about scope.",
  "Design claro, acessível e rápido. Menos efeito, mais decisão.": "Clear, accessible and fast design. Fewer effects, more decisions.",
  "Design com lógica, movimento com propósito — do primeiro rabisco ao produto no ar.": "Design with logic, motion with purpose — from the first sketch to a live product.",
  "Sobre Mim": "About Me",
  "Criando experiências digitais que unem estratégia, tecnologia e performance.": "Creating digital experiences that bring together strategy, technology and performance.",
  "Product Designer UI/UX com mais de 5 anos de experiência em testes de software, desenvolvimento de produtos digitais, atuação como analista administrativo e criação de interfaces centradas no usuário, atuando de ponta a ponta com foco em usabilidade, organização, qualidade e resultado.": "UI/UX Product Designer with over 5 years of experience in software testing, digital product development, administrative analysis and user-centered interface design, working end to end with a focus on usability, organization, quality and results.",
  "Possuo forte base lógica e analítica, integrando IA, automação e dados à experiência do usuário. Experiência com ferramentas como Figma, Framer, Google AI Studio, Google Labs, ComfyUI, Kling, Sora 2, Wan 2.2 Animate, entre outras, aplicadas na construção de produtos digitais de alto impacto.": "I have a strong logical and analytical foundation, integrating AI, automation and data into the user experience. I work with tools such as Figma, Framer, Google AI Studio, Google Labs, ComfyUI, Kling, Sora 2 and Wan 2.2 Animate, among others, to build high-impact digital products.",
  "Anos": "Years", "Telas Criadas": "Screens Created", "Satisfação": "Satisfaction",
  "Produtos que foram para a rua e continuam em uso. Role para ver de perto.": "Products that launched and are still in use. Scroll for a closer look.",
  "Projeto 1": "Project 1", "Primeiro Portfolio": "First Portfolio",
  "App Mobile & Website": "Mobile App & Website",
  "Plataforma completa para gestão de seguros, com foco na experiência do usuário e otimização de fluxos de contratação.": "A complete insurance management platform focused on user experience and streamlined purchasing flows.",
  "Serviço de criação de sites personalizados como presentes digitais, transformando histórias, fotos e músicas em experiências interativas únicas para eternizar momentos especiais de forma criativa e emocional.": "A service that creates personalized websites as digital gifts, turning stories, photos and music into unique interactive experiences that preserve special moments in a creative, meaningful way.",
  "App com dinâmica estilo Duolingo, com trilhas, quizzes e progressão gamificada. Bíblia offline em vários idiomas, com navegação simples e intuitiva. Inclui áudio, marcações e busca inteligente para estudo diário. Conta com mais de 100 mil downloads e alto engajamento.": "An app with a Duolingo-style experience, learning paths, quizzes and gamified progression. An offline Bible in multiple languages with simple, intuitive navigation. Includes audio, bookmarks and smart search for daily study. Over 100,000 downloads and strong engagement.",
  "App de relacionamento com IA que gera matches por afinidade real, usando filtros inteligentes de idade, distância e interesses, com chat seguro focado em privacidade e controle, já ultrapassando 500 mil downloads.": "An AI-powered dating app that matches people through genuine compatibility, using smart age, distance and interest filters, with secure chat focused on privacy and control. Over 500,000 downloads.",
  "Plataforma de automação de conversas que utiliza chatbots e fluxos inteligentes para organizar, escalar e otimizar o atendimento, centralizando a comunicação e tornando as interações mais eficientes e estratégicas.": "A conversation automation platform that uses chatbots and smart workflows to organize, scale and improve customer service, centralizing communication for more efficient, strategic interactions.",
  "Plataforma web e aplicativo mobile que centralizam informações de concursos públicos, com busca inteligente, notícias atualizadas e assistente com IA, facilitando o acesso a oportunidades e otimizando a jornada de quem está se preparando.": "A web platform and mobile app that bring together information on public service entrance exams, with smart search, up-to-date news and an AI assistant, making opportunities easier to find and improving the preparation journey.",
  "Serviço de criação de sites, páginas e sistemas com foco em conversão, unindo estratégia e design, com investimento acessível e modelo recorrente que garante manutenção contínua e suporte 24h, voltado a fortalecer a presença digital de negócios locais e sustentar seu crescimento.": "A service for building conversion-focused websites, landing pages and systems, combining strategy and design with affordable pricing and a recurring model that provides ongoing maintenance and 24-hour support, helping local businesses strengthen their digital presence and sustain growth.",
  "Site premium desenvolvido para barbearia com foco em fortalecer a presença digital local, otimizado para SEO e alta performance, valorizando os serviços e transmitindo uma identidade visual sofisticada que atrai e converte clientes.": "A premium barbershop website designed to strengthen its local digital presence, optimized for SEO and performance, showcasing its services through a sophisticated visual identity that attracts and converts customers.",
  "Vídeos de divulgação criados com IA para produtos reais.": "AI-generated promotional videos for real products.",
  "Criativos com IA": "AI Creatives",
  "Criativos de anúncio gerados de ponta a ponta com IA para o Verbo.": "Ad creatives generated end to end with AI for Verbo.",
  "Roteiro, avatar, narração e edição feitos com ferramentas de IA generativa — do gancho à tela final, prontos para campanha.": "Scripts, avatars, voiceovers and editing made with generative AI tools — from the hook to the final screen, ready for campaigns.",
  "tour completa": "full tour", "narração": "voiceover", "tour do app": "app tour", "menu": "menu", "quiz": "quiz", "pastor": "pastor", "depoimento": "testimonial",
  "Espanto": "Surprise", "Gancho": "Hook",
  "Criativos em vídeo": "Video creatives", "carrossel": "carousel",
  "Pausar vídeo": "Pause video", "Reproduzir vídeo": "Play video", "Ligar som": "Enable sound", "Desligar som": "Mute sound",
  "Criativo anterior": "Previous creative", "Próximo criativo": "Next creative", "Ir para": "Go to", "de": "of",
  "Certificados": "Certificates",
  "Cursos e certificações concluídos, do design de interface à infraestrutura em nuvem.": "Completed courses and certifications, from interface design to cloud infrastructure.",
  "MultiCloud, DevOps & IA": "MultiCloud, DevOps & AI",
  "Workshop do Figma ao Framer": "Figma to Framer Workshop",
  "Fundamentos para Desenvolvimento de Software": "Software Development Fundamentals",
  "Marketing Digital": "Digital Marketing",
  "Emitida em jan de 2025": "Issued in Jan 2025", "Emitida em dez de 2024": "Issued in Dec 2024", "Emitida em nov de 2024": "Issued in Nov 2024", "Emitida em out de 2024": "Issued in Oct 2024", "Emitida em ago de 2024": "Issued in Aug 2024",
  "Ver certificado": "View certificate", "Validar no site do emissor": "Verify on the issuer’s website", "chave": "key",
  "Vamos Conversar": "Let’s Talk",
  "Conecte-se comigo através das minhas redes ou me chame no Whatsapp.": "Connect with me on social media or message me on WhatsApp.",
  "Fale comigo": "Get in touch", "E-mail": "Email", "Voltar ao topo ↑": "Back to top ↑",
  "Oi, Marcelo! Vim pelo seu portfólio.": "Hi, Marcelo! I found you through your portfolio.",
  "Fechar": "Close", "Ferramentas": "Tools", "Ver site": "Visit website",
  "Ver a página do projeto": "View project page", "Telas": "Screens",
  "Tela anterior": "Previous screen", "Próxima tela": "Next screen",
  "Todos os projetos": "All projects", "Ver os outros projetos": "See other projects", "Falar comigo": "Get in touch",
  "Links dos produtos": "Product links", "Portfólio": "Portfolio", "Todos": "All", "Controles": "Controllers",
  "Controle EasySMX S15": "EasySMX S15 Controller", "Controle LinYuvo KS42 Efeito Hall": "LinYuvo KS42 Hall Effect Controller", "Controle LinYuvo KS42 Branco": "White LinYuvo KS42 Controller",
  "Filtrar por categoria": "Filter by category",
  "Nada nesta categoria ainda. Escolha outra ou volte em alguns dias.": "Nothing in this category yet. Choose another or check back in a few days.",
  "Erro 404": "Error 404", "Página não encontrada": "Page not found", "Voltar ao início": "Back to home", "Ver os projetos": "Browse projects",
  "Essa página não existe": "This page doesn’t exist",
  "O endereço pode ter mudado de lugar, ou o link que te trouxe até aqui está desatualizado.": "The page may have moved, or the link that brought you here is out of date.",
};

export function translate(text: string, language: Language): string {
  if (language === "pt") return text;
  const normalized = text.trim().replace(/\s+/g, " ");
  if (Object.hasOwn(english, normalized)) return english[normalized];
  if (/^(https?:|mailto:|\/|#)/.test(text)) return text;
  const screen = normalized.match(/^(.*) — tela (\d+)(?: de (\d+))?$/);
  if (screen) return `${screen[1]} — screen ${screen[2]}${screen[3] ? ` of ${screen[3]}` : ""}`;
  if (normalized.startsWith("Ver o projeto ")) return `View ${normalized.slice(14)} project`;
  if (normalized.startsWith("Telas de ")) return `Screens of ${normalized.slice(9)}`;
  if (normalized.startsWith("Ir para ")) return `Go to ${translate(normalized.slice(8), language)}`;
  if (normalized.startsWith("Certificado: ")) return `Certificate: ${translate(normalized.slice(13), language)}`;
  if (normalized.includes(" — ")) return normalized.split(" — ").map(part => translate(part, language)).join(" — ");
  if (normalized.includes(" · ")) return normalized.split(" · ").map(part => translate(part, language)).join(" · ");
  return text;
}
