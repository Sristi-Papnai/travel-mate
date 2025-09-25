import Image from "next/image";
import { authOptions } from "@/app/_libs/utils/auth"; 
import { getServerSession } from "next-auth";
import NavbarButtons from "@/app/(public)/_components/layout/navbar-buttons";


export default async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="flex justify-between sticky top-0 w-full z-50 items-center px-6 bg-black shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src="/images/logo.png" alt="Logo" width={100} height={40} />
      </div>
      <div className="flex items-end space-x-6 text-white">
        {/* Client Buttons */}
        <NavbarButtons session={session}/>
      </div>
    </nav>
  );
}
