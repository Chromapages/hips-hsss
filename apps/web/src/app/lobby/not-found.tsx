"use client";

import { NotFoundShell } from "@/components/layout/NotFoundShell";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function LobbyNotFound() {
  return (
    <NotFoundShell
      title="Lobby not found"
      description="The lobby you are looking for does not exist or is no longer active."
    >
      <Button
        asChild
        className="h-12 px-8 bg-primary hover:bg-primary text-white rounded-2xl transition-all font-semibold"
      >
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Link>
      </Button>
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="h-12 px-8 text-muted-foreground hover:text-white hover:bg-surface/5 rounded-2xl transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
    </NotFoundShell>
  );
}
