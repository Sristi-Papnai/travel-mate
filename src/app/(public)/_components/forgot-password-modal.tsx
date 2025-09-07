"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useForgotPasswordModal } from "./forgot-password-modal-context";
import { useLoginModal } from "./login-modal-context";
import { Button } from "@/components/ui/button"; 

interface ForgotFormInputs {
  email: string;
}

export default function ForgotPasswordModal() {
  const { isForgotOpen, closeForgot } = useForgotPasswordModal();
  const { openLogin } = useLoginModal();
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ForgotFormInputs>({
    mode: "onBlur",
  });

  useEffect(() => setMounted(true), []);


  useEffect(() => {
    if (isForgotOpen) {
      reset();
    }
  }, [isForgotOpen, reset]);

  if (!mounted || !isForgotOpen) return null;

  const onSubmit = () => {
    // console.log("Password reset requested for:", data);
    // TODO: Call forgot password API
  };

  const handleGoBack = () => {
    closeForgot();
    openLogin(); 
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeForgot}
      />

      <div className="relative z-[10000] flex items-center justify-center h-full">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
          {/* Close button */}
          <Button
            variant="ghost"
            onClick={closeForgot}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            ✕
          </Button>

          <h2 className="text-2xl font-bold mb-3 text-black">Forgot Password</h2>
          <p className="mb-6 text-gray-700">
            Enter your email address to reset your password.
          </p>

          <form className="space-y-4 text-black" onSubmit={handleSubmit(onSubmit)}>
            <div>
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

            {/* Reset Password */}
            <Button
              type="submit"
              disabled={!isValid}
              variant="default"
              className={`w-full py-3 rounded-lg ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Reset password
            </Button>
          </form>

          {/* Go Back */}
          <Button
            onClick={handleGoBack}
            variant="default"
            className="mt-4 w-full py-3 rounded-lg bg-[#5b4ce2] hover:bg-[#483ac7] text-white"
          >
            Go back
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
