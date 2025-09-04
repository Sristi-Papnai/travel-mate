"use client";
import Image from "next/image";
import { useState } from "react";
import SignupModal from "./signup-modal";

export default function HomeBanner() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative h-[500px] w-full flex">
      {/* Left Content Section */}
      <div className="w-[55%] bg-black flex flex-col items-center justify-center space-y-6 text-center px-8">
        <h1 className="text-white text-5xl font-bold">
          Plan Your Perfect Trip with TravelMate
        </h1>
        <p className="text-white text-lg max-w-xl">
          At TravelMate, we specialize in crafting personallzed travel experiences
          tailored to your unique preferences. Let us handle the details while you
          focus on making memories.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Get Started
        </button>
      </div>

      {/* Right Image Section */}
      <div className="w-[45%] relative">
        <Image
          src="https://imgs.search.brave.com/O_zOmL9eGrJ5zUWYBrHV_U9ucoA1UuyZeEP584q2V-8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by93b3JraW5n/LXNtYXJ0LWhhcmQt/c2hvdC15b3VuZy0y/NjBudy0yMTUwMzIz/NDk1LmpwZw"
          alt="Travel hero"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Signup Modal */}
      <SignupModal open={open} setOpen={setOpen} />
    </section>
  );
}
