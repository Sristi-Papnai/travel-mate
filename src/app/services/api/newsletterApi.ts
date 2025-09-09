export async function subscribeToNewsletter(email: string) {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      return { error: true, msg: "Network error" };
    }
  }
  