"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!searchParams.get("message")) {
    router.push("/login");
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/10">
      <div className="bg-background p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-destructive">
          Google Auth Unsuccessful
        </h1>
        <p className="mb-4 text-gray-600">{searchParams.get("message")}</p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function GoogleAuthCallback() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
