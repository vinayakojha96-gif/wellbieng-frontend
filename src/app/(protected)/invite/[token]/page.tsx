'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import apiClient, { ApiResponse } from '@/services/api-client';
import { InviteDetailsResponse } from '../types';

export default function InvitePage() {
    const { token } = useParams() as { token: string };
    const [loading, setLoading] = useState(true);
    const [inviteDetails, setInviteDetails] =
        useState<InviteDetailsResponse | null>(null);
    const router = useRouter();
    const { user, loadUser } = useAuth()!;

    useEffect(() => {
        async function fetchData() {
            try {
                if (!token) return;

                const response = await apiClient.get<
                    ApiResponse<InviteDetailsResponse>
                >(`/invites/${token}`);

                setInviteDetails(response.data.responseObject);
            } catch (error) {
                console.error('Error fetching invite:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [token]);

    async function handleAcceptInvite() {
        try {
            const response = await apiClient.get(`/invites/${token}/accept`);
            if (response.data.success) {
                await loadUser();
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error accepting invite:', error);
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-background'>
                <LoadingSpinner />
            </div>
        );
    }

    if (!inviteDetails) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-background'>
                <div className='p-8 bg-background/10 rounded-lg shadow-md'>
                    <h1 className='mb-4 text-2xl font-bold text-red-600'>
                        Invite Not Found
                    </h1>
                    <p className='mb-4 text-gray-600'>
                        The invite you&apos;re looking for doesn&apos;t exist or
                        has expired.
                    </p>
                    <p className='text-gray-600'>
                        If you believe this is an error, please try logging in
                        with the email address you were invited with.
                    </p>
                    <Link href='/login' className={cn(buttonVariants({}))}>
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const { invitee: inviter, team } = inviteDetails;
    const hasJoinedTeam = user?.teams?.some(t => t.id === team?.id);

    if (hasJoinedTeam) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-background'>
                <div className='p-8 bg-background/10 rounded-lg shadow-md'>
                    <h1 className='mb-4 text-2xl font-bold text-red-600'>
                        Already Joined Team
                    </h1>
                    <p className='mb-4 text-gray-600'>
                        You&apos;re already a member of this team.
                    </p>
                    <Link href='/dashboard' className={cn(buttonVariants({}))}>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-background'>
            <div className='p-8 rounded-lg shadow-md'>
                <h1 className='mb-6 text-3xl font-bold text-center'>
                    Team Invite
                </h1>
                <div className='mb-6 text-center'>
                    <p className='mb-2 text-xl'>
                        <span className='font-semibold'>
                            {inviter?.name} ({inviter?.email})
                        </span>{' '}
                        has invited you to join their team:{' '}
                        <span className='font-semibold text-primary underline'>
                            {team?.name}
                        </span>
                    </p>
                    <Button onClick={handleAcceptInvite}>Accept Invite</Button>
                </div>
            </div>
        </div>
    );
}
