import InnerLayout from "@/app/(private)/_components/layout/inner-layout";
import { SidebarProvider } from "@/context/sidebar-context";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <InnerLayout>{children}</InnerLayout>
    </SidebarProvider>
  );
}
