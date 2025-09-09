// src/services/auth.ts (or wherever)

import type { IRegisterPayload } from "@/interfaces/openapi";


export async function registerUser(payload: IRegisterPayload) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // ensure cookies set by the server are accepted by the browser
    credentials: "include",
  });

  const result = await res.json().catch(() => ({}));
  return { res, result };
}
