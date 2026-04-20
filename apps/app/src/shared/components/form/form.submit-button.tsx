import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { useFormContext } from './form.context'

type FormSubmitButtonProps = {
  label: string
}

export const FormSubmitButton = ({ label }: FormSubmitButtonProps) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={form.handleSubmit}
        >
          {isSubmitting && <Spinner />} {label}
        </Button>
      )}
    </form.Subscribe>
  )
}
