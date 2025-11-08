"use client";

import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/context/auth-context";
import { SlackMember, SlackTeamMembersResponse } from "@/lib/types";
import apiClient, { ApiResponse } from "@/services/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAppIcon, Icons } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Loading from "./ui/loading";

export interface App {
  id?: string;
  name: string;
  description: string;
  logo?: string;
  connected?: boolean;
  redirectUrl?: string;
  import?: string;
  icon?: string;
  connectUrl?: string;
}

export function AppsCard({ app }: { app: App }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<SlackMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState({
    id: "",
    status: false,
  });

  const { activeTeamId, user: currentUser } = useAuth()!;
  const router = useRouter();

  async function handleImportClick() {
    setLoading(true);
    setDialogOpen(true);
    try {
      const { data } = await apiClient.get<
        ApiResponse<SlackTeamMembersResponse>
      >(`/apps/${app.name.toLowerCase()}/members`, {
        headers: {
          "x-team-id": activeTeamId,
        },
      });

      if (!data.success) {
        if (data.statusCode === 429) {
          toast.error(
            "Rate limit exceeded on Slack API. Please try again later.",
          );
        }
      }

      setUsers(data.responseObject?.members || []);
    } catch {
      toast.error("Failed to import users");
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(slackUser: SlackMember) {
    setInviting({
      id: slackUser.id,
      status: true,
    });
    try {
      const response = await apiClient.post(
        "/invites",
        {
          source: app.name,
          externalId: slackUser.id,
          email: slackUser.email,
        },
        {
          headers: {
            "x-team-id": activeTeamId,
          },
        },
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === slackUser.id ? { ...user, status: "invited" } : user,
          ),
        );
      }
    } catch {
      toast.error("Error inviting user");
    } finally {
      setInviting({
        id: "",
        status: false,
      });
    }
  }

  async function handleConnectClick() {
    const sanitizedUrl = app.redirectUrl
      ? app.redirectUrl.includes("/api")
        ? app.redirectUrl.replace("/api", "")
        : app.redirectUrl
      : "";

    const response = await apiClient.get<string>(sanitizedUrl, {
      headers: {
        "x-team-id": activeTeamId,
      },
    });

    if (typeof response.data === "string") router.replace(response.data);
  }

  return (
    <Card className="hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2">
          {getAppIcon(app.name)}
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`${
                  app.connected
                    ? "border border-red-400 bg-red-100 hover:bg-red-200 dark:border-red-700 dark:bg-red-950 dark:hover:bg-red-900"
                    : "border border-blue-400 bg-blue-100 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900"
                }`}
                onClick={() => (app.connected ? null : handleConnectClick())}
              >
                {app.connected ? <Icons.linkOff /> : <Icons.link />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {app.connected
                ? "Disconnect from " + app.name
                : "Connect to " + app.name}
            </TooltipContent>
          </Tooltip>

          {app.connected && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={!app.import}
                  variant="secondary"
                  size="sm"
                  onClick={handleImportClick}
                  className="border border-blue-400 bg-blue-100 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900"
                >
                  <Icons.import />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!app.import
                  ? `Import not available for ${app.name}`
                  : `Import users from ${app.name}`}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{app.name}</CardTitle>
        <p className="line-clamp-2 text-gray-500">{app.description}</p>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Users from {app.name}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <Loading className="h-40" />
          ) : users.length > 0 ? (
            <div className="max-h-96 overflow-x-auto overflow-y-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16" />
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-32 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-16">
                        {user.avatar && (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                        )}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      {currentUser?.email === user.email ? (
                        <TableCell className="w-32 text-center">You</TableCell>
                      ) : (
                        <TableCell className="w-32 text-center">
                          {inviting.id === user.id ? (
                            <p>Inviting...</p>
                          ) : user.status === "invited" ? (
                            <p>Invited</p>
                          ) : user.status === "onboarded" ? (
                            <p>Onboarded</p>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleInvite(user)}
                            >
                              Invite
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Failed to fetch slack members or no users found</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
