"use client";
import { Button } from "@/components/ui/button";

const page = () => {
  async function sendEmaill() {
    try {
      const response = await fetch("/api/send");
      const result = await response.json();
      if (response.ok) {
        alert("Email sent successfully");
      } else {
        console.error("Error sending email:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  async function sendEmail() {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ntenzin492@gmail.com",
        subject: "Hello, how are you 😉",
        html: "<h1>Good day</h1>",
      }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log(result);
    } else {
      console.error(`Error sending email: ${result}`);
    }
  }
  return (
    <div className="max-w-6xl mx-auto mt-15">
      <Button onClick={sendEmail}>send email</Button>
    </div>
  );
};

export default page;
