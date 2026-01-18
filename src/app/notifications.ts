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
