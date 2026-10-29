"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { translate, type Language } from "@/lib/translations";

const key = "portfolio-language";
let sessionLanguage: Language = "pt";

function subscribe(notify: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) notify();
  };
  window.addEventListener(key, notify);
  window.addEventListener("storage", storage);
  return () => {
    window.removeEventListener(key, notify);
    window.removeEventListener("storage", storage);
  };
}

function snapshot(): Language {
  try {
    const saved = localStorage.getItem(key);
    return saved === "en" || saved === "pt" ? saved : sessionLanguage;
  } catch {
    return sessionLanguage;
  }
}

const serverSnapshot = (): Language => "pt";

function setLanguage(language: Language) {
  sessionLanguage = language;
  try { localStorage.setItem(key, language); } catch { /* Mantém a escolha nesta sessão. */ }
  window.dispatchEvent(new Event(key));
}

const LanguageContext = createContext({ language: "pt" as Language, setLanguage, t: (text: string) => text });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // O primeiro HTML e a hidratação usam PT. A preferência local entra em
  // seguida, sem acessar storage no servidor nem gerar HTML divergente.
  const language = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const t = useCallback((text: string) => translate(text, language), [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);
  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en-US" : "pt-BR";
  }, [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

/** Fronteira client para os textos das páginas prerenderizadas. */
export function Translated({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}
