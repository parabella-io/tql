import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { WorkspacesMenu } from "@/shared/components/menu/workspaces-menu"
import { UserMenu } from "@/shared/components/menu/user-menu"
import { BookMarkedIcon, SettingsIcon, UsersIcon } from "lucide-react"
import { Link, useMatchRoute } from "@tanstack/react-router"
import { WorkspaceEntity } from "@tql/api"

type WorkspaceNavbarProps = {
  workspaces: WorkspaceEntity[];
  selectedWorkspaceId: string;
}

export function WorkspaceNavbar({ workspaces, selectedWorkspaceId }: WorkspaceNavbarProps) {

  const matchRoute = useMatchRoute();

  const isBoardActive = matchRoute({ to: '/app/$workspaceId', fuzzy: false });

  const isMembersActive = matchRoute({ to: '/app/$workspaceId/members', fuzzy: false });

  const isSettingsActive = matchRoute({ to: '/app/$workspaceId/settings', fuzzy: false });


  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspacesMenu
          workspaces={workspaces}
          selectedWorkspaceId={selectedWorkspaceId}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className={isBoardActive ? "bg-muted font-medium" : ""}>
                <Link to="/app/$workspaceId">
                  <SidebarMenuButton>
                    <BookMarkedIcon />
                    Board
                  </SidebarMenuButton></Link>
              </SidebarMenuItem>

              <SidebarMenuItem className={isMembersActive ? "bg-muted font-medium" : ""}>
                <Link to="/app/$workspaceId/members" >
                  <SidebarMenuButton>
                    <UsersIcon />
                    Members
                  </SidebarMenuButton></Link>
              </SidebarMenuItem>

              <SidebarMenuItem className={isSettingsActive ? "bg-muted font-medium" : ""}>
                <Link to="/app/$workspaceId/settings" >
                  <SidebarMenuButton>
                    <SettingsIcon />
                    Settings
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}