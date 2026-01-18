"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

interface Calendar06Props {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export default function Calendar06({
  dateRange,
  setDateRange,
}: Calendar06Props) {
  return (
    <div className="mt-5">
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        min={1}
        className="rounded-lg border shadow-sm"
      />
      <div className="text-muted-foreground text-xs mt-3">
        Double click on the date to mark the start date.
      </div>
    </div>
  );
}
