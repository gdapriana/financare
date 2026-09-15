import { EmptyItem } from "@/components/empty"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTransactionsQuery } from "@/hooks/use-transactions"
import { cn, priceFormatter } from "@/lib/utils"
import { useBalanceStore } from "@/store/balance-store"
import { useCalendarStore } from "@/store/calendar-store"
import {
  ArrowRight01FreeIcons,
  Cash01FreeIcons,
  DotFreeIcons,
  DownloadCircle01FreeIcons,
  Location10FreeIcons,
  Plus,
  PlusFreeIcons,
  UploadCircle01Icon,
  X,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import moment from "moment"
import { useMemo, useEffect } from "react"
import { Link, useNavigate } from "react-router"

export default function Transactions() {
  const selectedDateKey = useCalendarStore((state) => state.selectedDateKey)
  const currency = useBalanceStore((state) => state.currency)

  const filters = useMemo(() => {
    if (!selectedDateKey) return {}
    const startDate = new Date(`${selectedDateKey}T00:00:00`).toISOString()
    const endDate = new Date(`${selectedDateKey}T23:59:59.999`).toISOString()
    return { start_date: startDate, end_date: endDate }
  }, [selectedDateKey])

  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch,
  } = useTransactionsQuery(filters)

  useEffect(() => {
    if (selectedDateKey) {
      refetch()
    }
  }, [selectedDateKey, refetch])

  const navigate = useNavigate()

  return (
    <div className="container">
      {transactionsLoading && <div>Loading...</div>}
      {!transactionsLoading &&
        transactions &&
        transactions.transactions &&
        transactions.transactions.length === 0 && (
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

      {transactions &&
        transactions.transactions &&
        transactions.transactions.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-end">
              <Button size="sm" render={<Link to={"/transactions"} />}>
                <HugeiconsIcon icon={PlusFreeIcons} />
                Add Transaction
              </Button>
            </div>
            <div className="flex flex-col items-stretch justify-start">
              {transactions.transactions.map((item, idx: number) => (
                <Link
                  to={`/transactions/${item.id}`}
                  className="flex items-stretch justify-center"
                  key={idx}
                >
                  <div className="hidden w-30 flex-col items-center justify-center md:flex">
                    {idx !== 0 ? (
                      <div className="w-0.5 flex-1 bg-primary/20"></div>
                    ) : (
                      <div className="w-0.5 flex-1 bg-background"></div>
                    )}
                    <Badge variant="secondary">
                      {moment(item.occurred_at).format("hh:mm a")}
                    </Badge>

                    {idx !== transactions.transactions.length - 1 ? (
                      <div className="w-0.5 flex-1 bg-primary/20"></div>
                    ) : (
                      <div className="w-0.5 flex-1 bg-background"></div>
                    )}
                  </div>
                  <div className="flex-1 py-2">
                    <div className="flex items-center justify-center rounded-4xl bg-secondary/40 p-8">
                      <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex flex-1 flex-col items-start justify-center gap-1">
                          <span className="text-xs text-muted-foreground/50">
                            {moment(item.occurred_at).format("DD MMM YYYY")}
                          </span>
                          <h3 className="line-clamp-1 font-semibold">
                            {item.source_name}
                          </h3>
                          {item.note && (
                            <p className="text-sm text-muted-foreground">
                              {item.note}
                            </p>
                          )}
                          <div className="mt-3 flex items-center justify-start gap-2">
                            <Badge
                              className={cn(
                                item.type === "INCOME" && "bg-lime-500"
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
                            {item.location_name && (
                              <Badge variant="secondary">
                                <HugeiconsIcon icon={Location10FreeIcons} />
                                {item.location_name}
                              </Badge>
                            )}
                          </div>

                          {item.type === "EXPENSE" &&
                            item.items &&
                            item.items.length > 0 && (
                              <div className="mt-4 flex w-full max-w-100 flex-col items-stretch justify-start border-b border-muted-foreground/20 py-2">
                                {item.items.map((it, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex w-full items-center justify-between gap-1"
                                  >
                                    <span className="flex-1 text-xs text-muted-foreground">
                                      {it.name}
                                    </span>

                                    <span className="flex items-center justify-center gap-2 text-xs font-semibold">
                                      {priceFormatter(currency).format(
                                        it.unit_price
                                      )}
                                      <HugeiconsIcon size={16} icon={X} />
                                      {it.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
    </div>
  )
}
