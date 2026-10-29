import assert from "node:assert/strict";
import test from "node:test";
import { translate } from "../src/lib/translations.ts";
import { projetos } from "../src/lib/projects-data.ts";

test("português preserva exatamente os textos e a formatação originais", () => {
  for (const text of ["  Sobre Mim\n", ...projetos.map(p => p.description)]) {
    assert.equal(translate(text, "pt"), text);
  }
});

test("os oito projetos têm descrição em inglês e preservam os nomes", () => {
  assert.equal(projetos.length, 8);
  for (const p of projetos) {
    assert.notEqual(translate(p.description, "en"), p.description, p.slug);
    assert.equal(translate(p.title, "en"), p.title);
  }
  assert.match(translate(projetos.find(p => p.slug === "verbo").description, "en"), /100,000/);
  assert.match(translate(projetos.find(p => p.slug === "sintony").description, "en"), /500,000/);
});

test("rótulos compostos e textos acessíveis traduzem todos os trechos", () => {
  assert.equal(translate("tour completa · narração", "en"), "full tour · voiceover");
  assert.equal(translate("Verbo — tela 2 de 5", "en"), "Verbo — screen 2 of 5");
  assert.equal(translate("Verbo — tela 2", "en"), "Verbo — screen 2");
  assert.equal(translate("Telas de Verbo", "en"), "Screens of Verbo");
  assert.equal(translate("Ver o projeto Zé dos Concursos", "en"), "View Zé dos Concursos project");
  assert.equal(translate("Ir para Espanto", "en"), "Go to Surprise");
  assert.equal(translate("Certificado: Marketing Digital — USP", "en"), "Certificate: Digital Marketing — USP");
  assert.equal(translate("Controle EasySMX S15 — Switch", "en"), "EasySMX S15 Controller — Switch");
  assert.equal(translate("  Todos os\n projetos  ", "en"), "All projects");
});

test("URLs, âncoras, credenciais, números e termos desconhecidos ficam intactos", () => {
  for (const text of [
    "https://marcelomouro.com/#projetos", "/projetos/verbo", "#sobre",
    "/images/sobre-eu.webp", "mailto:contato@marcelomouro.com", "5+", "+100", "100%",
    "87fb913f0d45a0df274d44e8f6993da3", "toString", "constructor", "Figma",
  ]) assert.equal(translate(text, "en"), text);
});
