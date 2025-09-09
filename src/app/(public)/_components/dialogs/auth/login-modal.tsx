"use client";

import { useState, useEffect, useCallback, type MouseEvent} from "react";
import { useDialog } from "@/context/dialog-context";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginModal() {
  const router = useRouter();
  const { isLoginOpen, closeLogin, openSignup, openForgot } = useDialog();
  const [msg, setMsg] = useState("");


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({ mode: "onBlur" });


  useEffect(() => {
    if (!isLoginOpen) {
      reset();
    }
  }, [isLoginOpen]);


  const onSubmit = async (data: LoginFormInputs) => {
    setMsg("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setMsg("Invalid Credentials");
        return;
      }

      // Successful login, redirect to dashboard
      router.push("/dashboard");
      closeLogin();
    } catch (err) {
      console.error("Login error:", err);
      setMsg("Something went wrong. Please try again.");
    }
  };

  const handleSignupClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      closeLogin();
      openSignup();
    },
    [closeLogin, openSignup] // deps
  );
  
  const handleForgotPassword = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      closeLogin();
      openForgot();
    },
    [closeLogin, openForgot] // deps
  );
  
  

  return (
    <Dialog open={isLoginOpen} onOpenChange={(open) => !open && closeLogin()}>
      <DialogContent className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 [&_[data-slot='dialog-close']_svg]:text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-6 text-black">
            Log in
          </DialogTitle>
          <DialogDescription className="sr-only">
            Login form modal
          </DialogDescription>
        </DialogHeader>

        {msg && (
          <p className="text-red-500 text-sm mb-4 text-center">{msg}</p>
        )}

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
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
          <p
            onClick={handleForgotPassword}
            className="text-sm text-blue-600"
          >
            Forgot your password?
          </p>

          </div>

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
          <span
            onClick={handleSignupClick}
            className="text-blue-600 font-medium"
          >
            Sign up
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
