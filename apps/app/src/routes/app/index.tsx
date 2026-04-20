import { DashboardPage } from '@/features/dashboard/dashboard.page'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardPage />
  )
}
