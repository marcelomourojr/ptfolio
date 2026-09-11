import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Saídas de build dos adaptadores da Cloudflare: bundles minificados que
    // o eslint-config-next não ignora por padrão porque não conhece nenhum
    // dos dois. Sem isto o `npm run lint` lintava o build e explodia.
    ".vercel/**", // @cloudflare/next-on-pages (legado, até o corte para Workers)
    ".open-next/**", // @opennextjs/cloudflare
    ".wrangler/**", // estado local do wrangler dev
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
