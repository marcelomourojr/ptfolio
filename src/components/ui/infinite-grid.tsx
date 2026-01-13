'use client';

import React, { useRef } from 'react';
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

/**
 * Helper component for the SVG grid pattern.
 */
const GridPattern = ({ 
  offsetX, 
  offsetY, 
  size,
  strokeColor = "rgba(255, 255, 255, 0.3)"
}: { 
  offsetX: any; 
  offsetY: any; 
  size: number;
  strokeColor?: string;
}) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="infinite-grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#infinite-grid-pattern)" />
    </svg>
  );
};

interface InfiniteGridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
  speedX?: number;
  speedY?: number;
  maskRadius?: number;
  baseOpacity?: number;
  highlightOpacity?: number;
}

/**
 * The Infinite Grid Background Component
 * Displays a scrolling background grid that reveals an active layer on mouse hover.
 */
export function InfiniteGridBackground({
  children,
  className = "",
  gridSize = 50,
  speedX = 0.3,
  speedY = 0.3,
  maskRadius = 350,
  baseOpacity = 0.03,
  highlightOpacity = 0.15,
}: InfiniteGridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position with Motion Values for performance
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Grid offsets for infinite scroll animation
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  // Create a dynamic radial mask for the "flashlight" effect
  const maskImage = useMotionTemplate`radial-gradient(${maskRadius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Layer 1: Subtle background grid (always visible) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: baseOpacity }}
      >
        <GridPattern 
          offsetX={gridOffsetX} 
          offsetY={gridOffsetY} 
          size={gridSize}
          strokeColor="rgba(255, 255, 255, 1)"
        />
      </div>

      {/* Layer 2: Highlighted grid (revealed by mouse mask) */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          maskImage, 
          WebkitMaskImage: maskImage,
          opacity: highlightOpacity,
        }}
      >
        <GridPattern 
          offsetX={gridOffsetX} 
          offsetY={gridOffsetY} 
          size={gridSize}
          strokeColor="rgba(244, 63, 94, 0.8)"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
