"use client";

import Header from "@/components/ui/header";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnalyticsLayoutProps = {
  children: React.ReactNode;
};

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = pathname.includes("users") ? "users" : "team";

  const [view, setView] = useState<"users" | "team">(currentTab);
  const { user } = useAuth()!;

  useEffect(() => {
    if (user?.role === "Member") {
      router.push("/analytics/users/me");
    }
    setView(currentTab);
  }, [pathname, currentTab]);

  if (user?.role === "Member" && pathname !== "/analytics/users/me") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mb-10 mr-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Header
          title="Analytics"
          description="Track and analyze mood and stress patterns"
        />
        {user?.role === "Member" ? (
          ""
        ) : (
          <div className="flex items-center gap-4">
            <Tabs
              value={view}
              onValueChange={(v) => setView(v as "users" | "team")}
            >
              <TabsList>
                <Link href="/analytics">
                  <TabsTrigger value="team">Team</TabsTrigger>
                </Link>
                <Link href="/analytics/users">
                  <TabsTrigger value="users">Users</TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
