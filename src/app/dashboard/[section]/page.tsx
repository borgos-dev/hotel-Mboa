import DashboardSectionClient from "../DashboardSectionClient";

type Section = "reservations" | "rooms" | "guests" | "services" | "invoices" | "reviews" | "reports";

const sections = new Set<Section>(["reservations", "rooms", "guests", "services", "invoices", "reviews", "reports"]);

export default function DashboardSectionPage({ params }: { params: { section: string } }) {
  const section = sections.has(params.section as Section) ? params.section as Section : "reports";
  return <DashboardSectionClient section={section} />;
}
