"use client";

import { useDialog } from "@/context/dialog-context";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openSignup, openForgot } = useDialog();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({ mode: "onBlur" });

  const onSubmit = () => {
    // console.log("Logging in with:", data);
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeLogin();
    openSignup();
  };

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
          <a
            href="#"
            onClick={handleSignupClick}
            className="text-blue-600 font-medium"
          >
            Sign up
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
