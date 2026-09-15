import { Button } from "@/components/ui/button"
import { useDashboardSummaryQuery } from "@/hooks/use-dashboard"
import { priceFormatter } from "@/lib/utils"
import { useBalanceStore } from "@/store/balance-store"
import {
  Download03FreeIcons,
  EllipsisIcon,
  EyeClosedFreeIcons,
  EyeIcon,
  Plus,
  Upload03FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect } from "react"

export default function TotalBalance() {
  const hideBalance = useBalanceStore((state) => state.hideBalance)
  const setHideBalance = useBalanceStore((state) => state.setHideBalance)
  const totalBalance = useBalanceStore((state) => state.totalBalance)
  const setTotalBalance = useBalanceStore((state) => state.setTotalBalance)
  const currency = useBalanceStore((state) => state.currency)
  const expenses = useBalanceStore((state) => state.expensesThisMonth)
  const setExpenses = useBalanceStore((state) => state.setExpensesThisMonth)
  const inceome = useBalanceStore((state) => state.incomeThisMonth)
  const setIncome = useBalanceStore((state) => state.setIncomeThisMonth)

  const { data: summary, isLoading, refetch } = useDashboardSummaryQuery()

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (!isLoading && summary) {
      setTotalBalance(summary.total_balance)
      setIncome(summary.monthly_income)
      setExpenses(summary.monthly_expense)
    }
  }, [summary, isLoading])

  return (
    <div className="container">
      <div className="grid grid-cols-2 grid-rows-2 gap-4 py-4 lg:grid-cols-[1.4fr_0.5fr_0.5fr] lg:grid-rows-1 lg:py-8">
        <div className="col-span-2 flex flex-col items-start justify-start gap-3 rounded-4xl bg-primary p-8 md:col-span-1">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Balance</span>
            <Button
              variant="default"
              onClick={() => setHideBalance(!hideBalance)}
              size="icon-lg"
              className="p-0"
            >
              <HugeiconsIcon
                size={24}
                icon={hideBalance ? EyeClosedFreeIcons : EyeIcon}
              />
            </Button>
          </div>
          {hideBalance && !isLoading ? (
            <HugeiconsIcon className="text-background" icon={EllipsisIcon} />
          ) : (
            <h1 className="text-2xl font-semibold text-background">
              {priceFormatter(currency).format(totalBalance)}
            </h1>
          )}
          <div className="mt-4 flex w-full flex-wrap items-center justify-end gap-2">
            <Button variant="secondary">
              <HugeiconsIcon icon={Plus} />
              Add Transaction
            </Button>
            <Button className="bg-background/10">
              <HugeiconsIcon icon={Plus} />
              Transfer
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 rounded-4xl bg-primary/5 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/20">
            <HugeiconsIcon icon={Download03FreeIcons} />
          </div>
          {hideBalance ? (
            <HugeiconsIcon className="mt-4" icon={EllipsisIcon} />
          ) : (
            <h3 className="mt-4 font-semibold">
              {priceFormatter(currency).format(inceome)}
            </h3>
          )}
          <span className="text-sm text-muted-foreground">
            Income this month
          </span>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 rounded-4xl bg-primary/5 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/20">
            <HugeiconsIcon icon={Upload03FreeIcons} />
          </div>
          {hideBalance ? (
            <HugeiconsIcon className="mt-4" icon={EllipsisIcon} />
          ) : (
            <h3 className="mt-4 font-semibold">
              {priceFormatter(currency).format(expenses)}
            </h3>
          )}
          <span className="text-sm text-muted-foreground">
            Expense this month
          </span>
        </div>
      </div>
    </div>
  )
}
