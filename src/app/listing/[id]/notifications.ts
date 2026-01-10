export async function notifyOwner(payload: {
  to: string;
  subject: string;
  html: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error ?? "Failed to send email");
  }

  return result;
}
