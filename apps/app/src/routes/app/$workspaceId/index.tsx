import { WorkspaceBoardPage } from '@/features/workspace/board.page'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$workspaceId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WorkspaceBoardPage />
}
