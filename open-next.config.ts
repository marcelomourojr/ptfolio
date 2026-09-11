// Adaptador OpenNext para Cloudflare Workers.
//
// O site é 100% estático (toda rota é prerenderizada, nada revalida), então o
// cache incremental lê direto dos static assets — sem R2, sem bucket para
// criar e manter. `enableCacheInterception` entrega a página prerenderizada
// sem acordar o runtime do Next a cada requisição.
// https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
