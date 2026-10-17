/** Regenera o mapa de proporções a partir dos arquivos reais, sem alterar imagens. */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publico = join(raiz, "public");
const destino = join(raiz, "src/lib/image-dims.ts");
const argumentos = process.argv.slice(2);
if (argumentos.some((arg) => arg !== "--check")) {
  throw new Error("Uso: npm run images:dims [-- --check]");
}

async function listarImagens(pasta) {
  const arquivos = [];
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, entrada.name);
    if (entrada.isDirectory()) arquivos.push(...await listarImagens(caminho));
    else if (entrada.isFile() && /\.(webp|png|jpe?g|avif|gif|svg)$/i.test(entrada.name)) {
      arquivos.push(caminho);
    }
  }
  return arquivos;
}

const arquivos = (await listarImagens(join(publico, "images"))).sort();
if (!arquivos.length) throw new Error("Nenhuma imagem encontrada em public/images.");

const linhas = [];
for (const arquivo of arquivos) {
  const { width, height } = await sharp(arquivo).metadata();
  if (!width || !height) throw new Error(`Dimensões inválidas: ${arquivo}`);
  const url = "/" + relative(publico, arquivo).split(sep).join("/");
  linhas.push(`  ${JSON.stringify(url)}: "${width} / ${height}",`);
}

// Só escreve depois de ler TODAS as imagens: falha de leitura preserva o mapa anterior.
const conteudo = `/**
 * Dimensões reais das imagens em /public/images e subpastas.
 * Arquivo gerado por scripts/gera-image-dims.mjs — não editar à mão.
 * Regenerar: npm run images:dims
 * Verificar sem escrever: npm run images:dims -- --check
 */
export const IMAGE_DIMS: Record<string, string> = {
${linhas.join("\n")}
};

/** Proporção de uma imagem conhecida; capturas de web como fallback. */
export function imageAspect(src: string): string {
  return IMAGE_DIMS[src] ?? "1600 / 1005";
}
`;

if (argumentos.includes("--check")) {
  if (await readFile(destino, "utf8") !== conteudo) {
    console.error("✖ Mapa desatualizado. Execute npm run images:dims.");
    process.exitCode = 1;
  } else {
    console.log(`✓ Mapa atualizado: ${arquivos.length} imagens verificadas.`);
  }
} else {
  await writeFile(destino, conteudo);
  console.log(`✓ Mapa gerado: ${arquivos.length} imagens.`);
}
