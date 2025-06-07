import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

import apiClient from '@/services/api-client';

export async function GET(request: NextRequest) {
    const url = new URL(request.nextUrl);
    const searchParams = url.searchParams;

    if (!(searchParams.has('code') || searchParams.has('error'))) {
        return redirect('/login');
    }

    const googleAuth = await apiClient.get('/auth/google/callback', {
        params: searchParams,
    });

    if (googleAuth.data.success) {
        const token = googleAuth.data.responseObject?.token;
        if (token) {
            (await cookies()).set('authToken', token.token, {
                expires: new Date(token.expiresAt),
            });

            return redirect('/dashboard');
        }
    }

    if (!googleAuth.data.success)
        return redirect(
            '/auth/google/error?message=' + googleAuth.data.message
        );
}
