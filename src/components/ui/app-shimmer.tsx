import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarTrigger,
} from "./sidebar";

export function AppShimmer({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar collapsible="icon" variant="floating" {...props}>
        <SidebarHeader>
          <div className="h-12 animate-pulse rounded-lg bg-muted"></div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted"></div>
            </SidebarGroupLabel>
            <SidebarMenu className="animate-pulse space-y-2">
              <div className="h-6 rounded-lg bg-muted"></div>
              <div className="h-6 rounded-lg bg-muted"></div>
              <div className="h-6 rounded-lg bg-muted"></div>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {/* <NavUser /> */}
          <div className="h-12 animate-pulse rounded-lg bg-muted"></div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="ml-2 mr-5">
        <SidebarTrigger className="fixed top-4 z-50 -ml-2" />
        <div className="mt-14 animate-pulse">
          <div className="mb-4 h-8 w-3/4 rounded bg-muted"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-muted"></div>
            <div className="h-4 w-5/6 rounded bg-muted"></div>
            <div className="h-4 w-4/6 rounded bg-muted"></div>
          </div>
          <div className="mt-4 h-[calc(100vh-200px)] w-full rounded bg-muted"></div>
        </div>
      </SidebarInset>
    </>
  );
}
