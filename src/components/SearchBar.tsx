import { addDays, today } from "@/lib/format";

/** Availability search: plain GET form to /rooms (no JavaScript required). */
export default function SearchBar({ types, values, floating = false }: {
  types: string[]; values?: { from?: string; to?: string; guests?: number; type?: string }; floating?: boolean;
}) {
  const from = values?.from ?? today();
  const to = values?.to ?? addDays(today(), 2);
  return (
    <form action="/rooms" method="get"
      className={`${floating ? "absolute inset-x-0 bottom-0 z-20 mx-auto w-[calc(100%-2.5rem)] max-w-6xl translate-y-1/2" : "mx-auto w-full max-w-6xl"} grid gap-4 bg-white p-6 shadow-2xl md:grid-cols-5 md:items-end`}>
      <div><label className="label" htmlFor="from">Check-in</label><input id="from" name="from" type="date" min={today()} defaultValue={from} required className="field" /></div>
      <div><label className="label" htmlFor="to">Check-out</label><input id="to" name="to" type="date" min={addDays(today(), 1)} defaultValue={to} required className="field" /></div>
      <div><label className="label" htmlFor="guests">Guests</label>
        <select id="guests" name="guests" defaultValue={values?.guests ?? 2} className="field">
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
        </select></div>
      <div><label className="label" htmlFor="type">Room type</label>
        <select id="type" name="type" defaultValue={values?.type ?? ""} className="field">
          <option value="">Any type</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select></div>
      <button className="btn-gold h-[46px]" type="submit">Check availability</button>
    </form>
  );
}
