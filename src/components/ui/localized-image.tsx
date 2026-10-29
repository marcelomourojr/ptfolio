"use client";

import Image, { type ImageProps } from "next/image";
import { useLanguage } from "@/components/language-provider";

export function LocalizedImage(props: ImageProps) {
  const { t } = useLanguage();
  return <Image {...props} alt={t(props.alt)} />;
}
