import { useEffect, type RefObject } from "react";

const FOCAVEIS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Prende o Tab dentro de um diálogo enquanto ele está aberto.
 *
 * `aria-modal="true"` diz ao leitor de tela que o resto da página não conta,
 * mas NÃO impede o Tab de sair: sem isto, do último botão do modal o foco
 * vazava para os cards e links que estão atrás do véu escuro — invisíveis
 * para quem enxerga, alcançáveis pelo teclado.
 *
 * Por que não `inert` no resto da página: os diálogos daqui são renderizados
 * DENTRO do <main>, então marcar o <main> como inerte desligaria o próprio
 * diálogo. O ciclo pelo teclado resolve sem depender de onde ele mora.
 *
 * Ficam de fora os elementos invisíveis e os que estão sob `aria-hidden` ou
 * `inert` — a galeria repete slides escondidos para o loop infinito.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, ativo: boolean) {
  useEffect(() => {
    if (!ativo) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const raiz = ref.current;
      if (!raiz) return;

      const itens = [...raiz.querySelectorAll<HTMLElement>(FOCAVEIS)].filter(
        (el) =>
          el.getClientRects().length > 0 &&
          !el.closest('[aria-hidden="true"]') &&
          !el.closest("[inert]"),
      );
      if (itens.length === 0) {
        e.preventDefault();
        return;
      }

      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];
      const atual = document.activeElement;
      const dentro = atual instanceof HTMLElement && raiz.contains(atual);

      if (e.shiftKey) {
        if (!dentro || atual === primeiro) {
          e.preventDefault();
          ultimo.focus();
        }
      } else if (!dentro || atual === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    // Foco que volta DE FORA da página — da barra de endereço, de outra aba —
    // entra pelo topo do documento, atrás do véu. Ouve-se a JANELA recuperando
    // o foco, e não "qualquer foco fora do diálogo": ao fechar, o modal
    // devolve o foco ao card que o abriu, e um ouvinte de focusin puxaria esse
    // foco de volta para o diálogo que está saindo. Foco movido pelo código
    // não dispara o "focus" da janela. O quadro seguinte dá tempo de o
    // navegador assentar o foco antes de conferir onde ele caiu.
    let quadro = 0;
    const onJanelaFocada = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const raiz = ref.current;
        if (!raiz || raiz.contains(document.activeElement)) return;
        (raiz.querySelector<HTMLElement>(FOCAVEIS) ?? raiz).focus();
      });
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("focus", onJanelaFocada);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("focus", onJanelaFocada);
      cancelAnimationFrame(quadro);
    };
  }, [ref, ativo]);
}
