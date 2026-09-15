import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Dispatch, SetStateAction } from "react"

export default function InputName({
  name,
}: {
  name: { value: string; setValue: Dispatch<SetStateAction<string>> }
}) {
  return (
    <Field>
      <FieldLabel htmlFor="name">Transaction Name</FieldLabel>
      <Input
        type="text"
        id="name"
        value={name.value}
        onChange={(e) => name.setValue(e.target.value)}
        placeholder="e.g. Monthly Salary, Freelance Payout..."
      />
    </Field>
  )
}
