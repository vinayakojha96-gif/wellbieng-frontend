import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import { figtree } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wellbeing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${figtree.className} antialiased tracking-wide font-medium`}
      >
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
