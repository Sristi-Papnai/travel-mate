
import ChangePasswordForm from "@/app/(public)/changepassword/[token]/_componenets/change-password-form";
import { validateToken } from "@/app/services/api/authApi";
import { notFound } from "next/navigation";

interface PageProps {
  params: { token: string };
}

export default async function ChangePasswordPage({ params }: PageProps) {
  const { token } = params;

  // Call API with absolute URL
  const result = await validateToken({ token });

  if (result.error) {
    // token invalid or expired → show root-level not-found
    return notFound();
  }

  // token valid → render client form
  return <ChangePasswordForm token={token} />;
}
