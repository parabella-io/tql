import { Input } from '../../ui/input'
import { useFieldContext } from '../form.context'
import { FormField } from './form.field'

type FormInputFieldProps = {
  type?: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
}

export const FormInputField = ({
  type,
  placeholder,
  required,
  label,
  description,
}: FormInputFieldProps) => {
  const field = useFieldContext()

  return (
    <FormField label={label} description={description}>
      <Input
        id={field.name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </FormField>
  )
}
