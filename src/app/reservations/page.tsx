import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { myReservations } from "@/lib/queries";
import { xaf } from "@/lib/format";

export const dynamic = "force-dynamic";

const badge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800", confirmed: "bg-emerald-100 text-emerald-800",
  completed: "bg-sky-100 text-sky-800", cancelled: "bg-red-100 text-red-700",
};

export default async function Reservations({ searchParams }: { searchParams: { email?: string; last?: string } }) {
  const email = (searchParams.email ?? "").trim().toLowerCase();
  const last = (searchParams.last ?? "").trim();
  const rows = email && last ? await myReservations(email, last) : null;
  return (
    <>
      <Navbar solid />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-36">
        <h1 className="rise text-5xl">My reservations</h1>
        <form className="rise mt-8 grid gap-4 bg-white p-6 shadow-md sm:grid-cols-3 sm:items-end" style={{ animationDelay: ".2s" }}>
          <div><label className="label" htmlFor="email">E-mail</label><input id="email" name="email" type="email" required defaultValue={email} className="field" /></div>
          <div><label className="label" htmlFor="last">Last name</label><input id="last" name="last" required defaultValue={last} className="field" /></div>
          <button className="btn-gold h-[46px]">Look up</button>
        </form>
        {rows && (rows.length === 0
          ? <p className="mt-10 text-ink/60">No reservation found for these details.</p>
          : <ul className="mt-10 space-y-5">
              {rows.map((r, k) => (
                <Reveal as="li" key={r.reservation_id} delay={Math.min(k, 4) * 100} className="bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-3xl">Reservation #{r.reservation_id}</h2>
                    <span className={`px-3 py-1 text-[11px] uppercase tracking-widest ${badge[r.status]}`}>{r.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{r.check_in_date} → {r.check_out_date} · {r.nb_guests} guest(s) · {r.rooms ?? "—"}</p>
                  <p className="mt-3 text-sm">
                    {r.total_incl_tax != null
                      ? <>Invoice {xaf(r.total_incl_tax)} · paid {xaf(r.amount_paid ?? 0)} · <b className={Number(r.balance_due) > 0 ? "text-red-700" : "text-emerald-700"}>balance {xaf(r.balance_due ?? 0)}</b></>
                      : <>Rooms {r.room_total != null ? xaf(r.room_total) : "—"} (excl. VAT) · invoice issued after the stay</>}
                  </p>
                </Reveal>
              ))}
            </ul>)}
        <p className="mt-10 text-xs text-ink/40">Try: marie.ngono@example.com / Ngono</p>
      </main>
      <Footer />
    </>
  );
}
