'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { AppShimmer } from './ui/app-shimmer';
import { SidebarProvider } from './ui/sidebar';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth()!;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?next=' + pathname);
        return;
      }

      if (pathname.includes('/teams/new')) {
        if (user.canCreateTeams) return;
        router.push('/dashboard');
      }

      if (
        !pathname.startsWith('/invite') &&
        (!user?.teams || user?.teams.length === 0)
      ) {
        router.push('/teams/new');
      }

      if (user.role === 'Member') {
        if (
          pathname.split('/')[1] !== 'analytics' ||
          pathname !== '/dashboard'
        ) {
          router.push('/dashboard');
        }

        // if (pathname.split('/')[1] === 'apps') {
        //   router.push('/dashboard');
        // }
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <SidebarProvider>
          <AppShimmer />
        </SidebarProvider>
      </div>
    );

  if (pathname.startsWith('/invite')) return children;

  if (!user.teams || user.teams.length === 0) {
    if (pathname === '/teams/new') {
      return children;
    }
    return null;
  }

  return children;
}
