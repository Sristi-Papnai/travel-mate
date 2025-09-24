import TripForm from "@/app/(private)/create-trip/_components/trip-form";
import { authOptions } from "@/app/_libs/utils/auth";
import { getServerSession } from "next-auth";

export default async function CreateTripPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="w-full min-h-[90vh] flex items-center rounded-2xl justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200">
      <TripForm session={session} />
    </div>
  );
}
