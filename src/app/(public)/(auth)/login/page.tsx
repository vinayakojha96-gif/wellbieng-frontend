"use client";

import AuthLayout from "@/components/layout/auth-layout";
import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="flex flex-col space-y-2 text-left mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
        </div>
        <LoginForm />
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          By clicking login, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?${decodeURIComponent(searchParams.toString())}`}
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
