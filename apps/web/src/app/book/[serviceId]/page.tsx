"use client";

import { use } from "react";
import { useState } from "react";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { BookingSummaryBar } from "@/components/booking/BookingSummaryBar";
import { TimeSlotGrid } from "@/components/booking/TimeSlotGrid";
import { RouteChrome } from "@/components/polish/RouteChrome";

export default function BookServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const service = serviceId.replaceAll("-", " ");

  return (
    <RouteChrome disclaimer>
      <main className="min-h-screen bg-black pb-28 text-white">
        <section className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
            Booking
          </p>
          <h1 className="mt-3 text-4xl font-bold">Choose your session time.</h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            Select a weekday slot. The live room receives only an anonymous session reference.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_380px]">
            <AvailabilityCalendar
              onSelect={(value) => {
                setDate(value);
                setTime("");
              }}
            />
            <TimeSlotGrid date={date} onSelect={setTime} />
          </div>
        </section>
        <BookingSummaryBar date={date} service={service} time={time} />
      </main>
    </RouteChrome>
  );
}
