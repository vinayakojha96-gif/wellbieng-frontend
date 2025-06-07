"use client";

import { useAuth } from "@/context/auth-context";
import apiClient, { ApiResponse } from "@/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";
import TimezoneSelect, { type ITimezone } from "react-timezone-select";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useState } from "react";
export interface CronData {
  id: string;
  type: "mood" | "stress" | "motivational";
  cron: string;
  active: boolean;
  lastRun: string | null;
  nextRun: string;
  timezone: string;
}

const cronEditSchema = z.object({
  cron: z.string(),
  active: z.boolean(),
  timezone: z.custom<ITimezone>(),
});

export function CronCard({ cron }: { cron: CronData }) {
  const { activeTeamId } = useAuth()!;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof cronEditSchema>>({
    resolver: zodResolver(cronEditSchema),
    defaultValues: {
      cron: cron.cron,
      active: cron.active,
      timezone: cron.timezone,
    },
  });

  async function onSubmit(data: z.infer<typeof cronEditSchema>) {
    setIsSubmitting(true);
    try {
      const timezone =
        typeof data.timezone === "string" ? data.timezone : data.timezone.value;

      const response = await apiClient.put<ApiResponse<CronData>>(
        `/crons/${cron.id}`,
        {
          ...data,
          timezone,
        },
        {
          headers: {
            "x-team-id": activeTeamId,
          },
        },
      );
      toast(response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="active"
            render={() => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg pb-4">
                <FormLabel className="text-base font-semibold uppercase">
                  {cron.type}
                </FormLabel>
                {/* <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl> */}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cron"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg">
                <FormControl>
                  <Cron value={field.value} setValue={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg pb-6 pt-4">
                <FormControl>
                  <TimezoneSelect
                    value={field.value}
                    onChange={field.onChange}
                    labelStyle="abbrev"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={isSubmitting}>
            Save
          </Button>
        </form>
      </Form>
    </Card>
  );
}
