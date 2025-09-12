import Image from "next/image";
import { GOOGLEIMAGES } from "@/app/_libs/constants/google-images";
import BannerButtons from "./banner-buttons";

export default function HomeBanner() {
  return (
    <section>
      <div className="relative h-[500px] w-full flex bg-black">
        {/* Left Content Section */}
        <div className="w-[50%] flex flex-col items-start justify-center space-y-6 text-left px-10">
          <h1 className="text-white text-5xl ">
            Plan Your Perfect Trip <br /> 
            with TravelMate
          </h1>
          <p className="text-white text-lg">
            At TravelMate, we specialize in crafting personalized travel experiences
            tailored to your unique preferences. Let us handle the details while you
            focus on making memories.
          </p>

          {/* Client Buttons */}
          <BannerButtons />
        </div>

        {/* Right Image Section */}
        <div className="w-[40%] relative m-10 py-10 pl-10">
          <Image
            src={GOOGLEIMAGES.HOME_BANNER1}
            alt="Travel hero"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      <div className="relative h-[500px] w-full flex bg-gray-500">
        {/* Left Content Section */}
        <div className="w-[50%] flex flex-col items-start justify-center space-y-6 text-left px-10">
          <h1 className="text-white text-5xl ">
            Experience Seamless Travel  <br /> 
            Planning with TravelMate&apos;s <br/>
            Personalized Trip Solution
          </h1>
          <p className="text-white text-lg">
            TravelMate simplifies your journey by tailoring trips to your unique preferences and interests. 
            Say goodbye to generic itineraries and hello to unforgettable adventures crafted just for you.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="w-[40%] relative m-10 py-10 pl-10">
          <Image
            src={GOOGLEIMAGES.HOME_BANNER2}
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
