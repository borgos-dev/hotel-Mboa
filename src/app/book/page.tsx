import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SafeImg from "@/components/SafeImg";
import Reveal from "@/components/Reveal";
import BookForm from "./BookForm";
import { getRoom } from "@/lib/queries";
import { roomImages, fallbackRoomImage } from "@/lib/images";
import { isDate, nightsBetween, xaf } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Book({ searchParams }: { searchParams: { room?: string; from?: string; to?: string; guests?: string } }) {
  const room = await getRoom(Number(searchParams.room));
  const ok = room && isDate(searchParams.from) && isDate(searchParams.to) && searchParams.to! > searchParams.from!;
  if (!ok) {
    return (<><Navbar solid /><main className="px-5 py-48 text-center"><p className="font-serif text-4xl">Pick a room and dates first.</p><Link href="/rooms" className="btn-gold mt-8">Find a room</Link></main><Footer /></>);
  }
  const nights = nightsBetween(searchParams.from!, searchParams.to!);
  const guests = Math.max(1, Math.min(room.max_capacity, Number(searchParams.guests) || 1));
  return (
    <>
      <Navbar solid />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-24 pt-36 lg:grid-cols-5">
        <Reveal as="aside" variant="reveal-left" className="lg:col-span-2">
          <div className="overflow-hidden bg-white shadow-xl">
            <SafeImg src={(roomImages[room.type] ?? [fallbackRoomImage])[0]} alt={room.type} className="h-60 w-full" />
            <div className="p-7">
              <p className="text-[10px] uppercase tracking-[.3em] text-gold-dark">{room.type}</p>
              <h1 className="mt-1 text-4xl">Room {room.room_number}</h1>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-ink/60">Check-in</dt><dd>{searchParams.from}</dd></div>
                <div className="flex justify-between"><dt className="text-ink/60">Check-out</dt><dd>{searchParams.to}</dd></div>
                <div className="flex justify-between"><dt className="text-ink/60">{nights} night{nights > 1 ? "s" : ""} × {xaf(room.base_price)}</dt><dd className="font-serif text-2xl text-gold-dark">{xaf(nights * room.base_price)}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-ink/50">Price excludes VAT and services. The nightly price is frozen at booking.</p>
            </div>
          </div>
        </Reveal>
        <Reveal as="section" variant="reveal-right" delay={150} className="lg:col-span-3">
          <BookForm roomId={room.room_id} from={searchParams.from!} to={searchParams.to!} guests={guests} maxGuests={room.max_capacity} />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
