import { EmptyItem } from "@/components/empty"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, priceFormatter } from "@/lib/utils"
import { mockTransactions } from "@/mocks/transactions"
import { useBalanceStore } from "@/store/balance-store"
import { useCalendarStore } from "@/store/calendar-store"
import { type Transaction } from "@/types/transaction"
import {
  ArrowRight01FreeIcons,
  Cash01FreeIcons,
  DownloadCircle01FreeIcons,
  Location10FreeIcons,
  Plus,
  UploadCircle01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import moment from "moment"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export default function Transactions() {
  const selectedDateKey = useCalendarStore((state) => state.selectedDateKey)
  const [loading, setLoading] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<Transaction[]>()
  const currency = useBalanceStore((state) => state.currency)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setTransactions(() => {
      const current = mockTransactions.filter(
        (item) =>
          moment(item.occurredAt).format("YYYY-MM-DD") === selectedDateKey
      )
      return current
    })
    setLoading(false)
  }, [selectedDateKey])

  return (
    <div className="container">
      {loading && <div>Loading...</div>}
      {!loading && transactions && transactions.length === 0 && (
        <EmptyItem
          title="No transaction"
          icon={Cash01FreeIcons}
          description={`No transaction on ${moment(selectedDateKey).format("MMM DD, YYYY")}`}
          cta={{
            text: "Add Transactions",
            icon: Plus,
            actions: () => navigate("/transactions"),
          }}
        />
      )}

      {transactions && transactions.length > 0 && (
        <div className="flex flex-col items-stretch justify-start">
          {transactions.map((item, idx: number) => (
            <div className="flex items-stretch justify-center" key={idx}>
              <div className="hidden w-30 flex-col items-center justify-center md:flex">
                {idx !== 0 ? (
                  <div className="w-0.5 flex-1 bg-primary/50"></div>
                ) : (
                  <div className="w-0.5 flex-1 bg-background"></div>
                )}
                <Badge>{moment(item.occurredAt).format("ss:mm a")}</Badge>

                {idx !== transactions.length - 1 ? (
                  <div className="w-0.5 flex-1 bg-primary/50"></div>
                ) : (
                  <div className="w-0.5 flex-1 bg-background"></div>
                )}
              </div>
              <div className="flex-1 py-2">
                <div className="flex items-center justify-center rounded-4xl bg-secondary/40 p-8">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col items-start justify-center gap-2">
                      <span className="text-xs text-muted-foreground/50">
                        {moment(item.occurredAt).format("DD MMM YYYY")}
                      </span>
                      <h3 className="line-clamp-1 font-semibold">
                        {item.sourceName}
                      </h3>
                      {item.note && (
                        <p className="text-sm text-muted-foreground">
                          {item.note}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-start gap-2">
                        <Badge
                          className={cn(
                            item.type === "INCOME" && "bg-lime-700"
                          )}
                        >
                          <HugeiconsIcon
                            icon={
                              item.type === "EXPENSE"
                                ? UploadCircle01Icon
                                : DownloadCircle01FreeIcons
                            }
                          />
                          {priceFormatter(currency).format(item.amount)}
                        </Badge>
                        {item.locationName && (
                          <Badge variant="secondary">
                            <HugeiconsIcon icon={Location10FreeIcons} />
                            {item.locationName}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <HugeiconsIcon icon={ArrowRight01FreeIcons} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
