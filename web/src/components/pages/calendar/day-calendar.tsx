import { Button } from "@/components/ui/button"
import { useTransactionsQuery } from "@/hooks/use-transactions"
import { cn } from "@/lib/utils"
import moment from "moment"

type CalendarDayProps = {
  date: Date | null
  isToday: boolean
  isSelected: boolean
  onPress: (date: Date) => void
}

export default function DayCalendar({
  date,
  isToday,
  isSelected,
  onPress,
}: CalendarDayProps) {
  if (!date) return null

  const startDate = new Date(
    `${moment(date).format("YYYY-MM-DD")}T00:00:00`
  ).toISOString()
  const endDate = new Date(
    `${moment(date).format("YYYY-MM-DD")}T23:59:59.999`
  ).toISOString()

  const { data: incomes, isLoading: loadingIncomes } = useTransactionsQuery({
    type: "INCOME",
    start_date: startDate,
    end_date: endDate,
  })
  const { data: expenses, isLoading: loadingExpenses } = useTransactionsQuery({
    type: "EXPENSE",
    start_date: startDate,
    end_date: endDate,
  })

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        size="icon-lg"
        variant={isSelected ? "default" : isToday ? "secondary" : "outline"}
        className={cn("", isToday && "border")}
        onClick={() => onPress(date)}
      >
        <p>{date.getDate()}</p>
      </Button>
      {!loadingIncomes && !loadingExpenses && (
        <div className="items-center justify-center gap-1">
          {incomes &&
            incomes.transactions &&
            incomes.transactions.length > 0 && (
              <span className="text-primary">●</span>
            )}
          {expenses &&
            expenses.transactions &&
            expenses.transactions.length > 0 && (
              <span className="text-muted-foreground">●</span>
            )}
        </div>
      )}
    </div>
  )
}
