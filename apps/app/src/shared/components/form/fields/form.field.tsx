import { Field, FieldDescription, FieldError, FieldLabel } from '../../ui/field'
import { useFieldContext } from '../form.context'

type FormFieldProps = {
  label?: string | undefined
  description?: string | undefined
  children: React.ReactNode
}

export const FormField = ({
  label,
  children,
  description,
}: FormFieldProps) => {
  const field = useFieldContext()

  const error = getFieldError(field)

  return (
    <Field>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      {children}

      {description && <FieldDescription>{description}</FieldDescription>}

      {error && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export const getFieldError = (field: any): string | null => {
  const isValid = field.state.meta.isValid

  const isTouched = field.state.meta.isTouched

  if (!isValid && isTouched) {
    return field?.state?.meta?.errors?.length
      ? (field.state.meta.errors[0]?.message ?? 'Invalid field')
      : null
  }

  return null
}
