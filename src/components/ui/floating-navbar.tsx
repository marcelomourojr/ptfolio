"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  className,
  ctaText = "Entre em Contato",
  ctaLink = "#contato",
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  ctaText?: string;
  ctaLink?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - (scrollYProgress.getPrevious() ?? 0);

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={`flex max-w-fit fixed top-6 inset-x-0 mx-auto rounded-2xl z-[5000] px-3 py-3 items-center justify-center gap-2 ${className ?? ""}`}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            href={navItem.link}
            className="relative text-white/60 items-center flex px-4 py-2 rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-light"
          >
            {navItem.icon && <span className="block sm:hidden">{navItem.icon}</span>}
            <span className="hidden sm:block">{navItem.name}</span>
          </Link>
        ))}
        <Link
          href={ctaLink}
          className="text-sm font-medium relative text-white px-5 py-2.5 rounded-xl transition-all duration-300 ml-1"
          style={{
            background: "linear-gradient(135deg, rgba(244, 63, 94, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)",
            border: "1px solid rgba(244, 63, 94, 0.4)",
            boxShadow: "0 4px 15px rgba(244, 63, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <span>{ctaText}</span>
        </Link>
      </motion.nav>
    </AnimatePresence>
  );
};
