"use client";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import apiClient, { ApiResponse } from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistance } from "date-fns";
import { useParams } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface User {
  id: string;
  name: string | null;
  email: string;
  source: string;
  memberSince: string;
  role: "Creator" | "Admin" | "Member";
  avatar: string | null;
  tags: string[];
}

const updateUserFromSchema = z.object({
  role: z.enum(["Creator", "Admin", "Member"]),
  tags: z.array(z.string()),
});

export default function UserEditPage() {
  const { userId } = useParams() as { userId: string };
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { activeTeamId } = useAuth()!;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<ApiResponse<User>>(
          `/users/${userId}`,
          {
            headers: {
              "x-team-id": activeTeamId,
            },
          },
        );

        if (!response.data.success) {
          setError(response.data.message);
          return;
        }

        setUser(response.data.responseObject);
      } catch {
        toast.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, activeTeamId]);

  if (loading) return <Loading />;

  return (
    <div className="mt-8">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>View and edit user information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* {user ? <UserCard user={user} /> : <p>Loading user data...</p>} */}
          {user && <UserCard user={user} />}
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

// Convert userCard from a function to a proper React component
function UserCard({ user }: { user: User }) {
  const [tags, setTags] = useState<string[]>(user.tags);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { activeTeamId } = useAuth()!;

  const form = useForm<z.infer<typeof updateUserFromSchema>>({
    resolver: zodResolver(updateUserFromSchema),
    defaultValues: {
      role: user.role,
      tags: user.tags,
    },
  });

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  async function handleSubmit({}: z.infer<typeof updateUserFromSchema>) {
    setIsSubmitting(true);

    try {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${user.id}`,
        {
          role: form.getValues("role"),
          tags: tags,
        },
        {
          headers: {
            "x-team-id": activeTeamId,
          },
        },
      );

      if (response.data.success) {
        toast.success("User updated successfully");
      } else {
        toast.error("Failed to update user");
      }
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.avatar || undefined}
                alt={user.name || "User"}
              />
              <AvatarFallback className="text-lg">
                {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-medium">{user.name || "-"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Member since{" "}
                {formatDistance(new Date(user.memberSince), new Date())}
              </p>
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel className="text-right">Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={user.role === "Creator"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {user.role === "Creator" && (
                          <SelectItem value="Creator">Creator</SelectItem>
                        )}
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem className="col-span-4">
                  <FormLabel className="text-right">Tags</FormLabel>
                  <FormControl>
                    <div className="col-span-3 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {tags.length > 0 ? (
                          tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-2 py-1 text-sm"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1.5 text-muted-foreground hover:text-foreground"
                                aria-label={`Remove ${tag} tag`}
                              >
                                <Icons.x className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No tags added
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="new-tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Add a tag..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddTag}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter to add a tag
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
