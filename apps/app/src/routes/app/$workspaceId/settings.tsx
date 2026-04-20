import { WorkspaceSettingsPage } from '@/features/workspace/settings.page'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$workspaceId/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WorkspaceSettingsPage />
}
