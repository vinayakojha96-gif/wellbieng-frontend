"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { NavGroup as NavGroupType } from "./types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";

const generalNavData = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.dashboard,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: Icons.analytics,
      },
    ],
  },
] satisfies NavGroupType[];

const adminNavData = [
  {
    title: "Admin",
    items: [
      {
        title: "Apps",
        url: "/apps",
        icon: Icons.apps,
      },
      {
        title: "Users",
        url: "/users",
        icon: Icons.users,
      },
      {
        title: "Schedules",
        url: "/schedules",
        icon: Icons.schedule,
      },
    ],
  },
] satisfies NavGroupType[];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navData, setNavData] = useState<NavGroupType[]>(generalNavData);
  const { user, activeTeamId } = useAuth()!;

  useEffect(() => {
    if (user?.role !== "Member") {
      setNavData([...generalNavData, ...adminNavData]);
    } else {
      setNavData(generalNavData);
    }
  }, [activeTeamId]);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navData && navData.map((d) => <NavGroup key={d.title} {...d} />)}
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center justify-between">
        <ThemeSwitcher />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
