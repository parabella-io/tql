import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Outlet />
  )
}
