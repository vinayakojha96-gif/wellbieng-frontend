"use client";

import { Badge } from "@/components/ui/badge";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import apiClient, { ApiResponse } from "@/services/api-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnalyticsUsers = {
  id: string;
  name: string;
  role: string;
  email: string;
  currentMood: string;
  currentStress: string;
  currentPssScore: number;
};

const getMoodStyle = (mood: string) => {
  return {
    backgroundColor: `hsl(var(--mood-${mood}))`,
    color: "white",
    fontWeight: "500",
  };
};

const getStressStyle = (stress: string) => {
  return {
    borderColor: `hsl(var(--stress-${stress}))`,
    backgroundColor: `transparent`,
    color: `hsl(var(--stress-${stress}))`,
    fontWeight: "500",
  };
};

export default function AnalyticsUsersPage() {
  const [users, setUsers] = useState<AnalyticsUsers[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user: currentUser, activeTeamId } = useAuth()!;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get<ApiResponse<AnalyticsUsers[]>>(
          "/analytics/users",
          {
            headers: {
              "x-team-id": activeTeamId,
            },
          },
        );

        setUsers(response.data.responseObject || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [activeTeamId]);

  if (isLoading) return <Loading />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Current Mood</TableHead>
          <TableHead>Current Stress Level</TableHead>
          <TableHead>Current PSS Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isCurrentUser = currentUser?.id === user.id;
          return (
            <TableRow
              key={user.id}
              className={cn(
                isCurrentUser ? "cursor-pointer bg-muted" : "bg-transparent",
                "hover:bg-muted/50",
              )}
              onClick={() =>
                router.push(
                  isCurrentUser
                    ? "/analytics/users/me"
                    : // : `/analytics/users/${user.id}`,
                      "",
                )
              }
            >
              <TableCell className="font-medium">
                {user.name || "-"} {isCurrentUser && "(You)"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "Creator"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge style={getMoodStyle(user.currentMood)}>
                  {user.currentMood}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge style={getStressStyle(user.currentStress)}>
                  {user.currentStress}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{user.currentPssScore}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
