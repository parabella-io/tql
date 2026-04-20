import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form.context'
import { FormInputField } from './fields/form.input-field'
import { FormField } from './fields/form.field'
import { FormSubmitButton } from './form.submit-button'
import { FormErrorField } from './fields/form.error-field'
import { FormOTPField } from './fields/form.otp-field'
import { FormSelectField } from './fields/form.select-field'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormField: FormField,
    FormInputField: FormInputField,
    FormErrorField: FormErrorField,
    FormOTPField: FormOTPField,
    FormSelectField: FormSelectField,
  },
  formComponents: {
    FormSubmitButton: FormSubmitButton,
  },
})
