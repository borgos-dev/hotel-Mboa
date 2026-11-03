import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import RoomCard from "@/components/RoomCard";
import Reveal from "@/components/Reveal";
import { findRooms, roomTypes } from "@/lib/queries";
import { isDate, nightsBetween } from "@/lib/format";

export const dynamic = "force-dynamic";

type SP = { from?: string; to?: string; guests?: string; type?: string };

export default async function Rooms({ searchParams }: { searchParams: SP }) {
  const types = await roomTypes();
  const hasDates = isDate(searchParams.from) && isDate(searchParams.to) && searchParams.to > searchParams.from;
  const guests = Math.max(1, Math.min(10, Number(searchParams.guests) || 0)) || undefined;
  const type = types.some((t) => t.name === searchParams.type) ? searchParams.type : undefined;
  const rooms = await findRooms({ from: hasDates ? searchParams.from : undefined, to: hasDates ? searchParams.to : undefined, type, guests });
  const q = hasDates ? { from: searchParams.from, to: searchParams.to, guests } : undefined;
  const dateError = (searchParams.from || searchParams.to) && !hasDates;

  return (
    <>
      <Navbar solid />
      <header className="bg-navy pb-24 pt-36 text-center text-white">
        <p className="rise text-xs uppercase tracking-[.4em] text-gold" style={{ animationDelay: ".1s" }}>Rooms & suites</p>
        <h1 className="rise mt-4 text-5xl md:text-6xl" style={{ animationDelay: ".3s" }}>Find your room</h1>
      </header>
      <div id="search" className="relative z-10 mx-auto -mt-10 px-5">
        <SearchBar types={types.map((t) => t.name)} values={{ from: searchParams.from, to: searchParams.to, guests, type }} />
      </div>
      <main className="mx-auto max-w-7xl px-5 py-16">
        {dateError && <p className="mb-8 border-l-4 border-red-400 bg-red-50 p-4 text-sm text-red-700">Check-out must be after check-in.</p>}
        <p className="mb-10 text-sm text-ink/60">
          {rooms.length} room{rooms.length === 1 ? "" : "s"} {hasDates ? `available for ${nightsBetween(searchParams.from!, searchParams.to!)} night(s)` : "in our catalogue — pick dates to see live availability"}
        </p>
        {rooms.length === 0 ? (
          <p className="py-20 text-center font-serif text-3xl text-ink/60">No room matches. Try other dates or fewer guests.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r, k) => <Reveal key={r.room_id} delay={(k % 3) * 100}><RoomCard room={r} query={q} /></Reveal>)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
