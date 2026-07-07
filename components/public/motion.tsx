"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function FadeIn({
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & {
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      {...props}
    />
  );
}
