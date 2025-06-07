"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth-context";
import apiClient, { ApiResponse } from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createTeamFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 2 characters.",
  }),
});

interface TeamCreateResponse {
  id: string;
  name: string;
}

export default function CreateTeamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { activeTeamId, setActiveTeam, loadUser } = useAuth()!;

  const form = useForm<z.infer<typeof createTeamFormSchema>>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleCreateTeam(data: z.infer<typeof createTeamFormSchema>) {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await apiClient.post<ApiResponse<TeamCreateResponse>>(
        "/teams",
        data,
        {
          headers: {
            "x-team-id": activeTeamId,
          },
        },
      );

      if (!response.data.success) {
        setServerError(response.data.message);
        return;
      }

      if (response.data.responseObject) {
        await loadUser();
        setActiveTeam(response.data.responseObject.id);
        form.reset();
        router.push("/dashboard");
      }
    } catch (error) {
      const e = error as AxiosError<ApiResponse<null>>;
      const errorMessage = e.response?.data?.message || "Failed to create team";
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-1 sm:w-[480px] lg:p-8">
        <div className="mb-6 flex flex-col space-y-1 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a new team
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateTeam)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                Create Team
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
