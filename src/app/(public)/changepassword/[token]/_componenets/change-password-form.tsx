"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/app/services/api/authApi";

interface FormInputs {
  password: string;
  confirmPassword: string;
}

interface Props {
  token: string;
}

export default function ChangePasswordForm({ token }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isValid } } =
    useForm<FormInputs>({ mode: "onTouched" });

    const onSubmit = async (data: FormInputs) => {
      try {
        setError("");
    
        const response = await resetPassword({ token, password: data.password });
    
        if (response.error) {
          // API returned an error
          setError(response.msg || "Failed to reset password. Please try again.");
          return;
        }
    
        // Success
        router.push("/home");
      } catch (err) {
        console.error(err);
        setError("Failed to reset password. Please try again.");
      }
    };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Change Your Password
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none text-black ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none text-black ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg ${
              isValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
}
