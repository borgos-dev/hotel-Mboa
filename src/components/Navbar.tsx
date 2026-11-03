"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/#services", label: "Services" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/reservations", label: "My reservations" },
  { href: "/staff-login", label: "Staff dashboard" },
];

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const bg = solid || scrolled || open ? "bg-ink/95 backdrop-blur shadow-lg py-3" : "bg-transparent py-6";
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${bg}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-2xl tracking-wide text-white">
          Hôtel <span className="text-gold">Mboa</span>
        </Link>
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs uppercase tracking-[.2em] text-white/85 transition hover:text-gold">{l.label}</Link>
          ))}
          <Link href="/rooms" className="btn-gold !py-2.5">Book now</Link>
        </nav>
        <button aria-label="Menu" className="text-white lg:hidden" onClick={() => setOpen(!open)}>
          <span className="block h-px w-7 bg-white" /><span className="my-2 block h-px w-7 bg-white" /><span className="block h-px w-7 bg-white" />
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 px-5 pb-6 pt-4 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-xs uppercase tracking-[.2em] text-white/90">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
