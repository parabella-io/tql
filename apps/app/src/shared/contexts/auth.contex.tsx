import { authClient } from '@/shared/lib/auth'
import { Navigate } from '@tanstack/react-router'
import { createContext, useContext } from 'react'
import { tql } from '../lib/tql'

export type AuthUser = {
  id: string
  name: string
  email: string
  organisationIds: string[]
}

export type AuthContext = {
  user: AuthUser
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContext>({
  user: undefined!,
  refreshSession: async () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = authClient.useSession()

  if (isPending) return null

  if (!data || !data.user) {
    return <Navigate to="/auth/sign-in" />
  }

  const refreshSession = async () => {
    const response = await authClient.refreshToken({
      providerId: 'email',
      userId: data.user.id,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }
  }

  const user = data.user as unknown as AuthUser

  return (
    <AuthContext.Provider value={{ user, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)

export const useAuthActions = () => {
  const sendOTP = async (email: string) => {
    const response = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'sign-in',
    })

    if (response.error) {
      throw new Error(response.error.message)
    }
  }

  const signInWithOTP = async (options: {
    email: string
    code: string
  }): Promise<AuthUser> => {
    const response = await authClient.signIn.emailOtp({
      email: options.email,
      otp: options.code,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return response.data.user as unknown as AuthUser;
  }

  const signOut = async () => {
    await authClient.signOut();
    tql.reset()
  }

  const updateUser = async (name: string) => {
    await authClient.updateUser({
      name,
    })

  }

  return { sendOTP, signInWithOTP, signOut, updateUser }
}
