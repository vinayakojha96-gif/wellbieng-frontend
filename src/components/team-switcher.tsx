import { ChevronsUpDown, Plus } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { Icons } from './icons';

export interface Team {
  id: string;
  name: string;
  role: 'Creator' | 'Admin' | 'Member';
  // logo: React.ElementType
}

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { setActiveTeam: setActiveTeamId, user, activeTeamId } = useAuth()!;

  const teams = user!.teams;

  const defaultTeam = teams!.find(team => team.id === activeTeamId);
  const [activeTeam, setActiveTeam] = React.useState(defaultTeam!);

  const handleTeamSelect = async (team: Team) => {
    if (team.id === activeTeamId) return;
    setActiveTeam(team);
    setActiveTeamId(team.id);
    window.location.reload();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground'>
                {/* todo)) add dynamic team logo */}
                <Icons.logo className='size-4' />
              </div>
              <div className='grid flex-1 text-sm leading-tight text-left'>
                <span className='font-semibold truncate'>
                  {activeTeam.name}
                </span>
                <span className='text-xs truncate'>{activeTeam.role}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Teams
            </DropdownMenuLabel>
            {teams?.map(team => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className='gap-2 p-2 cursor-pointer'
              >
                <div className='flex items-center justify-center border rounded-sm size-6'>
                  {/* todo)) add dynamic team logo */}
                  <Icons.logo className='size-4 shrink-0' />
                </div>
                <div className='grid flex-1 text-sm leading-tight text-left'>
                  <span className='font-semibold truncate'>{team.name}</span>
                  <span className='text-xs truncate'>{team.role}</span>
                </div>
              </DropdownMenuItem>
            ))}
            {user?.canCreateTeams && (
              <>
                <DropdownMenuSeparator />
                <Link
                  href='/teams/new'
                  className='flex gap-2 font-medium rounded-md text-muted-foreground hover:bg-secondary cursor-pointer'
                >
                  <DropdownMenuItem className='gap-2 p-2'>
                    <div className='flex items-center justify-center border rounded-md size-6'>
                      <Plus className='size-4' />
                    </div>
                    Add team
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
