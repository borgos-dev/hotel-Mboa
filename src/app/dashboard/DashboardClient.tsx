"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, BedDouble, Bell, CalendarDays, Check, ChevronDown, CircleDollarSign,
  Filter, LayoutDashboard, Menu, MoreHorizontal, Receipt, Search, Settings, Sparkles, Star, TrendingUp,
  Users, X, type LucideIcon,
} from "lucide-react";
import { dashboardData, type DashboardInvoice, type DashboardReservation, type DashboardRoom, type ReservationStatus, type RoomStatus } from "@/lib/dashboard-data";

const xaf = (value: number) => `${new Intl.NumberFormat("en-US").format(value)} XAF`;
const dateLabel = (date: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00`));
const notificationCount = 4;
type StaffMember = { firstName: string; lastName: string; role: string };
const defaultStaffMember: StaffMember = { firstName: "Aline", lastName: "Mbarga", role: "Front desk manager" };

const navItems: { label: string; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "Reservations", icon: CalendarDays },
  { label: "Rooms", icon: BedDouble }, { label: "Guests", icon: Users }, { label: "Services", icon: Sparkles },
  { label: "Invoices", icon: Receipt }, { label: "Guest reviews", icon: Star }, { label: "Analytics & reports", icon: TrendingUp },
];

const navTargets: Record<string, string> = {
  Overview: "/dashboard",
  Reservations: "/dashboard/reservations",
  Rooms: "/dashboard/rooms",
  Guests: "/dashboard/guests",
  Services: "/dashboard/services",
  Invoices: "/dashboard/invoices",
  "Guest reviews": "/dashboard/reviews",
  "Analytics & reports": "/dashboard/reports",
};

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700", completed: "bg-slate-100 text-slate-600", pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700", due: "bg-red-50 text-red-700", partially_paid: "bg-amber-50 text-amber-700", paid: "bg-emerald-50 text-emerald-700",
  available: "bg-emerald-50 text-emerald-700", occupied: "bg-blue-50 text-blue-700", being_cleaned: "bg-amber-50 text-amber-700", out_of_service: "bg-red-50 text-red-700",
};
const statusLabel = (value: string) => value.replace("_", " ");

function Badge({ value }: { value: string }) {
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[value] ?? "bg-slate-100 text-slate-600"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{statusLabel(value)}</span>;
}

function StatCard({ icon: Icon, label, value, note, positive, accent }: { icon: LucideIcon; label: string; value: string; note: string; positive?: boolean; accent: string }) {
  return <div className="border border-slate-200 bg-white p-5">
    <div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center ${accent}`}><Icon size={19} /></div><MoreHorizontal size={18} className="text-slate-300" /></div>
    <p className="mt-5 text-xs font-medium uppercase tracking-[.12em] text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
    <p className={`mt-2 flex items-center gap-1 text-xs ${positive ? "text-emerald-600" : "text-slate-500"}`}>{positive && <ArrowUpRight size={13} />}{note}</p>
  </div>;
}

function Panel({ title, action, children, className = "", id }: { title: string; action?: string; children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`border border-slate-200 bg-white ${className}`}><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-semibold text-ink">{title}</h2>{action && <button className="text-xs font-medium text-gold-dark hover:underline">{action}</button>}</div>{children}</section>;
}

function OccupancyChart() {
  return <div className="p-5"><div className="flex h-48 items-end gap-2 border-b border-l border-slate-200 px-3 pb-0 pt-3 sm:gap-4">{dashboardData.occupancy.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="relative w-full max-w-7 rounded-t-sm bg-gold/80 transition hover:bg-gold" style={{ height: `${value * 1.65}px` }} title={`${value}%`} /><span className="text-[10px] text-slate-400">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}</span></div>)}</div><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Occupancy rate</span><span className="font-medium text-ink">Monthly · 2026</span></div></div>;
}

function RevenueChart() {
  const max = Math.max(...dashboardData.revenue.map((r) => r.accommodation + r.services + r.miscellaneous));
  return <div className="p-5"><div className="flex h-48 items-end gap-4 border-b border-l border-slate-200 px-3 sm:gap-8">{dashboardData.revenue.map((item) => <div key={item.month} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-40 w-full max-w-9 flex-col justify-end overflow-hidden rounded-t-sm bg-slate-100"><div className="bg-gold" style={{ height: `${item.accommodation / max * 100}%` }} /><div className="bg-teal-500" style={{ height: `${item.services / max * 100}%` }} /><div className="bg-slate-300" style={{ height: `${item.miscellaneous / max * 100}%` }} /></div><span className="text-[10px] text-slate-400">{item.month}</span></div>)}</div><div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-500"><span><i className="mr-1.5 inline-block h-2 w-2 bg-gold" />Accommodation</span><span><i className="mr-1.5 inline-block h-2 w-2 bg-teal-500" />Services</span><span><i className="mr-1.5 inline-block h-2 w-2 bg-slate-300" />Miscellaneous</span></div></div>;
}

function ReservationTable({ reservations, onSelect }: { reservations: DashboardReservation[]; onSelect: (reservation: DashboardReservation) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-[.12em] text-slate-500"><tr><th className="px-5 py-3 font-medium">Guest</th><th className="px-5 py-3 font-medium">Room</th><th className="px-5 py-3 font-medium">Stay</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th><th /></tr></thead><tbody className="divide-y divide-slate-100">{reservations.map((r) => <tr key={r.id} className="hover:bg-slate-50"><td className="px-5 py-3"><button onClick={() => onSelect(r)} className="text-left font-medium text-ink hover:text-gold-dark">{r.guest}<span className="block text-xs font-normal text-slate-400">#{r.id} · {r.guests} guests</span></button></td><td className="px-5 py-3 text-slate-600">{r.room} <span className="text-xs text-slate-400">· {r.roomType}</span></td><td className="px-5 py-3 text-slate-600">{dateLabel(r.checkIn)} – {dateLabel(r.checkOut)}</td><td className="px-5 py-3 font-medium text-ink">{xaf(r.total)}</td><td className="px-5 py-3"><Badge value={r.status} /></td><td className="px-5 py-3 text-right"><button onClick={() => onSelect(r)} aria-label={`View reservation ${r.id}`}><MoreHorizontal size={17} className="text-slate-400" /></button></td></tr>)}</tbody></table></div>;
}

function RoomGrid({ rooms }: { rooms: DashboardRoom[] }) {
  return <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">{rooms.map((room) => <div key={room.number} className="border border-slate-100 p-3"><div className="flex items-center justify-between"><span className="font-semibold text-ink">{room.number}</span><Badge value={room.status} /></div><p className="mt-2 text-xs text-slate-500">{room.type} · Floor {room.floor}</p>{room.guest && <p className="mt-2 truncate text-xs text-slate-600">{room.guest}</p>}</div>)}</div>;
}

function InvoicePanel({ invoices, onSelect }: { invoices: DashboardInvoice[]; onSelect: (invoice: DashboardInvoice) => void }) {
  return <div className="divide-y divide-slate-100">{invoices.map((invoice) => <button key={invoice.id} onClick={() => onSelect(invoice)} className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50"><div><p className="text-sm font-medium text-ink">{invoice.guest}</p><p className="mt-1 text-xs text-slate-400">{invoice.id} · Due {dateLabel(invoice.due)}</p></div><div className="text-right"><p className="text-sm font-semibold text-ink">{xaf(invoice.total - invoice.paid)}</p><Badge value={invoice.status} /></div></button>)}</div>;
}

export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [staffMember, setStaffMember] = useState<StaffMember>(defaultStaffMember);
  const [reservationQuery, setReservationQuery] = useState("");
  const [reservationStatus, setReservationStatus] = useState<"all" | ReservationStatus>("all");
  const [roomType, setRoomType] = useState("all");
  const [roomStatus, setRoomStatus] = useState<"all" | RoomStatus>("all");
  const [dateRange, setDateRange] = useState("This month");
  const [selectedReservation, setSelectedReservation] = useState<DashboardReservation | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<DashboardInvoice | null>(null);
  const [page, setPage] = useState(1);
  const filteredReservations = useMemo(() => dashboardData.reservations.filter((item) => (!reservationQuery || `${item.guest} ${item.id} ${item.room}`.toLowerCase().includes(reservationQuery.toLowerCase())) && (reservationStatus === "all" || item.status === reservationStatus)), [reservationQuery, reservationStatus]);
  const filteredRooms = useMemo(() => dashboardData.rooms.filter((room) => (roomType === "all" || room.type === roomType) && (roomStatus === "all" || room.status === roomStatus)), [roomType, roomStatus]);
  const pageItems = filteredReservations.slice((page - 1) * 5, page * 5);
  const outstanding = dashboardData.invoices.reduce((sum, invoice) => sum + invoice.total - invoice.paid, 0);

  useEffect(() => {
    const updateActiveSection = () => setActiveSection(window.location.pathname.split("/").pop() || "overview");
    updateActiveSection();
    window.addEventListener("hashchange", updateActiveSection);
    const savedStaff = window.localStorage.getItem("hotel-mboa-staff");
    if (savedStaff) {
      try {
        const parsed = JSON.parse(savedStaff) as Partial<StaffMember>;
        if (typeof parsed.firstName === "string" && typeof parsed.lastName === "string" && parsed.firstName && parsed.lastName) {
          setStaffMember({
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            role: typeof parsed.role === "string" && parsed.role ? parsed.role : defaultStaffMember.role,
          });
        }
      } catch {
        window.localStorage.removeItem("hotel-mboa-staff");
      }
    }
    return () => window.removeEventListener("hashchange", updateActiveSection);
  }, []);

  const staffInitials = `${staffMember.firstName[0]}${staffMember.lastName[0]}`.toUpperCase();
  const selectSection = (target: string) => {
    setSidebarOpen(false);
  };

  return <div className="dashboard-shell min-h-screen bg-[#f7f8fa] text-ink">
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-navy/20 bg-navy text-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-20 items-center border-b border-white/10 px-6"><a href="/" className="font-serif text-2xl tracking-wide text-white">Hôtel <span className="text-gold">Mboa</span></a><button className="ml-auto text-white lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={20} /></button></div>
      <div className="px-4 pt-7"><p className="px-3 text-[11px] font-semibold uppercase tracking-[.18em] text-white/55">Workspace</p><nav className="mt-3 space-y-1">{navItems.map(({ label, icon: Icon }) => { const target = navTargets[label]; const active = label === "Overview" ? activeSection === "dashboard" : activeSection === target.split("/").pop(); return <a href={target} key={label} onClick={() => selectSection(target)} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 px-3 py-3 text-[15px] font-medium transition-colors ${active ? "bg-white text-navy shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"}`}><Icon size={18} strokeWidth={1.8} />{label}</a>; })}</nav></div>
      <div className="mt-auto border-t border-white/10 p-4"><a href="#settings" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white"><Settings size={17} />Settings</a><div className="mt-3 flex items-center gap-3 border-t border-white/10 px-3 pt-4"><div className="flex h-8 w-8 items-center justify-center bg-gold-soft text-xs font-semibold text-gold-dark">{staffInitials}</div><div><p className="text-xs font-medium text-white">{staffMember.firstName} {staffMember.lastName}</p><p className="text-[11px] text-white/55">{staffMember.role}</p></div></div></div>
    </aside>
    {sidebarOpen && <button className="fixed inset-0 z-20 bg-ink/30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}
    <main className="lg:pl-64">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={22} /></button><div><p className="text-xs text-slate-400">Tuesday, 03 November 2026</p><h1 className="text-lg font-semibold">Overview</h1></div></div><div className="flex items-center gap-4"><button className="relative text-slate-500" aria-label={`${notificationCount} notifications`}><Bell size={19} /><span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">{notificationCount}</span></button><div className="hidden h-7 w-px bg-slate-200 sm:block" /><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center bg-navy text-xs font-semibold text-white">{staffInitials}</div><span className="hidden text-sm font-medium sm:block">{staffMember.firstName} {staffMember.lastName}</span><ChevronDown size={15} className="text-slate-400" /></div></div></header>
      <div id="overview" className="mx-auto max-w-[1600px] px-5 py-7 md:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Good morning, Aline</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Here&apos;s what&apos;s happening today.</h2></div><div className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm"><CalendarDays size={16} className="text-slate-500" /><select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-transparent outline-none"><option>This month</option><option>Last month</option><option>Last 90 days</option></select></div></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><StatCard icon={BedDouble} label="Total rooms" value="48" note="Across 6 room types" accent="bg-gold-soft text-gold-dark" /><StatCard icon={Users} label="Occupied rooms" value="31" note="64.6% occupancy" positive accent="bg-blue-50 text-blue-700" /><StatCard icon={Check} label="Available rooms" value="12" note="3 being cleaned" accent="bg-emerald-50 text-emerald-700" /><StatCard icon={ArrowDownRight} label="Today’s arrivals" value="4" note="2 pending confirmation" accent="bg-amber-50 text-amber-700" /><StatCard icon={ArrowUpRight} label="Today’s departures" value="6" note="1 late checkout" accent="bg-slate-100 text-slate-600" /><StatCard icon={CircleDollarSign} label="Outstanding balance" value={xaf(outstanding)} note="4 invoices require attention" accent="bg-red-50 text-red-700" /></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel id="reports" title="Occupancy overview" action="View report"><OccupancyChart /></Panel><Panel id="services" title="Revenue overview" action="Export report"><RevenueChart /></Panel></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]"><Panel id="guests" title="Upcoming arrivals & departures" action="View all"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-[.12em] text-slate-500"><tr><th className="px-5 py-3 font-medium">Guest</th><th className="px-5 py-3 font-medium">Room</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Type</th></tr></thead><tbody className="divide-y divide-slate-100">{dashboardData.reservations.slice(0, 5).map((r) => <tr key={r.id}><td className="px-5 py-3 font-medium">{r.guest}<span className="block text-xs font-normal text-slate-400">#{r.id}</span></td><td className="px-5 py-3 text-slate-600">{r.room} · {r.roomType}</td><td className="px-5 py-3 text-slate-600">{dateLabel(r.checkIn)}</td><td className="px-5 py-3"><span className="inline-flex items-center gap-1 text-xs text-emerald-700"><ArrowDownRight size={13} />Arrival</span></td></tr>)}</tbody></table></div></Panel><Panel id="invoices" title="Unpaid invoices" action="View all"><InvoicePanel invoices={dashboardData.invoices} onSelect={setSelectedInvoice} /></Panel></div>
        <Panel id="reservations" title="Recent reservations" className="mt-6"><div className="flex flex-wrap gap-3 border-b border-slate-100 p-4"><div className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-2.5 text-slate-400" /><input value={reservationQuery} onChange={(e) => { setReservationQuery(e.target.value); setPage(1); }} placeholder="Search guest, room or ID..." className="h-9 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-gold" /></div><div className="flex items-center gap-2 border border-slate-200 px-3 text-sm"><Filter size={15} className="text-slate-400" /><select value={reservationStatus} onChange={(e) => { setReservationStatus(e.target.value as "all" | ReservationStatus); setPage(1); }} className="h-9 bg-transparent outline-none"><option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div></div>{pageItems.length ? <ReservationTable reservations={pageItems} onSelect={setSelectedReservation} /> : <div className="p-12 text-center text-sm text-slate-500">No reservations match your filters.</div>}<div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>Showing {pageItems.length} of {filteredReservations.length} reservations</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button><button disabled={page * 5 >= filteredReservations.length} onClick={() => setPage((current) => current + 1)} className="border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button></div></div></Panel>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]"><Panel id="rooms" title="Room status overview" action="Manage rooms"><div className="flex flex-wrap gap-2 border-b border-slate-100 p-4"><select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="border border-slate-200 px-3 py-2 text-xs outline-none"><option value="all">All room types</option><option>Single</option><option>Double</option><option>Family</option><option>Suite</option></select><select value={roomStatus} onChange={(e) => setRoomStatus(e.target.value as "all" | RoomStatus)} className="border border-slate-200 px-3 py-2 text-xs outline-none"><option value="all">All statuses</option><option value="available">Available</option><option value="occupied">Occupied</option><option value="being_cleaned">Being cleaned</option><option value="out_of_service">Out of service</option></select></div><RoomGrid rooms={filteredRooms} /></Panel><Panel id="reviews" title="Recent guest reviews" action="View all"><div className="divide-y divide-slate-100">{dashboardData.reviews.map((review) => <div key={review.guest} className="p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center bg-gold-soft text-xs font-semibold text-gold-dark">{review.guest.split(" ").map((part) => part[0]).join("")}</div><div><p className="text-sm font-medium">{review.guest}</p><p className="text-xs text-slate-400">{review.date}</p></div></div><span className="flex gap-0.5 text-gold">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < review.rating ? "currentColor" : "none"} />)}</span></div><p className="mt-3 text-sm leading-relaxed text-slate-600">“{review.comment}”</p></div>)}</div></Panel></div>
      </div>
    </main>
    {(selectedReservation || selectedInvoice) && <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-5" onClick={() => { setSelectedReservation(null); setSelectedInvoice(null); }}><div className="w-full max-w-md border border-slate-200 bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.16em] text-slate-400">{selectedReservation ? "Reservation details" : "Invoice details"}</p><h2 className="mt-1 text-xl font-semibold">{selectedReservation ? selectedReservation.guest : selectedInvoice?.guest}</h2></div><button onClick={() => { setSelectedReservation(null); setSelectedInvoice(null); }} aria-label="Close details"><X size={18} /></button></div>{selectedReservation ? <div className="mt-6 space-y-3 text-sm"><p className="flex justify-between"><span className="text-slate-500">Reservation</span><b>#{selectedReservation.id}</b></p><p className="flex justify-between"><span className="text-slate-500">Stay</span><b>{dateLabel(selectedReservation.checkIn)} – {dateLabel(selectedReservation.checkOut)}</b></p><p className="flex justify-between"><span className="text-slate-500">Room</span><b>{selectedReservation.room} · {selectedReservation.roomType}</b></p><p className="flex justify-between"><span className="text-slate-500">Total</span><b>{xaf(selectedReservation.total)}</b></p><p className="flex justify-between"><span className="text-slate-500">Status</span><Badge value={selectedReservation.status} /></p></div> : selectedInvoice && <div className="mt-6 space-y-3 text-sm"><p className="flex justify-between"><span className="text-slate-500">Invoice</span><b>{selectedInvoice.id}</b></p><p className="flex justify-between"><span className="text-slate-500">Reservation</span><b>#{selectedInvoice.reservationId}</b></p><p className="flex justify-between"><span className="text-slate-500">Total</span><b>{xaf(selectedInvoice.total)}</b></p><p className="flex justify-between"><span className="text-slate-500">Balance due</span><b className="text-red-700">{xaf(selectedInvoice.total - selectedInvoice.paid)}</b></p><p className="flex justify-between"><span className="text-slate-500">Status</span><Badge value={selectedInvoice.status} /></p></div>}</div></div>}
  </div>;
}
