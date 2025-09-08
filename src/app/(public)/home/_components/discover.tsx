import DiscoverCards from "@/app/(public)/home/_components/discover-cards";

export default function Discover() {
    return (
      <section className="w-full px-8 py-16 text-center">
        <p className="text-sm font-semibold text-gray-600 uppercase">Explore</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Discover Your Perfect Trip with TravelMate
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          At TravelMate, we specialize in crafting personalized itineraries that suit your
          unique preferences.
        </p>
        <DiscoverCards />
      </section>
    );
  }
  