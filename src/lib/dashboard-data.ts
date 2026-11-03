export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type RoomStatus = "available" | "occupied" | "being_cleaned" | "out_of_service";
export type InvoiceStatus = "due" | "partially_paid" | "paid";

export type DashboardReservation = {
  id: number;
  guest: string;
  email: string;
  room: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: ReservationStatus;
};

export type DashboardInvoice = {
  id: string;
  guest: string;
  reservationId: number;
  issued: string;
  due: string;
  total: number;
  paid: number;
  status: InvoiceStatus;
};

export type DashboardRoom = {
  number: string;
  type: string;
  floor: number;
  status: RoomStatus;
  guest?: string;
  checkout?: string;
};

export type DashboardReview = {
  guest: string;
  rating: number;
  date: string;
  comment: string;
};

export const dashboardData = {
  reservations: [
    { id: 1048, guest: "Marie Ngono", email: "marie.ngono@example.com", room: "302", roomType: "Double", checkIn: "2026-11-03", checkOut: "2026-11-06", guests: 2, total: 148500, status: "confirmed" },
    { id: 1047, guest: "Jean-Paul Mbarga", email: "jean.mbarga@example.com", room: "501", roomType: "Suite", checkIn: "2026-11-03", checkOut: "2026-11-05", guests: 2, total: 253000, status: "confirmed" },
    { id: 1046, guest: "Amina Bello", email: "amina.bello@example.com", room: "214", roomType: "Single", checkIn: "2026-11-04", checkOut: "2026-11-07", guests: 1, total: 99000, status: "pending" },
    { id: 1045, guest: "Thomas Njoya", email: "thomas.njoya@example.com", room: "118", roomType: "Family", checkIn: "2026-11-04", checkOut: "2026-11-09", guests: 4, total: 429000, status: "confirmed" },
    { id: 1044, guest: "Sophie Ekotto", email: "sophie.ekotto@example.com", room: "407", roomType: "Double", checkIn: "2026-11-02", checkOut: "2026-11-04", guests: 2, total: 110000, status: "confirmed" },
    { id: 1043, guest: "David Osei", email: "david.osei@example.com", room: "203", roomType: "Double", checkIn: "2026-11-01", checkOut: "2026-11-03", guests: 2, total: 110000, status: "completed" },
    { id: 1042, guest: "Clara Tchoungang", email: "clara.t@example.com", room: "601", roomType: "Suite", checkIn: "2026-11-06", checkOut: "2026-11-10", guests: 2, total: 506000, status: "pending" },
    { id: 1041, guest: "Olivier Kamga", email: "olivier.kamga@example.com", room: "109", roomType: "Single", checkIn: "2026-10-30", checkOut: "2026-11-02", guests: 1, total: 99000, status: "completed" },
  ] satisfies DashboardReservation[],
  invoices: [
    { id: "INV-2026-084", guest: "Thomas Njoya", reservationId: 1045, issued: "2026-11-02", due: "2026-11-04", total: 429000, paid: 150000, status: "partially_paid" },
    { id: "INV-2026-083", guest: "Amina Bello", reservationId: 1046, issued: "2026-11-02", due: "2026-11-04", total: 99000, paid: 0, status: "due" },
    { id: "INV-2026-081", guest: "Clara Tchoungang", reservationId: 1042, issued: "2026-10-30", due: "2026-11-06", total: 506000, paid: 250000, status: "partially_paid" },
    { id: "INV-2026-079", guest: "Jean-Paul Mbarga", reservationId: 1047, issued: "2026-10-29", due: "2026-11-03", total: 253000, paid: 0, status: "due" },
  ] satisfies DashboardInvoice[],
  rooms: [
    { number: "101", type: "Single", floor: 1, status: "available" }, { number: "102", type: "Single", floor: 1, status: "being_cleaned" },
    { number: "109", type: "Single", floor: 1, status: "available" }, { number: "118", type: "Family", floor: 1, status: "occupied", guest: "Thomas Njoya", checkout: "09 Nov" },
    { number: "203", type: "Double", floor: 2, status: "available" }, { number: "214", type: "Single", floor: 2, status: "available" },
    { number: "302", type: "Double", floor: 3, status: "occupied", guest: "Marie Ngono", checkout: "06 Nov" }, { number: "305", type: "Double", floor: 3, status: "being_cleaned" },
    { number: "407", type: "Double", floor: 4, status: "occupied", guest: "Sophie Ekotto", checkout: "04 Nov" }, { number: "501", type: "Suite", floor: 5, status: "occupied", guest: "Jean-Paul Mbarga", checkout: "05 Nov" },
    { number: "508", type: "Suite", floor: 5, status: "out_of_service" }, { number: "601", type: "Suite", floor: 6, status: "available" },
  ] satisfies DashboardRoom[],
  reviews: [
    { guest: "Esther M.", rating: 5, date: "02 Nov 2026", comment: "Superb suite, perfect for our anniversary." },
    { guest: "Marie N.", rating: 5, date: "31 Oct 2026", comment: "Spotless room and very friendly staff." },
    { guest: "Paul B.", rating: 4, date: "28 Oct 2026", comment: "Great location and a very comfortable bed." },
  ] satisfies DashboardReview[],
  occupancy: [68, 72, 65, 78, 74, 81, 76, 84, 79, 87, 82, 88],
  revenue: [
    { month: "Jun", accommodation: 8200000, services: 1450000, miscellaneous: 620000 },
    { month: "Jul", accommodation: 9100000, services: 1680000, miscellaneous: 740000 },
    { month: "Aug", accommodation: 8700000, services: 1530000, miscellaneous: 580000 },
    { month: "Sep", accommodation: 10100000, services: 1920000, miscellaneous: 810000 },
    { month: "Oct", accommodation: 11400000, services: 2140000, miscellaneous: 930000 },
    { month: "Nov", accommodation: 4900000, services: 980000, miscellaneous: 360000 },
  ],
};

