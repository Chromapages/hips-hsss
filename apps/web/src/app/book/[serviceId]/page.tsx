"use client";

import { use } from "react";
import { useState } from "react";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { BookingSummaryBar } from "@/components/booking/BookingSummaryBar";
import { TimeSlotGrid } from "@/components/booking/TimeSlotGrid";
import { Navbar } from "@/components/polish/Navbar";

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
    <>
      <Navbar />
      <main className="min-h-screen bg-black pb-40 text-white selection:bg-indigo-500/30">
        {/* Ambient Glow */}
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-12">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              Session Reservation
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Find a time that <br />
              <span className="text-zinc-600">works for you.</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium max-w-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Select your preferred date and time slot. All sessions are protected by 
              our hard anonymity protocol — your identity remains entirely private.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <AvailabilityCalendar
              onSelect={(value) => {
                setDate(value);
                setTime("");
              }}
            />
            <TimeSlotGrid date={date} serviceId={serviceId} onSelect={setTime} />
          </div>
        </section>

        {date && time && (
          <BookingSummaryBar serviceId={serviceId} serviceName={service} date={date} time={time} />
        )}
      </main>
    </>
  );
}
