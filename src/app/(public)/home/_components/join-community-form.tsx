"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { subscribeToNewsletter } from "@/app/services/api/newsletterApi";
import { useState } from "react";

type FormData = {
  email: string;
};

export default function JoinCommunityForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {

    const response = await subscribeToNewsletter(data.email);

    if (response?.error) {
      setServerMessage(response?.msg || "Something went wrong");
      setIsError(true);
    } else {
      setServerMessage(response?.msg || "Subscription added successfully");
      setIsError(false);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-1">
      {/* Input + Button in the same row */}
      <div className="flex items-center space-x-2">
        <input
          type="email"
          placeholder="Your Email Here"
          className="border border-gray-300 text-black rounded px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        <Button
          variant="default"
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Join Now
        </Button>
      </div>

      {/* Show validation or server messages below input */}
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}
      {serverMessage && (
        <p
          className={`text-sm ${
            isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {serverMessage}
        </p>
      )}
    </form>
  );
}