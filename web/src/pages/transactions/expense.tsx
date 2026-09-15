import InputAccounts from "@/components/transactions/input-accounts"
import InputDateTime from "@/components/transactions/input-datetime"
import InputExpenseItems from "@/components/transactions/input-expense-item"
import InputLocation, {
  type LocationValue,
} from "@/components/transactions/input-location"
import InputName from "@/components/transactions/input-name"
import InputNote from "@/components/transactions/input-note"
import { Button } from "@/components/ui/button"
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { useAccountsQuery } from "@/hooks/use-accounts"
import { useCreateTransactionMutation } from "@/hooks/use-transactions"
import { cn, priceFormatter } from "@/lib/utils"
import {
  type ExpenseItemInput,
  type CreateTransactionInput,
} from "@/services/transactions.api"
import { useBalanceStore } from "@/store/balance-store"
import {
  ArrowLeft01FreeIcons,
  ArrowRight01FreeIcons,
  Calendar01FreeIcons,
  ListChecks,
  Location10FreeIcons,
  Note03FreeIcons,
  SaveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export default function Expense() {
  const navigate = useNavigate()
  const currency = useBalanceStore((state) => state.currency)
  const { data: accounts, isLoading: accountsLoading } = useAccountsQuery()

  const [accountId, setAccountId] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [amount, setAmount] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [items, setItems] = useState<ExpenseItemInput[]>([])
  const [name, setName] = useState<string>("")
  const [tax, setTax] = useState<number>(0)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [note, setNote] = useState<string | undefined | null>()
  const [location, setLocation] = useState<LocationValue>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  })
  const isStep1Valid = name.trim().length > 0
  const isStep2Valid = items.length > 0 && checkItemsValid(items)

  const [_, setIsSubmitting] = useState(false)

  useEffect(() => {
    setTotalAmount(() => amount + (amount * tax) / 100)
  }, [tax, amount])

  const createTransactionMutation = useCreateTransactionMutation()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      let attachmentIds: string[] = []

      const idempotencyKey = crypto.randomUUID()
      const payload: CreateTransactionInput = {
        type: "EXPENSE",
        account_id: accountId,
        amount: totalAmount,
        items,
        source_name: name.trim(),
        occurred_at: date ? date.toISOString() : new Date().toISOString(),
        note: note ? note.trim() : null,
        location:
          location.name || location.address
            ? {
                name: location.name || location.address,
                latitude: location.latitude,
                longitude: location.longitude,
              }
            : null,
        attachment_ids: attachmentIds.length > 0 ? attachmentIds : undefined,
      }
      await createTransactionMutation.mutateAsync({
        payload,
        idempotencyKey,
      })
      navigate("/transactions")
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error)
    } finally {
      setIsSubmitting(false)
    }
    navigate("/transactions")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-1 pt-8">
          <h1 className="text-lg font-bold tracking-tight md:text-xl">
            Add New Expense
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Record expenses money, monthly salary, freelance payouts, or passive
            income.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            {currentStep === 1 && (
              <div className="flex flex-col gap-6">
                <FieldSet>
                  <FieldLegend
                    variant="legend"
                    className="text-base font-semibold"
                  >
                    Basic Details
                  </FieldLegend>
                  <FieldDescription className="text-sm">
                    Set the total expense amount, transaction title, date, and
                    time.
                  </FieldDescription>

                  <FieldGroup className="gap-6">
                    <InputName name={{ value: name, setValue: setName }} />
                    <InputDateTime date={{ value: date, setValue: setDate }} />
                    <InputNote note={{ value: note, setValue: setNote }} />
                  </FieldGroup>
                </FieldSet>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/transactions")}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01FreeIcons} size={16} />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!isStep1Valid}
                    onClick={() => setCurrentStep(2)}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <span>Next Section</span>
                    <HugeiconsIcon icon={ArrowRight01FreeIcons} size={16} />
                  </Button>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <FieldSet>
                  <FieldLegend
                    variant="legend"
                    className="text-base font-semibold"
                  >
                    Expense items
                  </FieldLegend>
                  <FieldDescription className="text-sm">
                    Add items that you expense
                  </FieldDescription>

                  <FieldGroup>
                    <InputExpenseItems
                      amount={{ value: amount, setValue: setAmount }}
                      tax={{ value: tax, setValue: setTax }}
                      items={{ value: items, setValue: setItems }}
                    />
                  </FieldGroup>
                </FieldSet>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCurrentStep(1)}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01FreeIcons} size={16} />
                    <span>Back</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStep2Valid}
                      className="gap-2 rounded-full px-6 font-medium"
                    >
                      <span>Next Section</span>
                      <HugeiconsIcon icon={ArrowRight01FreeIcons} size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex flex-col gap-6">
                <FieldSet>
                  <FieldLegend
                    variant="legend"
                    className="text-base font-semibold"
                  >
                    Location Details
                  </FieldLegend>
                  <FieldDescription className="text-sm">
                    Optionally search for a place or select coordinates on the
                    map.
                  </FieldDescription>

                  <FieldGroup>
                    <InputLocation
                      location={{ value: location, setValue: setLocation }}
                    />
                  </FieldGroup>
                </FieldSet>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCurrentStep(2)}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01FreeIcons} size={16} />
                    <span>Back</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(4)}
                      className="rounded-full px-4 text-xs text-muted-foreground"
                    >
                      Skip
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(4)}
                      className="gap-2 rounded-full px-6 font-medium"
                    >
                      <span>Next Section</span>
                      <HugeiconsIcon icon={ArrowRight01FreeIcons} size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6">
                <FieldSet>
                  <FieldLegend
                    variant="legend"
                    className="text-base font-semibold"
                  >
                    Target Account
                  </FieldLegend>
                  <FieldDescription className="text-sm">
                    Select which bank account or wallet receives these funds.
                  </FieldDescription>

                  <FieldGroup>
                    <InputAccounts
                      accounts={{
                        accounts: accounts?.accounts,
                        loadingAccounts: accountsLoading,
                      }}
                      accountId={{ value: accountId, setValue: setAccountId }}
                    />
                  </FieldGroup>
                </FieldSet>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCurrentStep(3)}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01FreeIcons} size={16} />
                    <span>Back</span>
                  </Button>
                  <Button type="submit">
                    <span>Save</span>
                    <HugeiconsIcon icon={SaveIcon} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-6 lg:col-span-5">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-sm font-semibold">Income Summary</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  Section {currentStep} of 4
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border p-6 text-center">
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Total expense Amount
                </span>
                <span className="mt-2 text-xl font-semibold">
                  + {priceFormatter(currency).format(amount || 0)}
                </span>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1 pb-3">
                  <span className="font-medium text-muted-foreground">
                    Expense Title
                  </span>
                  <span className="text-sm font-semibold">{name.trim()}</span>
                </div>

                <div className="flex flex-col gap-2 pb-3">
                  <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                    <HugeiconsIcon icon={Calendar01FreeIcons} size={14} />
                    Date & Time
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {date ? (
                      format(date, "PPP 'at' p")
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not selected
                      </span>
                    )}
                  </span>
                </div>
                {items && items.length > 0 && (
                  <div className="flex flex-col gap-2 pb-3">
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <HugeiconsIcon icon={ListChecks} size={14} />
                      Items
                    </span>
                    <div className="flex flex-col items-stretch justify-start gap-0.5 rounded-2xl bg-secondary/50 px-4 py-2">
                      {items.map((item, idx) => (
                        <div
                          className={cn(
                            "flex items-center justify-between py-3",
                            idx !== 0 && "border-t"
                          )}
                          key={idx}
                        >
                          <div className="line-clamp-1 text-xs">
                            {item.name ? (
                              <span className="font-semibold">{item.name}</span>
                            ) : (
                              <span className="text-muted-foreground italic">
                                No name
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {priceFormatter(currency).format(item.unit_price)} @{" "}
                            {item.quantity}
                          </div>
                        </div>
                      ))}
                      {tax !== 0 && (
                        <div
                          className={cn(
                            "flex items-center justify-between py-3"
                          )}
                        >
                          <div className="line-clamp-1 text-xs font-semibold">
                            Tax ({tax}%)
                          </div>
                          <div className="text-muted-foreground">
                            {priceFormatter(currency).format(
                              (amount * tax) / 100
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {location.name && (
                  <div className="flex flex-col gap-2 pb-3">
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <HugeiconsIcon icon={Location10FreeIcons} size={14} />
                      Location
                    </span>
                    {location.name || location.address ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-foreground">
                          {location.name || "Selected Location"}
                        </span>
                        {location.address && (
                          <span className="line-clamp-2 text-[11px] text-muted-foreground">
                            {location.address}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No location specified
                      </span>
                    )}
                  </div>
                )}

                {note && (
                  <div className="flex flex-col gap-2 border-b pb-3">
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <HugeiconsIcon icon={Note03FreeIcons} size={14} />
                      Note
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-foreground">
                        {note}
                      </span>
                    </div>
                  </div>
                )}

                {accountId &&
                  !accountsLoading &&
                  accounts &&
                  accounts.accounts &&
                  accounts.accounts.length > 0 &&
                  accounts.accounts
                    .filter((acc) => acc.id === accountId)
                    .map((acc, idx: number) => (
                      <div className="flex flex-col gap-2 pb-3" key={idx}>
                        <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                          <HugeiconsIcon icon={Note03FreeIcons} size={14} />
                          Account
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-foreground">
                            {acc.institution_name} ({acc.type})
                          </span>
                        </div>
                      </div>
                    ))}

                {/* {attachments.length > 0 && (
                  <div className="flex flex-col gap-2 border-b pb-3">
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                      <HugeiconsIcon icon={File01FreeIcons} size={14} />
                      Attachments ({attachments.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {attachments.map((item) => (
                        <span
                          key={item.id}
                          className="line-clamp-1 inline-flex max-w-[180px] items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function checkItemsValid(items: ExpenseItemInput[]): boolean {
  for (let i = 0; i < items.length; i++) {
    if (
      items[i].name === "" ||
      items[i].quantity === 0 ||
      items[i].unit_price === 0
    ) {
      return false
    }
  }
  return true
}
