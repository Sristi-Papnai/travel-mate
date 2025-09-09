"use client";

import { useEffect, useCallback} from "react";
import { useForm } from "react-hook-form";
import { useDialog } from "@/context/dialog-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ForgotFormInputs {
  email: string;
}

export default function ForgotPasswordModal() {
  const { isForgotOpen, closeForgot, openLogin } = useDialog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ForgotFormInputs>({ mode: "onBlur" });

  useEffect(() => {
    if (!isForgotOpen) {
      reset();
    }
  }, [isForgotOpen, reset]);

  const onSubmit = () => {
    // console.log("Password reset requested for:", data);
    // TODO: Call forgot password API
  };

  const handleGoBack = useCallback(() => {
    closeForgot();
    openLogin();
  }, [closeForgot, openLogin]);
  

  return (
    <Dialog open={isForgotOpen} onOpenChange={(open) => !open && closeForgot()}>
      <DialogContent
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 
                   [&_[data-slot='dialog-close']_svg]:text-black"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-3 text-black">
            Forgot Password
          </DialogTitle>
          <DialogDescription className="sr-only">
            Forgot password form modal
          </DialogDescription>
        </DialogHeader>

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
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
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
      </DialogContent>
    </Dialog>
  );
}
