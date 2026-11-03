import Link from "next/link";
import type { Room } from "@/lib/queries";
import { roomImages, fallbackRoomImage } from "@/lib/images";
import { xaf } from "@/lib/format";
import SafeImg from "./SafeImg";

export default function RoomCard({ room, query }: { room: Room; query?: { from?: string; to?: string; guests?: number } }) {
  const img = (roomImages[room.type] ?? [fallbackRoomImage])[0];
  const bookable = query?.from && query?.to;
  const href = bookable
    ? `/book?room=${room.room_id}&from=${query!.from}&to=${query!.to}&guests=${query!.guests ?? 1}`
    : "/rooms#search";
  return (
    <article className="group flex flex-col bg-white shadow-sm transition hover:shadow-2xl">
      <div className="zoom-frame relative h-64">
        <SafeImg src={img} alt={`${room.type} room ${room.room_number}`} className="h-full w-full" />
        <span className="absolute left-4 top-4 bg-ink/85 px-3 py-1 text-[10px] uppercase tracking-[.25em] text-gold">{room.type}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl">Room {room.room_number}</h3>
          <p className="text-sm text-ink/60">Floor {room.floor_number} · up to {room.max_capacity}</p>
        </div>
        <p className="mt-2 text-sm text-ink/70">{room.type_description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {room.amenities.slice(0, 5).map((a) => (
            <li key={a} className="border border-gold/40 bg-gold-soft/60 px-2.5 py-1 text-[11px] tracking-wide text-ink/70">{a}</li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between pt-6">
          <p><span className="font-serif text-3xl text-gold-dark">{xaf(room.base_price)}</span><span className="text-xs text-ink/50"> / night</span></p>
          <Link href={href} className="text-xs font-medium uppercase tracking-[.2em] text-ink underline decoration-gold decoration-2 underline-offset-8 transition hover:text-gold-dark">
            {bookable ? "Book" : "Check dates"}
          </Link>
        </div>
      </div>
    </article>
  );
}
