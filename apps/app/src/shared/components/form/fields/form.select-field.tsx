import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '../../ui/select'
import { FormField } from './form.field'
import { useFieldContext } from '../form.context'

type FormSelectFieldProps = {
  type?: string
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  options: { label: string; value: string }[]
}

export const FormSelectField = ({
  label,
  options,
  description,
  placeholder = 'Select an option',
}: FormSelectFieldProps) => {
  const field = useFieldContext()

  const selectedOption = options.find(
    (option) => option.value === field.state.value,
  )

  return (
    <FormField label={label} description={description}>
      <Select
        name={field.name}
        defaultValue={field.state.value as string | undefined}
        value={field.state.value as string | undefined}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            {selectedOption?.label || placeholder}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormField>
  )
}
