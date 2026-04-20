import {
  InputOTPSeparator,
  InputOTPSlot,
  InputOTP,
  InputOTPGroup,
} from '../../ui/input-otp'
import { useFieldContext } from '../form.context'
import { FormField } from './form.field'

type FormOTPFieldProps = {
  label?: string
  description?: string
  required?: boolean
}

export const FormOTPField = ({
  label,
  description,
  required,
}: FormOTPFieldProps) => {
  const field = useFieldContext()

  return (
    <FormField label={label} description={description}>
      <InputOTP
        maxLength={6}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        required={required}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </FormField>
  )
}
