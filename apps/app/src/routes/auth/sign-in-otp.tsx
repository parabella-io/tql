import { SignInOtpPage } from '@/features/auth/sign-in-otp.page'

import { createFileRoute } from '@tanstack/react-router'

import z from 'zod'

export const Route = createFileRoute('/auth/sign-in-otp')({
  component: RouteComponent,
  validateSearch: z.object({
    email: z.email(),
  }),
})

function RouteComponent() {
  return <SignInOtpPage />
}
