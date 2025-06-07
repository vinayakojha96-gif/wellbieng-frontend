import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import apiClient from '@/services/api-client';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ appName: string }>;
    }
) {
    const appName = (await params).appName;
    const url = new URL(request.nextUrl);
    const searchParams = url.searchParams;

    if (!(searchParams.has('code') || searchParams.has('error'))) {
        return redirect('/login');
    }
    const teamId = (await cookies()).get('activeTeamId')?.value;

    const appAuth = await apiClient.get('/apps/' + appName + '/callback', {
        params: searchParams,
        headers: {
            'x-team-id': teamId,
        },
    });

    if (appAuth.data.success) {
        return redirect('/apps');
    }

    if (!appAuth.data.success) {
        return redirect(
            '/auth/' + appName + '/error?message=' + appAuth.data.message
        );
    }
}
