"use client";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/images";

/** Full-screen slider: cross-fade + slow zoom, text rises in on every slide. */
export default function Hero({ children }: { children: React.ReactNode }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full bg-navy">
      {/* Clip only the slides, so the floating search bar can hang below the hero. */}
      <div className="absolute inset-0 overflow-hidden">
        {heroSlides.map((s, k) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1500ms] ${k === i ? "opacity-100" : "opacity-0"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" className={`h-full w-full object-cover ${k === i ? "kenburns" : ""}`} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />
      </div>
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-5 pb-28 text-center text-white">
        <div key={i}>
          <p className="rise text-xs uppercase tracking-[.45em] text-gold" style={{ animationDelay: ".1s" }}>{heroSlides[i].kicker}</p>
          <h1 className="rise mx-auto mt-6 max-w-4xl text-5xl leading-[1.05] md:text-7xl" style={{ animationDelay: ".35s" }}>{heroSlides[i].title}</h1>
          <div className="rise mt-10 flex flex-wrap justify-center gap-4" style={{ animationDelay: ".6s" }}>
            <a href="/rooms" className="btn-gold">Explore rooms</a>
            <a href="#about" className="btn-outline">Discover the hotel</a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-40 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, k) => (
          <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-[3px] transition-all ${k === i ? "w-10 bg-gold" : "w-5 bg-white/50"}`} />
        ))}
      </div>
      {children}
    </section>
  );
}
