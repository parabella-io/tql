import { AccountPage } from '@/features/account/account.page'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountPage />
}
