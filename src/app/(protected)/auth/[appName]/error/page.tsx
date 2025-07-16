"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppsErrorPage() {
  const router = useRouter();
  const appName = useParams().appName;
  const searchParams = useSearchParams();
  if (!searchParams.get("message")) return router.push("/login");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background/10">
      <div className="w-full max-w-md rounded-lg bg-background p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-destructive">
          {appName?.toString().toUpperCase()} Auth Unsuccessful
        </h1>
        <p className="mb-4 text-gray-600">{searchParams.get("message")}</p>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
