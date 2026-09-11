/**
 * Guarda da escala tipográfica.
 *
 * O `--text-*: initial` no globals.css remove a escala padrão do Tailwind, mas
 * NÃO faz o build falhar: utilitário desconhecido é ignorado em silêncio e o
 * texto herda o tamanho do pai. Este script é a trava de verdade.
 *
 * Barra: text-xs..text-9xl (a escala apagada) e text-[[0-9]px] / text-[clamp()]
 * (os valores avulsos que a migração eliminou).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = "src";
const PROIBIDO = [
  { re: /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/g, oque: "utilitário da escala apagada" },
  { re: /\btext-\[\d+(\.\d+)?(px|rem)\]/g, oque: "tamanho avulso em px/rem" },
  { re: /\btext-\[clamp\(/g, oque: "clamp avulso" },
];
// O marquee do velocity-text é a única exceção: é lettering de faixa, não
// degrau de leitura, e tem curva própria.
const ISENTOS = ["src/components/ui/velocity-text.tsx"];

function varrer(dir, saida = []) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) varrer(caminho, saida);
    else if (/\.(tsx|ts)$/.test(nome)) saida.push(caminho);
  }
  return saida;
}

const faltas = [];
for (const arquivo of varrer(RAIZ)) {
  if (ISENTOS.includes(arquivo)) continue;
  const linhas = readFileSync(arquivo, "utf8").split("\n");
  linhas.forEach((linha, i) => {
    for (const { re, oque } of PROIBIDO) {
      for (const m of linha.matchAll(re)) {
        faltas.push(`${arquivo}:${i + 1}  ${m[0]}  — ${oque}`);
      }
    }
  });
}

if (faltas.length) {
  console.error(`\n✖ Tipografia: ${faltas.length} uso(s) fora da escala.\n`);
  faltas.forEach((f) => console.error("  " + f));
  console.error(
    "\n  Use os tokens: text-marca, text-display, text-display-contido,\n" +
      "  text-destaque, text-corpo, text-meta, text-micro.\n" +
      "  Definidos em src/app/globals.css.\n",
  );
  process.exit(1);
}
console.log("✓ Tipografia: todos os tamanhos vêm dos tokens.");
