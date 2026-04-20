import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { FieldGroup } from '@/shared/components/ui/field'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAppForm } from '@/shared/components/form/form.hook'
import { useAuthActions } from '@/shared/contexts/auth.contex'
import { z } from 'zod'

const SignInOTPFormSchema = z.object({
  email: z.email(),
  code: z.string().min(6).max(6),
})

export function SignInOtpPage() {
  const { email } = useSearch({
    from: '/auth/sign-in-otp',
  })

  const { signInWithOTP } = useAuthActions()

  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      email,
      code: '',
    },
    validators: {
      onChange: SignInOTPFormSchema,
    },
    onSubmit: async ({ value }) => {
      await signInWithOTP({
        email: value.email,
        code: value.code,
      })

      setTimeout(() => {
        navigate({
          to: '/app',
        })
      }, 200)
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full w-[500px] max-w-[500px]">
        <CardHeader>
          <CardTitle>Enter your OTP</CardTitle>
          <CardDescription>
            We have sent you a one-time password to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <FieldGroup>
              <form.AppField
                name="code"
                children={(field) => <field.FormOTPField label="OTP" required />}
              />

              <form.AppField
                name="email"
                children={(field) => <field.FormErrorField />}
              />

              <form.FormSubmitButton label="Continue" />
            </FieldGroup>
          </form.AppForm>
        </CardContent>
      </Card>
    </div>
  )
}
