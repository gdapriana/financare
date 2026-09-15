import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { priceFormatter } from "@/lib/utils"
import type { ExpenseItemInput } from "@/services/transactions.api"
import { useBalanceStore } from "@/store/balance-store"
import { PlusIcon, Trash2 } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, type Dispatch, type SetStateAction } from "react"

export default function InputExpenseItems({
  items,
  amount,
  tax,
}: {
  items: {
    value: ExpenseItemInput[]
    setValue: Dispatch<SetStateAction<ExpenseItemInput[]>>
  }
  amount: {
    value: number
    setValue: Dispatch<SetStateAction<number>>
  }
  tax: {
    value: number
    setValue: Dispatch<SetStateAction<number>>
  }
}) {
  const currency = useBalanceStore((state) => state.currency)

  useEffect(() => {
    amount.setValue(() => {
      let total: number = 0
      items.value.map((item) => {
        total += item.quantity * item.unit_price
      })

      if (tax.value !== 0) {
        total = total + (total * tax.value) / 100
      }

      return total
    })
  }, [items.value, tax.value])

  const handleRemove = (idx: number) => {
    items.setValue((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleChange = (
    idx: number,
    field: keyof ExpenseItemInput,
    value: string | number
  ) => {
    items.setValue((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    )
  }

  const handleAdd = () => {
    items.setValue((prev) => [
      ...prev,
      { name: "", quantity: 0, unit_price: 0, sort_order: prev.length + 1 },
    ])
  }

  return (
    <Field className="gap-8">
      {items.value.map((item, idx: number) => (
        <div className="flex flex-col items-stretch justify-start gap-5 border-b pb-4">
          <div
            key={idx}
            className="grid grid-cols-[60%_auto] grid-rows-2 gap-2 gap-y-4 md:grid-cols-[60%_25%_auto] md:grid-rows-1"
          >
            <Field className="col-span-2 flex flex-col gap-2 md:col-span-1">
              <FieldLabel className="text-xs text-muted-foreground">
                Item name
              </FieldLabel>
              <Input
                required
                value={items.value[idx].name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                placeholder="Item name"
              />
            </Field>
            <Field className="flex flex-col gap-2">
              <FieldLabel className="text-xs text-muted-foreground">
                Price
              </FieldLabel>
              <Input
                min={1}
                value={items.value[idx].unit_price}
                type="number"
                onChange={(e) =>
                  handleChange(idx, "unit_price", Number(e.target.value))
                }
              />
            </Field>
            <Field className="flex flex-col gap-2">
              <FieldLabel className="text-xs text-muted-foreground">
                Quantity
              </FieldLabel>
              <Input
                value={items.value[idx].quantity}
                min={1}
                onChange={(e) =>
                  handleChange(idx, "quantity", Number(e.target.value))
                }
                type="number"
                className=""
              />
            </Field>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total:{" "}
              {priceFormatter(currency).format(item.quantity * item.unit_price)}
            </span>
            <Badge onClick={() => handleRemove(idx)} className="cursor-pointer">
              <HugeiconsIcon icon={Trash2} />
            </Badge>
          </div>
        </div>
      ))}
      {items.value.length > 0 && (
        <div className="flex items-center justify-end">
          <div className="flex w-auto flex-row justify-end gap-2">
            <FieldLabel className="" htmlFor="tax">
              Tax(%)
            </FieldLabel>
            <Input
              id="tax"
              type="number"
              defaultValue={0}
              className="max-w-20"
              value={tax.value}
              min={0}
              onChange={(e) => tax.setValue(Number(e.target.value))}
            />
          </div>
        </div>
      )}
      <Button onClick={handleAdd} className="mt-4" variant="secondary">
        <HugeiconsIcon icon={PlusIcon} /> Add item
      </Button>
    </Field>
  )
}
