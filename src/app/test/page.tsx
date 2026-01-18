"use client";
import dynamic from "next/dynamic";

const CalendarClient = dynamic(() => import("@/components/calendar-06"), {
  ssr: false,
});

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const date = formData.get("start-date") as string;
  console.log(date);
}

const page = () => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="start-date">Pick Start Date</label>
        <input type="date" id="start-date" name="start-date" />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default page;
