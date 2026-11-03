import type { RowDataPacket } from "mysql2";
import { pool } from "./db";

export type Room = {
  room_id: number;
  room_number: string;
  floor_number: number;
  type: string;
  type_description: string;
  max_capacity: number;
  base_price: number;
  amenities: string[];
};

type Filters = { from?: string; to?: string; type?: string; guests?: number };

/**
 * Rooms that can be offered. With dates this is query Q1 of 04_queries.sql:
 * a room is free when no NON-cancelled reservation overlaps [from, to).
 * The site additionally hides rooms that are currently out of service.
 */
export async function findRooms({ from, to, type, guests }: Filters): Promise<Room[]> {
  const params: (string | number)[] = [];
  let sql = `
    SELECT ro.room_id, ro.room_number, ro.floor_number, rt.name AS type,
           COALESCE(rt.description, '') AS type_description, ro.max_capacity, ro.base_price,
           (SELECT GROUP_CONCAT(a.name ORDER BY a.name SEPARATOR '|')
              FROM room_amenity ra JOIN amenity a ON a.amenity_id = ra.amenity_id
             WHERE ra.room_id = ro.room_id) AS amenities
      FROM room ro
      JOIN room_type rt ON rt.room_type_id = ro.room_type_id
     WHERE ro.operational_status <> 'out_of_service'`;
  if (type) { sql += ` AND rt.name = ?`; params.push(type); }
  if (guests) { sql += ` AND ro.max_capacity >= ?`; params.push(guests); }
  if (from && to) {
    sql += `
       AND NOT EXISTS (
             SELECT 1 FROM reservation_room rr
               JOIN reservation r ON r.reservation_id = rr.reservation_id
              WHERE rr.room_id = ro.room_id AND r.status <> 'cancelled'
                AND r.check_in_date < ? AND r.check_out_date > ?)`;
    params.push(to, from);
  }
  sql += ` ORDER BY rt.room_type_id, ro.base_price, ro.room_number`;
  const [rows] = await pool.query<RowDataPacket[]>(sql, params);
  return rows.map((r) => ({ ...(r as unknown as Room), amenities: r.amenities ? String(r.amenities).split("|") : [] }));
}

export async function getRoom(id: number): Promise<Room | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ro.room_id, ro.room_number, ro.floor_number, rt.name AS type,
            COALESCE(rt.description,'') AS type_description, ro.max_capacity, ro.base_price,
            (SELECT GROUP_CONCAT(a.name ORDER BY a.name SEPARATOR '|')
               FROM room_amenity ra JOIN amenity a ON a.amenity_id = ra.amenity_id
              WHERE ra.room_id = ro.room_id) AS amenities
       FROM room ro JOIN room_type rt ON rt.room_type_id = ro.room_type_id
      WHERE ro.room_id = ?`, [id]);
  if (!rows[0]) return null;
  const r = rows[0];
  return { ...(r as unknown as Room), amenities: r.amenities ? String(r.amenities).split("|") : [] };
}

export async function roomTypes(): Promise<{ name: string; description: string; from_price: number; rooms: number; max_capacity: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT rt.name, COALESCE(rt.description,'') AS description, MIN(ro.base_price) AS from_price,
            COUNT(*) AS rooms, MAX(ro.max_capacity) AS max_capacity
       FROM room_type rt JOIN room ro ON ro.room_type_id = rt.room_type_id
      GROUP BY rt.room_type_id, rt.name, rt.description ORDER BY rt.room_type_id`);
  return rows as unknown as { name: string; description: string; from_price: number; rooms: number; max_capacity: number }[];
}

export async function services() {
  const [rows] = await pool.query<RowDataPacket[]>(`SELECT service_id, name, description, price FROM service ORDER BY service_id`);
  return rows as unknown as { service_id: number; name: string; description: string; price: number }[];
}

export async function reviews(limit = 6) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT rv.rating, rv.comment_text, rv.review_date, c.first_name, c.last_name
       FROM review rv JOIN reservation r ON r.reservation_id = rv.reservation_id
       JOIN client c ON c.client_id = r.client_id
      WHERE rv.comment_text IS NOT NULL AND rv.comment_text <> ''
      ORDER BY rv.rating DESC, rv.review_date DESC LIMIT ?`, [limit]);
  return rows as unknown as { rating: number; comment_text: string; review_date: string; first_name: string; last_name: string }[];
}

export async function stats() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT (SELECT COUNT(*) FROM room) AS rooms,
            (SELECT COUNT(*) FROM client) AS guests,
            (SELECT COUNT(*) FROM reservation WHERE status='completed') AS stays,
            (SELECT ROUND(AVG(rating),1) FROM review) AS rating`);
  return rows[0] as unknown as { rooms: number; guests: number; stays: number; rating: number };
}

export async function myReservations(email: string, lastName: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT r.reservation_id, r.check_in_date, r.check_out_date, r.nb_guests, r.status,
            (SELECT GROUP_CONCAT(CONCAT(rt.name, ' ', ro.room_number) ORDER BY ro.room_number SEPARATOR ', ')
               FROM reservation_room rr JOIN room ro ON ro.room_id = rr.room_id
               JOIN room_type rt ON rt.room_type_id = ro.room_type_id
              WHERE rr.reservation_id = r.reservation_id) AS rooms,
            (SELECT SUM(nightly_price) FROM reservation_room rr WHERE rr.reservation_id = r.reservation_id)
              * DATEDIFF(r.check_out_date, r.check_in_date) AS room_total,
            b.total_incl_tax, b.amount_paid, b.balance_due
       FROM client c JOIN reservation r ON r.client_id = c.client_id
       LEFT JOIN v_invoice_balance b ON b.reservation_id = r.reservation_id
      WHERE c.email = ? AND c.last_name = ?
      ORDER BY r.check_in_date DESC`, [email, lastName]);
  return rows as unknown as {
    reservation_id: number; check_in_date: string; check_out_date: string; nb_guests: number; status: string;
    rooms: string | null; room_total: number | null; total_incl_tax: number | null; amount_paid: number | null; balance_due: number | null;
  }[];
}
