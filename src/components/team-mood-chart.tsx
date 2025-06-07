"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import apiClient, { ApiResponse } from "@/services/api-client";
import { format, subMonths } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface MoodChartData {
  date: string;
  happy: number;
  sad: number;
  neutral: number;
  excited: number;
  anxious: number;
}

const moods = ["happy", "sad", "neutral", "excited", "anxious"] as const;

const chartConfig = Object.fromEntries(
  moods.map((mood) => [
    mood,
    { label: mood, color: `hsl(var(--mood-${mood}))` },
  ]),
) as ChartConfig;

export function TeamMoodChart() {
  const [chartData, setChartData] = React.useState<MoodChartData[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const searchParams = useSearchParams();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: searchParams.get("start")
      ? new Date(searchParams.get("start")!)
      : subMonths(new Date(), 1),
    to: searchParams.get("end")
      ? new Date(searchParams.get("end")!)
      : new Date(),
  });
  const { activeTeamId, tags } = useAuth()!;
  const pathname = usePathname();
  const { replace } = useRouter();

  React.useEffect(() => {
    const fetchTeamMoodData = async () => {
      const response = await apiClient.get<ApiResponse<MoodChartData[]>>(
        "/analytics/mood",
        {
          headers: { "x-team-id": activeTeamId },
          params: {
            tags: selectedTags.length > 0 ? selectedTags.join(",") : [],
            startDate: dateRange?.from?.toISOString().split("T")[0],
            endEnd: dateRange?.to?.toISOString().split("T")[0],
          },
        },
      );

      setChartData(response.data.responseObject!);
    };

    fetchTeamMoodData();
  }, [activeTeamId, selectedTags, dateRange, searchParams]);

  // Parse URL params on mount
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const tagsFromUrl = params.get("tags")?.split(",") || [];
    const startDate = params.get("start");
    const endDate = params.get("end");

    setSelectedTags(tagsFromUrl);
    setDateRange(
      startDate && endDate
        ? { from: new Date(startDate), to: new Date(endDate) }
        : { from: subMonths(new Date(), 3), to: new Date() },
    );
  }, []);

  const updateUrlParams = ({
    tags,
    start,
    end,
  }: {
    tags?: string[];
    start?: string | null;
    end?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams);
    if (tags) {
      if (tags.length > 0) {
        params.set("tags", tags.join(","));
      } else {
        params.delete("tags");
      }
    }

    if (start) {
      params.set("start", start);
    } else {
      params.delete("start");
    }

    if (end) {
      params.set("end", end);
    } else {
      params.delete("end");
    }

    replace(`${pathname}?${decodeURIComponent(params.toString())}`);
  };

  const handleTagsChange = (value: string) => {
    const newTags = selectedTags.includes(value)
      ? selectedTags.filter((tag) => tag !== value)
      : [...selectedTags, value];

    setSelectedTags(newTags);
    updateUrlParams({ tags: newTags });
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    updateUrlParams({ tags: newTags });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    updateUrlParams({
      start: range?.from ? range.from.toISOString().split("T")[0] : null,
      end: range?.to ? range.to.toISOString().split("T")[0] : null,
    });
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-base">Mood Trends Over Time</CardTitle>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[250px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from
                ? dateRange.to
                  ? `${format(dateRange.from, "LLL dd, y")} - ${format(
                      dateRange.to,
                      "LLL dd, y",
                    )}`
                  : format(dateRange.from, "LLL dd, y")
                : "Pick a date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <div className="w-[250px]">
          <Select value="" onValueChange={handleTagsChange}>
            <SelectTrigger className="w-full" aria-label="Select tags">
              <SelectValue placeholder="Select Tags" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Tags Display */}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
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
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart accessibilityLayer data={chartData}>
            <defs>
              {moods.map((mood) => (
                <linearGradient
                  id={`fill${mood}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  key={mood}
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[mood].color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[mood].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={50}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("default", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("default", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            {moods.map((mood) => (
              <Area
                key={mood}
                dataKey={mood}
                type="basis"
                fill={`url(#fill${mood})`}
                stroke={chartConfig[mood].color}
                stackId="a"
              />
            ))}
            <ChartLegend
              content={<ChartLegendContent className="capitalize" />}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// 'use client';

// import { format, subDays, subMonths } from 'date-fns';
// import { CalendarIcon } from 'lucide-react';
// import * as React from 'react';
// import { DateRange } from 'react-day-picker';
// import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart';
// import { useAuth } from '@/context/auth-context';
// import { cn } from '@/lib/utils';
// import apiClient, { ApiResponse } from '@/services/api-client';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Icons } from './icons';
// import { Button } from './ui/button';
// import { Calendar } from './ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

// interface MoodChartData {
//   date: string;
//   happy: number;
//   sad: number;
//   neutral: number;
//   excited: number;
//   anxious: number;
// }

// const moods = ['happy', 'sad', 'neutral', 'excited', 'anxious'] as const;

// const chartConfig = Object.fromEntries(
//   moods.map(mood => [mood, { label: mood, color: `hsl(var(--mood-${mood}))` }])
// ) as ChartConfig;

// export function TeamMoodChart() {
//   const { activeTeamId, tags } = useAuth()!;
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [chartData, setChartData] = React.useState<MoodChartData[]>([]);
//   const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
//   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
//     from: subMonths(new Date(), 3),
//     to: new Date(),
//   });

//   const presets = [
//     {
//       label: 'Last 7 days',
//       getValue: () => ({
//         from: subDays(new Date(), 7),
//         to: new Date(),
//       }),
//     },
//     {
//       label: 'Last 30 days',
//       getValue: () => ({
//         from: subDays(new Date(), 30),
//         to: new Date(),
//       }),
//     },
//     {
//       label: 'Last 3 months',
//       getValue: () => ({
//         from: subMonths(new Date(), 3),
//         to: new Date(),
//       }),
//     },
//   ];

//   const isDateInFuture = (date: Date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date > today;
//   };

//   React.useEffect(() => {
//     const fetchTeamMoodData = async () => {
//       const response = await apiClient.get<ApiResponse<MoodChartData[]>>(
//         '/analytics/mood',
//         {
//           headers: { 'x-team-id': activeTeamId },
//           params: {
//             tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
//             start: dateRange?.from
//               ? dateRange.from.toISOString().split('T')[0]
//               : undefined,
//             end: dateRange?.to
//               ? dateRange.to.toISOString().split('T')[0]
//               : undefined,
//           },
//         }
//       );

//       setChartData(response.data.responseObject!);
//     };

//     fetchTeamMoodData();
//   }, [activeTeamId, selectedTags, dateRange]);

//   const handleTagsChange = (value: string) => {
//     const newTags = selectedTags.includes(value)
//       ? selectedTags.filter(tag => tag !== value)
//       : [...selectedTags, value];

//     setSelectedTags(newTags);
//     updateUrlParams({ tags: newTags });
//   };

//   const handleDateRangeChange = (range: DateRange | undefined) => {
//     setDateRange(range);
//     updateUrlParams({
//       start: range?.from ? range.from.toISOString().split('T')[0] : null,
//       end: range?.to ? range.to.toISOString().split('T')[0] : null,
//     });
//   };

//   const updateUrlParams = ({
//     tags,
//     start,
//     end,
//   }: {
//     tags?: string[];
//     start?: string | null;
//     end?: string | null;
//   }) => {
//     const params = new URLSearchParams(searchParams);

//     if (tags) {
//       tags.length > 0
//         ? params.set('tags', tags.join(','))
//         : params.delete('tags');
//     }
//     start ? params.set('start', start) : params.delete('start');
//     end ? params.set('end', end) : params.delete('end');

//     router.push(`?${decodeURIComponent(params.toString())}`);
//   };

//   return (
//     <Card>
//       <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
//         <div className='grid flex-1 gap-1 text-center sm:text-left'>
//           <CardTitle className='text-base'>Mood Trends Over Time</CardTitle>
//         </div>

//         {/* Date Picker */}
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant='outline'
//               className={cn(
//                 'w-[250px] justify-start text-left font-normal',
//                 !dateRange && 'text-muted-foreground'
//               )}
//             >
//               <CalendarIcon className='mr-2 h-4 w-4' />
//               {dateRange?.from ? (
//                 dateRange.to ? (
//                   <>
//                     {format(dateRange.from, 'LLL dd, y')} -{' '}
//                     {format(dateRange.to, 'LLL dd, y')}
//                   </>
//                 ) : (
//                   format(dateRange.from, 'LLL dd, y')
//                 )
//               ) : (
//                 <span>Pick a date range</span>
//               )}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className='w-auto p-0'>
//             <Calendar
//               initialFocus
//               mode='range'
//               defaultMonth={dateRange?.from}
//               selected={dateRange}
//               onSelect={handleDateRangeChange}
//               numberOfMonths={2}
//             />
//             <div className='flex flex-col p-2 gap-2'>
//               {presets.map(preset => (
//                 <Button
//                   key={preset.label}
//                   variant='outline'
//                   size='sm'
//                   onClick={() => handleDateRangeChange(preset.getValue())}
//                   className='flex-1'
//                 >
//                   {preset.label}
//                 </Button>
//               ))}
//               <Button
//                 variant='outline'
//                 onClick={() => handleDateRangeChange(undefined)}
//               >
//                 Clear
//               </Button>
//             </div>
//           </PopoverContent>
//         </Popover>

//         {/* Multi-Select for Tags */}
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant='outline'
//               className='w-[250px] justify-start text-left'
//             >
//               {selectedTags.length > 0 ? (
//                 <div className='flex flex-wrap gap-1'>
//                   {selectedTags.map(tag => (
//                     <span
//                       key={tag}
//                       className='flex items-center bg-gray-200 px-2 py-1 rounded'
//                     >
//                       {tag}
//                       <Icons.x
//                         className='ml-1 h-3 w-3 cursor-pointer'
//                         onClick={e => {
//                           e.stopPropagation();
//                           handleTagsChange(tag);
//                         }}
//                       />
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <span>Select Tags</span>
//               )}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className='w-56 p-2'>
//             <div className='flex flex-col gap-2'>
//               {tags.map(tag => (
//                 <Button
//                   key={tag}
//                   variant={selectedTags.includes(tag) ? 'secondary' : 'outline'}
//                   className='justify-start'
//                   onClick={() => handleTagsChange(tag)}
//                 >
//                   {tag}
//                 </Button>
//               ))}
//             </div>
//           </PopoverContent>
//         </Popover>
//       </CardHeader>

//       <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
//         <ChartContainer
//           config={chartConfig}
//           className='aspect-auto h-[250px] w-full'
//         >
//           <AreaChart accessibilityLayer data={chartData}>
//             <defs>
//               {moods.map(mood => (
//                 <linearGradient
//                   id={`fill${mood}`}
//                   x1='0'
//                   y1='0'
//                   x2='0'
//                   y2='1'
//                   key={mood}
//                 >
//                   <stop
//                     offset='5%'
//                     stopColor={chartConfig[mood].color}
//                     stopOpacity={0.8}
//                   />
//                   <stop
//                     offset='95%'
//                     stopColor={chartConfig[mood].color}
//                     stopOpacity={0.1}
//                   />
//                 </linearGradient>
//               ))}
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey='date'
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={50}
//               tickFormatter={value => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString('default', {
//                   month: 'short',
//                   day: 'numeric',
//                 });
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={value => {
//                     return new Date(value).toLocaleDateString('default', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                     });
//                   }}
//                   indicator='dot'
//                 />
//               }
//             />

//             {moods.map(mood => (
//               <Area
//                 key={mood}
//                 dataKey={mood}
//                 type='basis'
//                 fill={`url(#fill${mood})`}
//                 stroke={chartConfig[mood].color}
//                 stackId='a'
//               />
//             ))}
//             <ChartLegend
//               content={<ChartLegendContent className='capitalize' />}
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
