import { createAuthClient } from 'better-auth/react'

import { emailOTPClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3001',
  plugins: [emailOTPClient()],
})

export const getAuthToken = async (): Promise<string | null> => {
  const { data, error } = await authClient.getSession()

  if (error || !data) return null

  return data.session.token
}
