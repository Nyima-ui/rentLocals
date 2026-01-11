import { Resend } from "resend";
import { NotifyProps } from "./globalTypes";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notify(payload: NotifyProps) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }
  return data;
}

// export async function notify(payload: {
//   to: string;
//   subject: string;
//   html: string;
// }) {
//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

//   const response = await fetch(`${baseUrl}/api/send-email`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result?.error ?? "Failed to send email");
//   }

//   return result;
// }
