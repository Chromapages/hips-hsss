import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function CheckoutNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-black p-6 text-white">
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl max-w-lg mx-auto shadow-2xl shadow-black/50">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-6 ring-1 ring-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Checkout not found</h3>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          The checkout session you are looking for does not exist or has expired.
        </p>
        <div className="mt-8 flex gap-3">
          <Button
            asChild
            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all font-semibold"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-12 px-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </main>
  );
}
