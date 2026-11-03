"use client";
import { useEffect, useRef, type ReactNode } from "react";

type Variant = "reveal" | "reveal-left" | "reveal-right" | "reveal-zoom" | "reveal-mask";

/** Animates an element in (see .reveal* in globals.css) when it scrolls into view. */
export default function Reveal({
  children, className = "", variant = "reveal", delay = 0, as: Tag = "div",
}: { children: ReactNode; className?: string; variant?: Variant; delay?: number; as?: "div" | "li" | "aside" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref as never} className={`${variant} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}
