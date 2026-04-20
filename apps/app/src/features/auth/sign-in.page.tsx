import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { FieldGroup } from '@/shared/components/ui/field'
import { useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/shared/components/form/form.hook'
import z from 'zod'
import { useAuthActions } from '@/shared/contexts/auth.contex'

const SignInFormSchema = z.object({
  email: z.email(),
})

export function SignInPage() {
  const navigate = useNavigate()

  const { sendOTP } = useAuthActions()

  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: SignInFormSchema,
    },
    onSubmit: async ({ value }) => {
      await sendOTP(value.email)

      navigate({
        to: '/auth/sign-in-otp',
        search: { email: value.email },
      })
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full w-[500px] max-w-[500px]">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <FieldGroup>
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormInputField
                    label="Email"
                    placeholder="eg: john@company.com"
                  />
                )}
              />

              <form.FormSubmitButton label="Send OTP" />
            </FieldGroup>
          </form.AppForm>
        </CardContent>
      </Card>
    </div>
  )
}
