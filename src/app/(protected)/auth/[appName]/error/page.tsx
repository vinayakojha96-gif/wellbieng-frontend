'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppsErrorPage() {
    const router = useRouter();
    const appName = useParams().appName;
    const searchParams = useSearchParams();
    if (!searchParams.get('message')) return router.push('/login');
    return (
        <div className='min-h-screen flex items-center justify-center bg-background/10'>
            <div className='bg-background p-8 rounded-lg shadow-md max-w-md w-full text-center'>
                <h1 className='text-2xl font-bold mb-4 text-destructive'>
                    {appName?.toString().toUpperCase()} Auth Unsuccessful
                </h1>
                <p className='mb-4 text-gray-600'>
                    {searchParams.get('message')}
                </p>
                <Link
                    href='/dashboard'
                    className={cn(buttonVariants({ variant: 'default' }))}
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
