"use client";

import { formatDistance } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { UserMoodChart } from "@/components/user-mood-chart";
import { UserStressChart } from "@/components/user-stress-chart";
import { useAuth, User } from "@/context/auth-context";
import apiClient, { ApiResponse } from "@/services/api-client";

type UseDetails = User & {
  memberSince: string;
};

export default function AnalyticsUserPage() {
  const params = useParams();
  const { user: authUser, activeTeamId } = useAuth()!;
  let { id } = params;
  if (id === "me") id = authUser!.id;
  const [user, setUser] = useState<UseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [stressData, setStressData] = useState<StressData[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<ApiResponse<UseDetails>>(
          `/users/${id}`,
          {
            headers: {
              "x-team-id": activeTeamId,
            },
          },
        );

        setUser(response.data.responseObject);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    // const fetchStressData = async () => {
    //     try {
    //         const response = await apiClient.get<ApiResponse<StressData[]>>(
    //             `/analytics/stress/${id}`,
    //             {
    //                 headers: {
    //                     'x-team-id': activeTeamId,
    //                 },
    //             }
    //         );

    //         setStressData(response.data.responseObject!);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // fetchStressData();

    fetchUser();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    user && (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {authUser?.id === id ? "Your " : "User "}Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.avatar ?? ""}
                alt={user.name ?? user.email}
              />
              <AvatarFallback className="text-lg">
                {(user.name ?? user.email).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-medium">{user.name ?? "-"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since{" "}
                {formatDistance(new Date(user.memberSince), new Date())}
              </p>
            </div>
          </CardContent>
        </Card>

        <UserStressChart id={id as string} />
        <UserMoodChart id={id as string} />
      </div>
    )
  );
}
