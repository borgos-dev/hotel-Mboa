import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { isDate, today } from "@/lib/format";

export const dynamic = "force-dynamic";

/**
 * Creates a reservation through the stored procedure sp_create_reservation, so the database itself
 * enforces BR-04/05/07 (dates, capacity, no overlap). The message of any SQL error raised by the
 * triggers is returned to the visitor.
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const roomId = Number(b.roomId);
  const guests = Number(b.guests);
  const first = String(b.firstName ?? "").trim();
  const last = String(b.lastName ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  const phone = String(b.phone ?? "").replace(/[\s.-]/g, "");

  if (!Number.isInteger(roomId) || !Number.isInteger(guests) || guests < 1) return NextResponse.json({ error: "Choose a room and a number of guests." }, { status: 400 });
  if (!isDate(b.checkIn) || !isDate(b.checkOut)) return NextResponse.json({ error: "Choose valid dates." }, { status: 400 });
  if (b.checkIn < today()) return NextResponse.json({ error: "Check-in cannot be in the past." }, { status: 400 });
  if (b.checkOut <= b.checkIn) return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  if (!first || !last) return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  if (!/^[^@ ]+@[^@ ]+\.[A-Za-z]{2,}$/.test(email)) return NextResponse.json({ error: "Enter a valid e-mail address." }, { status: 400 });
  if (!/^\+[0-9]{8,15}$/.test(phone)) return NextResponse.json({ error: "Phone must be international, e.g. +237677000000." }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    // 1. find or create the client (e-mail is the natural identifier)
    const [found] = await conn.query<RowDataPacket[]>("SELECT client_id, last_name, phone FROM client WHERE email = ?", [email]);
    let clientId: number;
    if (found[0]) {
      if (found[0].last_name.toLowerCase() !== last.toLowerCase())
        return NextResponse.json({ error: "This e-mail already belongs to another guest name." }, { status: 409 });
      clientId = found[0].client_id;
    } else {
      const [ins] = await conn.query<ResultSetHeader>(
        "INSERT INTO client (last_name, first_name, phone, email) VALUES (?,?,?,?)", [last, first, phone, email]);
      clientId = ins.insertId;
    }

    // 2. atomic reservation (checks capacity, overlap, dates)
    await conn.query("CALL sp_create_reservation(?,?,?,?,?,@rid)", [clientId, b.checkIn, b.checkOut, guests, JSON.stringify([roomId])]);
    const [out] = await conn.query<RowDataPacket[]>("SELECT @rid AS id");
    return NextResponse.json({ reservationId: out[0].id });
  } catch (e) {
    const err = e as { code?: string; sqlState?: string; sqlMessage?: string };
    const msg: string = err.sqlMessage ?? "";
    if (err.code === "ER_DUP_ENTRY") return NextResponse.json({ error: "This phone number or e-mail is already used by another guest." }, { status: 409 });
    if (err.sqlState === "45000") return NextResponse.json({ error: msg }, { status: 409 }); // business-rule message from the database
    console.error(e);
    return NextResponse.json({ error: "Something went wrong, please try again." }, { status: 500 });
  } finally {
    conn.release();
  }
}
