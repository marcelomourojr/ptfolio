/**
 * /projetos não tem página própria: manda para a seção de projetos da home,
 * o mesmo destino do "Todos os projetos" de cada case.
 *
 * Rota própria, e não redirects() do next.config: no OpenNext o redirect do
 * config anexa a query string DEPOIS do destino, então /projetos?utm=x virava
 * /#projetos?utm=x — o hash deixava de bater com id="projetos" e a página não
 * descia até a seção. Aqui o Location é fixo, relativo e sem query.
 *
 * 307 e não 308: um 308 fica gravado no navegador, e se um dia existir um
 * índice de projetos aqui, quem já visitou continuaria sendo jogado para a home.
 */
export function GET() {
  return new Response(null, { status: 307, headers: { Location: "/#projetos" } });
}
