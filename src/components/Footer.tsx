import Link from "next/link";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3">
        <Reveal delay={0}>
          <p className="font-serif text-3xl text-white">Hôtel <span className="text-gold">Mboa</span></p>
          <p className="mt-4 text-sm leading-relaxed">A quiet address in the heart of Douala, created for memorable stays.</p>
        </Reveal>
        <Reveal delay={120} className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[.25em] text-gold">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/rooms" className="hover:text-gold">Rooms & Suites</Link></li>
            <li><Link href="/#services" className="hover:text-gold">Services</Link></li>
            <li><Link href="/reservations" className="hover:text-gold">My reservations</Link></li>
            <li><Link href="/staff-login" className="hover:text-gold">Staff dashboard</Link></li>
          </ul>
        </Reveal>
        <Reveal delay={240} className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[.25em] text-gold">Contact</p>
          <p>Bonanjo, Douala · Cameroon</p>
          <p className="mt-2">+237 682 337 957</p>
          <p className="mt-2">reservations@hotel-mboa.com</p>
        </Reveal>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs tracking-wider text-white/40">
        Demo project · photos from Unsplash · prices in FCFA, VAT excluded
      </div>
    </footer>
  );
}
