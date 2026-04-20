import { SignInPage } from '@/features/auth/sign-in.page'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInPage />
}
