import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { Dispatch, SetStateAction } from "react"

export default function InputNote({
  note,
}: {
  note: {
    value: string | undefined | null
    setValue: Dispatch<SetStateAction<string | undefined | null>>
  }
}) {
  return (
    <Field>
      <FieldLabel htmlFor="note">Note (Optional)</FieldLabel>
      <Textarea
        className="h-30 p-4"
        id="note"
        onChange={(e) => note.setValue(e.target.value)}
        placeholder="e.g Dinner with family"
      />
    </Field>
  )
}
