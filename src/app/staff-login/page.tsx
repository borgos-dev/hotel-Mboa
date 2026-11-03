"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last) {
      setError("Enter both your first name and last name.");
      return;
    }

    window.localStorage.setItem("hotel-mboa-staff", JSON.stringify({
      firstName: first,
      lastName: last,
      role: "Front desk manager",
    }));
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5 py-12 text-ink">
      <div className="w-full max-w-md border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center bg-navy text-white">
          <LockKeyhole size={21} />
        </div>
        <p className="mt-8 text-xs font-medium uppercase tracking-[.18em] text-gold-dark">Hôtel Mboa operations</p>
        <h1 className="mt-2 text-3xl font-semibold">Staff sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Enter your name to open the demonstration dashboard. Your staff profile will be remembered on this device.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium">First name</label>
            <div className="relative">
              <UserRound size={17} className="absolute left-3 top-3 text-slate-400" />
              <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-11 w-full border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-gold" placeholder="Aline" autoComplete="given-name" />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium">Last name</label>
            <input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-gold" placeholder="Mbarga" autoComplete="family-name" />
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 bg-navy text-sm font-medium text-white transition hover:bg-ink">
            Open dashboard <ArrowRight size={16} />
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">Demo access · no password required</p>
      </div>
    </main>
  );
}
