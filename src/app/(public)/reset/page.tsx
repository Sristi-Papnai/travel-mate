// src/app/(public)/reset/page.tsx

import ResetPasswordForm from "@/app/(public)/reset/_componenets/reset-password-form";
import { validateToken } from "@/app/services/api/authApi";
import { notFound } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ResetPage({ searchParams }: any) {
  const tokenParam = searchParams?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!token) {
    return notFound();
  }

  const result = await validateToken({ token });

  if (result.error) {
    return notFound();
  }

  return <ResetPasswordForm token={token} />;
}
