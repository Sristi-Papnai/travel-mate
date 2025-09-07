"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLoginModal } from "./login-modal-context";
import { useForm } from "react-hook-form";
import { useSignupModal } from "@/app/(public)/_components/signup-modal-context";
import { useForgotPasswordModal } from "./forgot-password-modal-context";
import { Button } from "@/components/ui/button";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useLoginModal();
  const [mounted, setMounted] = useState(false);
  const { openSignup } = useSignupModal();
  const { openForgot } = useForgotPasswordModal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    mode: "onBlur", 
  });


  useEffect(() => setMounted(true), []);
 

  useEffect(() => {
    if (isLoginOpen) {
      reset(); 
    }
  }, [isLoginOpen, reset]);

  if (!mounted || !isLoginOpen) return null;

  const onSubmit = () => {
    // console.log("Logging in with:", data);
    
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeLogin(); 
    openSignup(); 
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">

      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeLogin}
      />

      {/* modal box */}
      <div className="relative z-[10000] flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={closeLogin}
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 text-black">Log in</h2>

          <form className="space-y-4 text-black" onSubmit={handleSubmit(onSubmit)}>
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
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <a
                href="#"
                className="text-sm text-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  closeLogin();
                  openForgot();
                }}
              >
                Forgot your password?
              </a>
            </div>

            {/* Dynamic button */}
            <Button
              variant="default"
              type="submit"
              className={`w-full py-3 rounded-lg text-white px-6 transition-colors ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isValid}
            >
              Log in
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-black">
            Need an account?{" "}
            <a href="#" onClick={handleSignupClick} className="text-blue-600 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
