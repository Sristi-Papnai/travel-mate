"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSignupModal } from "./signup-modal-context";
import { useForm } from "react-hook-form";
import { useLoginModal } from "./login-modal-context";
import { Button } from "@/components/ui/button";

interface SignUpFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export default function SignUpModal() {
  const { isSignupOpen, closeSignup } = useSignupModal();
  const { openLogin } = useLoginModal(); 
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<SignUpFormInputs>({
    mode: "onBlur", 
    reValidateMode: "onBlur"
  });

  const passwordValue = watch("password");

  useEffect(() => setMounted(true), []);
  



   useEffect(() => {
    if (isSignupOpen) {
      reset(); 
    }
  }, [isSignupOpen, reset]);

  if (!mounted || !isSignupOpen) return null;

  const onSubmit = () => {
    // console.log("Sign up data:", data);
    // TODO - implement signup API call here
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/50" onClick={closeSignup} />

      <div className="relative z-[10000] flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={closeSignup}
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 text-black">Create an account</h2>

          <form className="space-y-4 text-black" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Password (min 8 characters)</label>
              <input
                type="password"
                placeholder="Password"
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (val) => val === passwordValue || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("agree", { required: "You must agree to continue" })}
              />
              <span className="text-sm">
                I agree to the{" "}
                <a href="#" className="underline text-blue-600">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="underline text-blue-600">
                  Terms of Service
                </a>
              </span>
            </div>
            {errors.agree && (
              <p className="text-red-500 text-sm mt-1">{errors.agree.message}</p>
            )}

            <Button
              variant="default"
              className={`w-full py-3 rounded-lg text-white px-6 transition-colors ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isValid}
            >
              Create account
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-black">
            Already have an account?{" "}
            <a href="#" onClick={() => {
                closeSignup();
                openLogin();
              }} className="text-blue-600 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
