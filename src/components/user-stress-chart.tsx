'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useAuth } from '@/context/auth-context';
import apiClient, { ApiResponse } from '@/services/api-client';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface StressChartProps {
    id: string;
}

export type StressData = {
    level: string;
    month: string;
    score: number;
};

export function UserStressChart({ id }: StressChartProps) {
    const [stressData, setStressData] = useState<StressData[]>([]);
    const { activeTeamId } = useAuth()!;

    useEffect(() => {
        const fetchStressData = async () => {
            try {
                const response = await apiClient.get<ApiResponse<StressData[]>>(
                    `/analytics/stress/${id}`,
                    {
                        headers: {
                            'x-team-id': activeTeamId,
                        },
                    }
                );

                setStressData(response.data.responseObject!);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStressData();
    }, [id]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stress Levels</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        stress: {
                            label: 'Stress Score',
                            color: 'hsl(var(--chart-1))',
                        },
                    }}
                    className='aspect-auto h-[250px] w-full'
                >
                    <AreaChart
                        data={stressData}
                        margin={{ top: 0, right: 0, left: -37, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id='stressGradient'
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'
                            >
                                <stop
                                    offset='5%'
                                    stopColor='var(--color-stress)'
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='var(--color-stress)'
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray='3 3' vertical={false} />
                        <XAxis
                            dataKey='month'
                            tickFormatter={v => {
                                return new Date(v).toLocaleDateString(
                                    'default',
                                    {
                                        month: 'short',
                                        year: 'numeric',
                                    }
                                );
                            }}
                            tickLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            domain={[0, 30]}
                            tickCount={6}
                        />
                        <ChartTooltip content={<CustomTooltipContent />} />
                        <Area
                            type='monotone'
                            dataKey='score'
                            stroke='var(--color-stress)'
                            fill='url(#stressGradient)'
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomTooltipContent({ active, payload }: any) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const data = payload[0].payload;

    return (
        <div className='rounded-lg border bg-background p-2 shadow-sm '>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className='flex items-center gap-2 text-sm'>
                    <span>
                        {key}: {value as unknown as string}
                    </span>
                </div>
            ))}
        </div>
    );
}
