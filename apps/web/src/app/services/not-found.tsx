"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function ServicesNotFound() {
  return (
    <main id="main" tabIndex={-1}
      className="grid min-h-screen place-items-center bg-background p-6 pt-24 text-text-primary"
    >
      <div
        role="alert"
        className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-border rounded-[2.5rem] max-w-lg mx-auto shadow-card"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-6 ring-1 ring-primary/20">
          <Search className="h-12 w-12" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Service not found
        </h1>
        <p className="mt-4 text-text-secondary leading-relaxed">
          The service you are looking for does not exist or has been removed.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild>
            <Link href="/services" data-analytics="cta-not-found-catalog">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to Catalog
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/" data-analytics="cta-not-found-home">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
