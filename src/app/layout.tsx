import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hôtel Mboa — Rooms, suites & services in Douala",
  description: "Book a room at Hôtel Mboa. Database course project (MySQL 8).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
