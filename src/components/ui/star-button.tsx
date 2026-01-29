"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function StarButton({
  children,
  className,
  href,
  ...props
}: StarButtonProps) {

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-medium text-white transition-all hover:scale-105",
        className,
      )}
      {...props}
    >
      {/* Animated gradient border */}
      <span className="absolute inset-0 rounded-full">
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 animate-[spin_3s_linear_infinite]" 
          style={{ 
            backgroundSize: '200% 200%',
            animation: 'gradient-rotate 3s linear infinite'
          }}
        />
      </span>
      
      {/* Inner background */}
      <span className="absolute inset-[2px] rounded-full bg-black/90" />
      
      {/* Text */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Glow effect on hover */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-rose-500/20 to-purple-500/20 blur-xl" />
      
      <style jsx>{`
        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
            transform: rotate(0deg);
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
}
