import Footer from "@/app/(public)/_components/layout/footer";
import Navbar from "@/app/_components/layout/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
