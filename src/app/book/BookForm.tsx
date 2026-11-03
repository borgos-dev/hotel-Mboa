"use client";
import { useState } from "react";
import Link from "next/link";

type P = { roomId: number; from: string; to: string; guests: number; maxGuests: number };

export default function BookForm({ roomId, from, to, guests, maxGuests }: P) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);
  const [g, setG] = useState(guests);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/book", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, checkIn: from, checkOut: to, guests: g, firstName: f.get("firstName"), lastName: f.get("lastName"), email: f.get("email"), phone: f.get("phone") }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) setDone(j.reservationId); else setError(j.error ?? "Booking failed.");
  }

  if (done) {
    return (
      <div className="bg-white p-10 text-center shadow-xl">
        <p className="text-5xl text-gold">✓</p>
        <h2 className="mt-4 text-4xl">Reservation #{done} received</h2>
        <p className="mt-3 text-sm text-ink/70">It is <b>pending</b> until the hotel confirms it. Use your e-mail and last name to follow it.</p>
        <Link href="/reservations" className="btn-gold mt-8">My reservations</Link>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-5 bg-white p-8 shadow-xl">
      <h2 className="text-3xl">Your details</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label" htmlFor="firstName">First name</label><input id="firstName" name="firstName" required className="field" /></div>
        <div><label className="label" htmlFor="lastName">Last name</label><input id="lastName" name="lastName" required className="field" /></div>
      </div>
      <div><label className="label" htmlFor="email">E-mail</label><input id="email" name="email" type="email" required className="field" /></div>
      <div><label className="label" htmlFor="phone">Phone (international format)</label><input id="phone" name="phone" placeholder="+237677000000" required className="field" /></div>
      <div><label className="label" htmlFor="g">Guests (max {maxGuests} in this room)</label>
        <input id="g" type="number" min={1} value={g} onChange={(e) => setG(Number(e.target.value))} className="field" /></div>
      {error && <p className="border-l-4 border-red-400 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="btn-gold w-full disabled:opacity-60">{busy ? "Booking…" : "Confirm reservation"}</button>
    </form>
  );
}
