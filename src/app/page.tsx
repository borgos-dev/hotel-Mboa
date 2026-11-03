import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import SafeImg from "@/components/SafeImg";
import { aboutImages, roomImages, fallbackRoomImage, serviceImages } from "@/lib/images";
import { xaf } from "@/lib/format";
import { reviews, roomTypes, services, stats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [types, svc, rv, st] = await Promise.all([roomTypes(), services(), reviews(3), stats()]);
  return (
    <>
      <Navbar />
      <Hero>
        <SearchBar types={types.map((t) => t.name)} floating />
      </Hero>

      {/* ABOUT */}
      <section id="about" className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-48 md:grid-cols-2">
        <Reveal variant="reveal-left">
          <p className="text-xs uppercase tracking-[.4em] text-gold-dark">About the hotel</p>
          <h2 className="mt-4 text-5xl leading-tight">A quiet address in the heart of Douala</h2>
          <p className="mt-6 leading-relaxed text-ink/70">
            From single rooms to family rooms and suites, every stay is organised around rest. Spa, restaurant, gym and airport
            shuttle are one tap away, and everything you book is tracked in a single reservation.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
            <div><p className="font-serif text-5xl text-gold-dark"><Counter to={st.rooms} /></p><p className="mt-1 text-xs uppercase tracking-widest text-ink/60">Rooms</p></div>
            <div><p className="font-serif text-5xl text-gold-dark"><Counter to={st.stays} /></p><p className="mt-1 text-xs uppercase tracking-widest text-ink/60">Stays completed</p></div>
            <div><p className="font-serif text-5xl text-gold-dark"><Counter to={Number(st.rating ?? 0)} decimals={1} /></p><p className="mt-1 text-xs uppercase tracking-widest text-ink/60">Average rating</p></div>
          </div>
        </Reveal>
        <div className="relative">
          <Reveal variant="reveal-mask" className="zoom-frame h-[520px]"><SafeImg src={aboutImages[0]} alt="Hotel exterior" className="h-full w-full" /></Reveal>
          <Reveal variant="reveal-mask" delay={450} className="zoom-frame absolute -bottom-10 -left-10 hidden h-56 w-64 border-8 border-sand md:block"><SafeImg src={aboutImages[1]} alt="Hotel lobby" className="h-full w-full" /></Reveal>
        </div>
      </section>

      {/* ROOM TYPES (from the database) */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[.4em] text-gold-dark">Rooms & suites</p>
            <h2 className="mt-4 text-5xl">Choose how you want to stay</h2>
          </Reveal>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t, k) => (
              <Reveal key={t.name} variant="reveal-zoom" delay={k * 120}>
                <Link href={`/rooms?type=${t.name}`} className="group block">
                  <div className="zoom-frame relative h-96">
                    <SafeImg src={(roomImages[t.name] ?? [fallbackRoomImage])[0]} alt={`${t.name} room`} className="h-full w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="text-3xl">{t.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[.2em] text-gold">from {xaf(t.from_price)} / night</p>
                      <p className="mt-3 max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">{t.description}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES (from the database) */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[.4em] text-gold-dark">Hotel services</p>
          <h2 className="mt-4 text-5xl">Everything for a perfect stay</h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {svc.map((s, k) => (
            <Reveal key={s.service_id} variant={k % 2 ? "reveal-right" : "reveal-left"}>
              <div className="group grid overflow-hidden bg-white shadow-sm transition hover:shadow-xl sm:grid-cols-5">
                <div className="zoom-frame h-48 sm:col-span-2 sm:h-auto"><SafeImg src={serviceImages[s.name] ?? fallbackRoomImage} alt={s.name} className="h-full w-full" /></div>
                <div className="p-7 sm:col-span-3">
                  <h3 className="text-3xl">{s.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.description}</p>
                  <p className="mt-5 font-serif text-2xl text-gold-dark">{xaf(s.price)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS (from the database) */}
      <section id="reviews" className="bg-navy py-24 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[.4em] text-gold">Guest reviews</p>
            <h2 className="mt-4 text-5xl">What our guests say</h2>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {rv.map((r, k) => (
              <Reveal key={k} variant="reveal-zoom" delay={k * 150}>
                <figure className="h-full border border-white/10 bg-white/5 p-8">
                  <p className="text-gold">{"★".repeat(r.rating)}<span className="text-white/20">{"★".repeat(5 - r.rating)}</span></p>
                  <blockquote className="mt-5 font-serif text-2xl leading-snug text-white/90">“{r.comment_text}”</blockquote>
                  <figcaption className="mt-6 text-xs uppercase tracking-[.2em] text-white/50">{r.first_name} {r.last_name[0]}.</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
