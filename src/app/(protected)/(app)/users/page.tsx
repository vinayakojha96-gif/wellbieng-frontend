"use client";

import { getAppIcon, Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/ui/header";
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
import { formatDistance } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser, activeTeamId } = useAuth()!;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get<ApiResponse<User[]>>("/users", {
          headers: {
            "x-team-id": activeTeamId,
          },
        });

        console.log(response);
        setUsers(response.data.responseObject || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.role === "Member") return;
    fetchUsers();
  }, []);

  if (loading) return <Loading />;

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiClient.delete(`/users/${userId}`, {
        headers: {
          "x-team-id": activeTeamId,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="mr-5 space-y-4">
      <Header
        title="Users"
        description="Manage your users and their roles here"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Role</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  "cursor-default",
                  currentUser?.id === user.id && "text-muted-foreground",
                )}
              >
                <TableCell className="font-medium">
                  {currentUser?.id === user.id ? "(You)" : ""}{" "}
                  {user.name || "-"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {formatDistance(new Date(user.memberSince), new Date())}
                </TableCell>
                {/* <TableCell>{format}</TableCell> */}

                <TableCell className="truncate">
                  <div className="flex size-7 items-center justify-center rounded-lg">
                    {getAppIcon(user.source)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === "Admin" ? (
                      <Icons.shield className="h-4 w-4" />
                    ) : user.role === "Member" ? (
                      <Icons.user className="h-4 w-4" />
                    ) : (
                      <Icons.shieldEllipsis className="h-4 w-4" />
                    )}
                    {user.role}
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icons.ellipsis className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/users/${user.id}`}>
                          <Icons.userRoundPen className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {currentUser?.id !== user.id && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            handleDeleteUser(user.id);
                          }}
                        >
                          <Icons.trash className="mr-2 h-4 w-4 text-destructive" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export type User = {
  id: string;
  name: string | null;
  email: string;
  source: string;
  role: "Creator" | "Admin" | "Member";
  memberSince: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};
