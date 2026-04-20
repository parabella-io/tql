import { AuthProvider } from '@/shared/contexts/auth.contex'

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
