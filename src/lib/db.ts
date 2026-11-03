import mysql from "mysql2/promise";

// One pool shared across hot reloads in development.
const g = globalThis as unknown as { __hotelPool?: mysql.Pool };

export const pool: mysql.Pool =
  g.__hotelPool ??
  mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "hotel_db",
    dateStrings: true, // DATE columns stay 'YYYY-MM-DD' strings (no timezone shifts)
    decimalNumbers: true, // DECIMAL columns come back as numbers
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") g.__hotelPool = pool;
