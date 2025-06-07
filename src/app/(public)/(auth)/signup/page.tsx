"use client";

import AuthLayout from "@/components/layout/auth-layout";
import { SignUpForm } from "@/components/signup-form";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6 flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a new account
          </h1>
        </div>
        <SignUpForm />
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          By creating an account, you agree to our{" "}
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
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
