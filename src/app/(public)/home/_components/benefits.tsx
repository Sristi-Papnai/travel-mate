import { GOOGLEIMAGES } from "@/app/_libs/constants/google-images";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Benefits() {
  return (
    <section>
    <div className="relative h-[500px] w-full flex ">
        {/* Left Content Section */}
        <div className="w-[50%] flex flex-col items-start justify-center space-y-6 text-left px-10">
            <p className="text-sm font-semibold text-gray-600 uppercase">Explore</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Discover the Benefits of TravelMate Today
            </h2>
            <p className="mt-4 text-gray-600">
            TravelMate simplifies your travel planning, saving you valuable time.
            Enjoy personalized experiences tailored to your preferences.
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
                <div className="flex items-center space-x-2">
                <span className="text-xl"> 
                  <Image
                  src="/icons/clock-black.svg"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="opacity-70"
                  />
                </span>
                <h3 className="font-semibold text-gray-900">Time-Saving</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                Effortlessly plan your trips without the hassle of extensive research.
                </p>
            </div>

            <div>
                <div className="flex items-center space-x-2">
                <span className="text-xl"> 
                  <Image
                  src="/icons/plane-blue.svg"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="opacity-70"
                  />
                </span>
                <h3 className="font-semibold text-gray-900">Cost-Efficient</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                Maximize your travel budget with our expert recommendations and exclusive deals.
                </p>
            </div>
            </div>

          <div className="flex items-end space-x-6 ">
            {/* Buttons */}
            <Button
              variant="default"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
              >
              Learn More
            </Button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-[40%] relative m-10 py-10 pl-10">
          <Image
            src={GOOGLEIMAGES.BENEFITS_BANNER}
            alt="Travel hero"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
