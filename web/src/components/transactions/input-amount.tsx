import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Dispatch, SetStateAction } from "react"

export default function InputAmount({
  amount,
}: {
  amount: { value: number; setValue: Dispatch<SetStateAction<number>> }
}) {
  return (
    <Field>
      <FieldLabel htmlFor="amount">Amount</FieldLabel>
      <Input
        type="number"
        min={0}
        id="amount"
        max={999999999}
        value={amount.value || ""}
        onChange={(e) => amount.setValue(Number(e.target.value))}
        placeholder="e.g. 1500000"
        autoFocus
      />
    </Field>
  )
}
