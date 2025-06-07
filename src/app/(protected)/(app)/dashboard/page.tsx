"use client";

import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/context/auth-context";
import apiClient from "@/services/api-client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Streak {
  type: string;
  currentStreak: number;
  longestStreak: number;
  lastSubmission: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  streaks: Streak[];
}

interface StreaksData {
  topMoodCurrentStreak: { moodCurrentStreak: number };
  topMoodLongestStreak: { moodLongestStreak: number };
  topStressCurrentStreak: { moodLongestStreak: number };
  topStressLongestStreak: { moodLongestStreak: number };
  users: User[];
}

export default function Dashboard() {
  const { activeTeamId, user } = useAuth()!;

  const [streaksData, setStreaksData] = useState<StreaksData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStreaksData = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get("/streaks/team", {
          headers: {
            "x-team-id": activeTeamId,
          },
        });
        const streaks = (data.success && data.responseObject) || null;
        setStreaksData(streaks);
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.role === "Member") return;
    fetchStreaksData();
  }, [activeTeamId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <Header title="Dashboard" />

      <div className="container mx-auto mt-8 pr-5">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Top Mood Streaks</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current Streak
                  </span>
                  <span className="font-medium">
                    {streaksData?.topMoodCurrentStreak?.moodCurrentStreak || 0}{" "}
                    days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Longest Streak
                  </span>
                  <span className="font-medium">
                    {streaksData?.topMoodLongestStreak?.moodLongestStreak || 0}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Top Stress Streaks</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current Streak
                  </span>
                  <span className="font-medium">
                    {streaksData?.topStressCurrentStreak?.moodLongestStreak ||
                      0}{" "}
                    days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Longest Streak
                  </span>
                  <span className="font-medium">
                    {streaksData?.topStressLongestStreak?.moodLongestStreak ||
                      0}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border">
            <div className="p-4 pb-0">
              <h3 className="mb-2 text-lg font-semibold">Streaks Board</h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mood Streak</TableHead>
                  <TableHead>Stress Streak</TableHead>
                  <TableHead>Last Submission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streaksData?.users?.map((user) => {
                  const moodStreak = user.streaks.find(
                    (s) => s.type === "mood",
                  );
                  const stressStreak = user.streaks.find(
                    (s) => s.type === "stress",
                  );

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || user.email.split("@")[0]}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {moodStreak?.currentStreak || 0}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (Longest: {moodStreak?.longestStreak || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {stressStreak?.currentStreak || 0}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (Longest: {stressStreak?.longestStreak || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          Math.max(
                            moodStreak?.lastSubmission
                              ? new Date(moodStreak.lastSubmission).getTime()
                              : 0,
                            stressStreak?.lastSubmission
                              ? new Date(stressStreak.lastSubmission).getTime()
                              : 0,
                          ),
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
