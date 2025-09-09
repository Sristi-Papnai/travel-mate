export interface IRegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export async function registerUser(payload: IRegisterPayload) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    const result = await res.json();
    return { res, result };
  }
  