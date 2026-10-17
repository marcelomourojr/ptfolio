# Portfólio — Marcelo Mouro Jr

Portfólio de Product Design UI/UX em Next.js (App Router), com projetos,
criativos em vídeo, certificados e recomendações de produtos de afiliado.
Domínio configurado: https://marcelomouro.com.

## Desenvolvimento local

Use Node.js 22, conforme `.nvmrc`, e npm com o `package-lock.json` versionado:

```bash
nvm use
npm ci
npm run dev
```

Abra http://localhost:3000 no navegador embutido do app neste Mac. Não solicite
pareamento com outras máquinas. `.claude/launch.json` também contém a
configuração `portfolio` para o servidor de desenvolvimento e
`portfolio-workers` para a prévia de um build OpenNext já gerado.

## Verificação

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run images:dims -- --check
npm run build
```

O lint inclui a guarda de tipografia em `scripts/checa-tipografia.mjs`.
O build do Next gera as páginas estáticas, mas não valida sozinho o runtime
da Cloudflare. Não há suíte de testes automatizados configurada.

## Organização e conteúdo

- `src/app/page.tsx`: home, navegação, capas/faixas do bento, criativos e certificados.
- `src/lib/projects-data.ts`: descrições, imagens, URLs e slugs dos oito projetos.
- `src/app/projetos/[slug]/page.tsx`: páginas de projetos prerenderizadas, com metadata própria.
- `src/app/projetos/route.ts`: redirecionamento 307 de `/projetos` para `/#projetos`.
- `src/lib/links-data.ts`: quatro produtos de afiliado com fotos locais e URLs encurtadas.
- `src/components/ui/`: navegação, seções, galerias, diálogos e efeitos.
- `src/lib/use-focus-trap.ts`: ciclo de foco dos diálogos de projetos e certificados.
- `src/app/globals.css`: tema Tailwind CSS v4 e escala tipográfica.
- `src/app/layout.tsx`: fontes Inter Tight e Chivo Mono, metadata global e imagem social.
- `public/images/` e `public/videos/`: mídia local; os vídeos têm posters e variantes de 480p.

Three.js e `@types/three` ficam fixados em `0.182.0`: o React Three Fiber 9
ainda instancia `Clock`, depreciado a partir do Three r183. Essa combinação
preserva a API usada pela galeria sem avisos de depreciação. Ao atualizar o
renderer, reavaliar os dois pins juntos; não atualizar só o Three isoladamente.

Para incluir um projeto, adicione os dados e um slug estável em
`projects-data.ts`, configure sua capa em `bentoCovers` e sua posição em
`bentoBands` na home. O sitemap e as páginas de projetos usam os dados
compartilhados. O parallax da home usa uma seleção separada de sete imagens.
Preserve os textos do usuário ao fazer ajustes técnicos.

## Dimensões das imagens

Depois de adicionar, remover ou redimensionar uma imagem:

```bash
npm run images:dims
```

O script usa Sharp para ler as dimensões de WebP, PNG, JPEG, AVIF, GIF e SVG
em `public/images/` e subpastas. Ele gera `src/lib/image-dims.ts` em ordem
determinística, sem modificar os arquivos de imagem. Não edite o mapa à mão.
A opção `--check` verifica o conteúdo sem escrever e retorna erro se estiver
desatualizado. Sharp é uma dependência explícita de desenvolvimento.

## Cloudflare Workers

O repositório usa `@opennextjs/cloudflare` e Wrangler, com configuração em
`open-next.config.ts` e `wrangler.jsonc`. O Worker se chama `marcelomouro`,
usa `.open-next/worker.js`, binding `ASSETS` e cache incremental em static
assets, sem bucket R2 configurado. As páginas de conteúdo são prerenderizadas;
`/projetos` é um handler de redirecionamento executado no servidor.

```bash
npm run preview
```

Esse comando gera o build OpenNext e inicia a prévia local do Worker,
normalmente em http://localhost:8787. `npm run start` serve apenas o build
do Next; não reproduz o runtime Workers.

`npm run deploy` gera o build e publica o Worker. `npm run upload` gera o
build e envia uma versão para a Cloudflare. Ambos acessam a conta remota:
execute somente quando o usuário autorizar a publicação. `npm run cf-typegen`
gera os tipos dos bindings. Não faça commit, push ou PR sem autorização.

Os cabeçalhos de segurança do HTML ficam em `next.config.ts`; os arquivos
estáticos também têm regras em `public/_headers`. `next/image` usa
`unoptimized: true`, sem origens de imagens externas configuradas.
