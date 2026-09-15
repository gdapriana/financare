import SectionHeader from "@/components/section-header"
import { cn, priceFormatter } from "@/lib/utils"
import {
  ArrowRight01FreeIcons,
  Download03FreeIcons,
  Upload03FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router"
import moment from "moment"
import { useBalanceStore } from "@/store/balance-store"
import { usePastWeekTransactions } from "@/hooks/use-transactions"

export default function RecentTransaction() {
  const currency = useBalanceStore((state) => state.currency)

  const { data: recentTransactions, isLoading: recentTransactionsLoading } =
    usePastWeekTransactions()

  return (
    <div className="container my-4">
      <div className="flex flex-col items-stretch justify-start">
        <SectionHeader
          title="Recent Transactions"
          cta={{
            icon: ArrowRight01FreeIcons,
            text: "All Transaction",
            url: "/transactions",
          }}
        />
        <div className="mt-4 flex flex-col items-stretch justify-start gap-8">
          {!recentTransactionsLoading &&
            recentTransactions &&
            recentTransactions.transactions &&
            recentTransactions.transactions.length > 0 &&
            recentTransactions.transactions.map((item, idx: number) => (
              <Link
                key={idx}
                className="flex items-center justify-between gap-4"
                to="/"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full",
                    item.type === "INCOME" ? "bg-primary" : "bg-secondary"
                  )}
                >
                  <HugeiconsIcon
                    className={
                      item.type === "INCOME"
                        ? "text-background"
                        : "text-primary"
                    }
                    icon={
                      item.type === "INCOME"
                        ? Download03FreeIcons
                        : Upload03FreeIcons
                    }
                  />
                </div>
                <div className="flex flex-1 flex-col items-start justify-center gap-2">
                  <h3 className="text-sm font-semibold md:text-base">
                    {item.source_name}
                  </h3>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {item.location_name},{" "}
                    {moment(item.created_at).format("MM DD, YYYY")}
                  </p>
                </div>
                <p
                  className={cn(
                    "",
                    item.type === "EXPENSE" && "text-muted-foreground"
                  )}
                >
                  {item.type === "INCOME" ? "+" : "-"}
                  {priceFormatter(currency).format(item.amount)}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
