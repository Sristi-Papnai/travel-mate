import SidebarClient from "@/app/(private)/_components/layout/sidebar-client";


export default function Sidebar() {
  // Ideally fetch trips from DB here in server component
  const trips = [
    "Paris Getaway",
    "Summer in Bali",
    "Tokyo Adventure",
    "Mountain Escape",
    "Desert Safari",
    "New York Tour",
    "London Visit",
    "Rome Exploration",
  ];

  return <SidebarClient trips={trips} />;
}
