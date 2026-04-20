import { WorkspaceMembersPage } from '@/features/workspace/members.page'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$workspaceId/members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WorkspaceMembersPage />
}
