"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { LoadingSpinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth-context";

function AuthLayoutContent() {
  const { user } = useAuth()!;
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  useEffect(() => {
    if (user) {
      router.push(next.startsWith("/") ? next : "/dashboard");
    }
  }, [user, router, next]);

  return null;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth()!;
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthLayoutContent />
      </Suspense>
      {children}
    </>
  );
}
