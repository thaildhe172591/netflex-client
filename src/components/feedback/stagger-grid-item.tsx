"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerGridItemProps {
  index: number;
  children: ReactNode;
}

export function StaggerGridItem({ index, children }: StaggerGridItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut", delay: Math.min(index * 0.03, 0.24) }}
    >
      {children}
    </motion.div>
  );
}
