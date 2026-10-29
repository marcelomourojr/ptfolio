"use client";

import { useLanguage } from "@/components/language-provider";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { BlurFade } from "@/components/ui/blur-fade";
import { WhisperText } from "@/components/ui/whisper-text";

interface Stat {
  value: string;
  label: string;
}

interface AboutSectionProps {
  title?: string;
  statement?: string;
  paragraphs?: string[];
  stats?: Stat[];
  photo?: string;
}

export function AboutSection({
  title = "Sobre Mim",
  statement = "Criando experiências digitais que unem estratégia, tecnologia e performance.",
  paragraphs = [
    "Product Designer UI/UX com mais de 5 anos de experiência em testes de software, desenvolvimento de produtos digitais, atuação como analista administrativo e criação de interfaces centradas no usuário, atuando de ponta a ponta com foco em usabilidade, organização, qualidade e resultado.",
    "Possuo forte base lógica e analítica, integrando IA, automação e dados à experiência do usuário. Experiência com ferramentas como Figma, Framer, Google AI Studio, Google Labs, ComfyUI, Kling, Sora 2, Wan 2.2 Animate, entre outras, aplicadas na construção de produtos digitais de alto impacto.",
  ],
  stats = [
    { value: "5+", label: "Anos" },
    { value: "+100", label: "Telas Criadas" },
    { value: "100%", label: "Satisfação" },
  ],
  photo = "/images/sobre-eu.webp",
}: AboutSectionProps) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: {
      duration: 0.6,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section id="sobre" className="site-container section-space">
      {/* O título pertence à seção inteira, no mesmo eixo de Projetos,
          Criativos, Certificados e Contato. */}
      <h2 className="text-display font-semibold text-white">
        <WhisperText text={title} />
      </h2>

      <div className="mt-10 grid items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <motion.div {...reveal()}>
          {/* aspect fixo, não h-full: esticar até a altura da coluna de texto
              achatava a foto de retrato para 1.17 de proporção. E a largura é
              LIMITADA por faixa: com w-full puro, abaixo de lg a coluna é a
              página inteira e a foto virava um retrato de ~900px de altura
              num tablet. Alinhada à esquerda, como todo o site. */}
          <div className="relative aspect-[1086/1448] w-full max-w-[300px] overflow-hidden rounded-lg border border-white/10 max-sm:mx-auto sm:max-w-[360px] lg:max-w-[420px]">
            <Image
              src={photo}
              alt="Marcelo Mouro Jr"
              fill
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 420px"
              draggable={false}
              /* P&B → cor no hover só faz sentido com mouse; no toque não há
                 hover e a foto ficava apagada para sempre. `pointer-fine`
                 restringe o efeito a mouse/trackpad — em celular e tablet a
                 foto fica sempre em cor. */
              className="bg-zinc-900 object-cover object-top transition-all duration-700 pointer-fine:grayscale pointer-fine:hover:grayscale-0"
            />
          </div>
        </motion.div>

        {/* Sem reveal no contêiner: cada elemento tem seu próprio efeito —
            um contêiner invisível por cima escondia o whisper do título. */}
        <div className="flex min-w-0 flex-col">
          <BlurFade delay={0.1}>
            <p className="max-w-3xl text-destaque font-medium text-white">
              {t(statement)}
            </p>
          </BlurFade>

          <BlurFade delay={0.2} className="mt-6 space-y-5">
            {paragraphs.map((text) => (
              <p key={text.slice(0, 32)} className="max-w-measure text-corpo text-white/60">
                {t(text)}
              </p>
            ))}
          </BlurFade>

          {/* Margem + padding somam 64px entre o texto e os números;
              mt-auto deixava esse intervalo depender da altura da foto. */}
          <BlurFade delay={0.3} className="mt-8">
            {/* No celular os números vivem centralizados; o alinhamento à
                esquerda volta junto com as 3 colunas */}
            <dl className="grid gap-y-8 border-t border-white/10 pt-8 max-sm:text-center sm:grid-cols-3 sm:gap-x-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="relative">
                  {/* A marca de canto só existe onde há canto: no celular os
                      números são centralizados e ela saía como ruído solto */}
                  <span
                    aria-hidden
                    className="absolute -top-3 left-0 size-2 border-l border-t border-rose-500 max-sm:hidden"
                  />
                  <dt className="sr-only">{t(label)}</dt>
                  <dd>
                    <span className="block whitespace-nowrap text-display-contido font-semibold tabular-nums text-white">
                      {value}
                    </span>
                    <span className="mt-3 block font-mono text-micro tracking-[0.06em] text-white/50">
                      {t(label)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
