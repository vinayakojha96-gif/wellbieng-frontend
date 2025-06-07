'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { useAuth } from '@/context/auth-context';
import apiClient, { ApiResponse } from '@/services/api-client';
import { useEffect, useState } from 'react';

interface StressChartData {
    month: string;
    low: number;
    medium: number;
    high: number;
    extreme: number;
}

const stresses = ['low', 'medium', 'high', 'extreme'] as const;

const chartConfig = Object.fromEntries(
    stresses.map(stress => [
        stress,
        { color: `hsl(var(--stress-${stress}))`, label: stress },
    ])
) as ChartConfig;

export function TeamStressChart() {
    const [stressData, setStressData] = useState<StressChartData[]>([]);
    const { activeTeamId } = useAuth()!;

    useEffect(() => {
        const fetchStressData = async () => {
            const response = await apiClient.get<
                ApiResponse<StressChartData[]>
            >('/analytics/stress', {
                headers: {
                    'x-team-id': activeTeamId,
                },
            });

            setStressData(response.data.responseObject!);
        };
        fetchStressData();
    }, []);

    return (
        <Card>
            <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
                <CardTitle className='text-base'>
                    Team Stress Over Time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className='aspect-auto h-[250px] w-full'
                >
                    <AreaChart accessibilityLayer data={stressData}>
                        <defs>
                            {stresses.map(stress => (
                                <linearGradient
                                    id={`fill${stress}`}
                                    x1='0'
                                    y1='0'
                                    x2='0'
                                    y2='1'
                                    key={stress}
                                >
                                    <stop
                                        offset='5%'
                                        stopColor={chartConfig[stress].color}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset='95%'
                                        stopColor={chartConfig[stress].color}
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={50}
                            tickFormatter={value => {
                                const date = new Date(value);
                                return date.toLocaleDateString('default', {
                                    month: 'short',
                                    year: '2-digit',
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator='dot'
                                    labelFormatter={value => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString('default', {
                                            month: 'short',
                                            year: 'numeric',
                                        });
                                    }}
                                />
                            }
                        />

                        {stresses.map(stress => (
                            <Area
                                key={stress}
                                dataKey={stress}
                                type='basis'
                                fill={`url(#fill${stress})`}
                                stroke={chartConfig[stress].color}
                                stackId='a'
                            />
                        ))}
                        <ChartLegend
                            content={
                                <ChartLegendContent className='capitalize' />
                            }
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
