import InputAccounts from "@/components/transactions/input-accounts"
import InputAmount from "@/components/transactions/input-amount"
import InputAttachments, {
  type AttachmentItem,
} from "@/components/transactions/input-attachments"
import InputDateTime from "@/components/transactions/input-datetime"
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
import { useUploadAttachmentsMutation } from "@/hooks/use-attachments"
import { useCreateTransactionMutation } from "@/hooks/use-transactions"
import { priceFormatter } from "@/lib/utils"
import type { CreateTransactionInput } from "@/services/transactions.api"
import { useBalanceStore } from "@/store/balance-store"
import {
  ArrowLeft01FreeIcons,
  ArrowRight01FreeIcons,
  Calendar01FreeIcons,
  File01FreeIcons,
  Location10FreeIcons,
  Note03FreeIcons,
  SaveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import React, { useState } from "react"
import { useNavigate } from "react-router"

export default function Income() {
  const navigate = useNavigate()
  const currency = useBalanceStore((state) => state.currency)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [amount, setAmount] = useState<number>(0)
  const [name, setName] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [note, setNote] = useState<string | undefined | null>()
  const [location, setLocation] = useState<LocationValue>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  })
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])

  const { data: accounts, isLoading: accountsLoading } = useAccountsQuery()
  const [accountId, setAccountId] = useState<string>("")
  const isStep1Valid = amount > 0 && name.trim().length > 0

  const [isSubmitting, setIsSubmitting] = useState(false)

  const uploadAttachmentsMutation = useUploadAttachmentsMutation()
  const createTransactionMutation = useCreateTransactionMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      let attachmentIds: string[] = []

      if (attachments.length > 0) {
        const rawFiles = attachments.map((item) => item.file)
        const uploadRes = await uploadAttachmentsMutation.mutateAsync(rawFiles)
        if (uploadRes.media_assets && uploadRes.media_assets.length > 0) {
          attachmentIds = uploadRes.media_assets.map((asset) => asset.id)
        }
      }

      const idempotencyKey = crypto.randomUUID()
      const payload: CreateTransactionInput = {
        type: "INCOME",
        account_id: accountId,
        amount: amount,
        source_name: name.trim(),
        occurred_at: date
          ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
          : new Date().toISOString(),
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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-1 pt-8">
          <h1 className="text-lg font-bold tracking-tight md:text-xl">
            Add New Income
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Record incoming money, monthly salary, freelance payouts, or passive
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
                    Set the total income amount, transaction title, date, and
                    time.
                  </FieldDescription>

                  <FieldGroup className="gap-6">
                    <InputAmount
                      amount={{ value: amount, setValue: setAmount }}
                    />
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
                    onClick={() => setCurrentStep(1)}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01FreeIcons} size={16} />
                    <span>Back</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(3)}
                      className="rounded-full px-4 text-xs text-muted-foreground"
                    >
                      Skip
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCurrentStep(3)}
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
                    onClick={() => setCurrentStep(2)}
                    className="gap-2 rounded-full px-6 font-medium"
                  >
                    <HugeiconsIcon icon={ArrowLeft01FreeIcons} size={16} />
                    <span>Back</span>
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
            )}

            {currentStep === 4 && (
              <div className="flex flex-col gap-6">
                <FieldSet>
                  <FieldLegend
                    variant="legend"
                    className="text-base font-semibold"
                  >
                    Attachments (Optional)
                  </FieldLegend>
                  <FieldDescription className="text-sm">
                    Upload 1 or more media attachments, receipts, or documents.
                  </FieldDescription>

                  <FieldGroup>
                    <InputAttachments
                      attachments={{
                        value: attachments,
                        setValue: setAttachments,
                      }}
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
                  <Button type="submit" disabled={isSubmitting}>
                    <span>{isSubmitting ? "Saving..." : "Save"}</span>
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
                  Total Income Amount
                </span>
                <span className="mt-2 text-xl font-semibold">
                  + {priceFormatter(currency).format(amount || 0)}
                </span>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1 pb-3">
                  <span className="font-medium text-muted-foreground">
                    Income Title
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
