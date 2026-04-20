import { FieldError } from '../../ui/field'

import { useFieldContext } from '../form.context'

export const FormErrorField = () => {
  const field = useFieldContext()

  const error = field.state.meta.errors

  if (!error) {
    return null
  }

  return <FieldError errors={field.state.meta.errors} />
}
