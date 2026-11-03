"use client";
import { useState } from "react";

/** <img> that falls back to a gold/navy gradient if the photo cannot be loaded. */
export default function SafeImg({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <div role="img" aria-label={alt} className={`bg-gradient-to-br from-navy to-gold-dark ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className={`object-cover ${className}`} />;
}
