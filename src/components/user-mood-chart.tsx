'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useAuth } from '@/context/auth-context';
import apiClient, { ApiResponse } from '@/services/api-client';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { CustomTooltipContent } from './user-stress-chart';

interface MoodChartProps {
    id: string;
}

export type MoodData = {
    date: string;
    value: MoodEnum;
};

enum MoodEnum {
    HAPPY = 'happy',
    SAD = 'sad',
    NEUTRAL = 'neutral',
    EXCITED = 'excited',
    ANXIOUS = 'anxious',
}

const getMoodScore = (mood: MoodEnum): number => {
    const moodScores: Record<MoodEnum, number> = {
        [MoodEnum.HAPPY]: 5,
        [MoodEnum.EXCITED]: 4,
        [MoodEnum.NEUTRAL]: 3,
        [MoodEnum.ANXIOUS]: 2,
        [MoodEnum.SAD]: 1,
    };
    return moodScores[mood];
};

export function UserMoodChart({ id }: MoodChartProps) {
    const [moodData, setMoodData] = useState<MoodData[]>([]);
    const { activeTeamId } = useAuth()!;

    useEffect(() => {
        const fetchMoodData = async () => {
            try {
                const response = await apiClient.get<ApiResponse<MoodData[]>>(
                    `/analytics/mood/${id}`,
                    {
                        headers: {
                            'x-team-id': activeTeamId,
                        },
                    }
                );
                setMoodData(response.data.responseObject!);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMoodData();
    }, [id, activeTeamId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mood Tracker</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        mood: {
                            label: 'Mood Score',
                            color: 'hsl(var(--chart-2))',
                        },
                    }}
                    className='aspect-auto h-[250px] w-full'
                >
                    <LineChart
                        data={moodData.map(mood => ({
                            date: mood.date,
                            score: getMoodScore(mood.value),
                            mood: mood.value,
                        }))}
                        margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray='3 3' vertical={false} />
                        <XAxis
                            dataKey='date'
                            tickFormatter={value =>
                                new Date(value).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                            }
                            tickLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            domain={[0, 6]}
                            ticks={[1, 2, 3, 4, 5]}
                            tickFormatter={value => {
                                const moods = [
                                    '',
                                    'Sad',
                                    'Anxious',
                                    'Neutral',
                                    'Excited',
                                    'Happy',
                                ];
                                return moods[value];
                            }}
                        />
                        <ChartTooltip content={<CustomTooltipContent />} />
                        <Line
                            type='monotone'
                            dataKey='score'
                            stroke='var(--color-mood)'
                            strokeWidth={2}
                            dot={{ fill: 'var(--color-mood)' }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
