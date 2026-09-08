import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mockTransactions } from "@/mocks/transactions"
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

  const hasIncome =
    mockTransactions.filter((item) => {
      return (
        item.type === "INCOME" &&
        moment(item.occurredAt).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
      )
    }).length > 0

  const hasExpenses =
    mockTransactions.filter((item) => {
      return (
        item.type === "EXPENSE" &&
        moment(item.occurredAt).format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD")
      )
    }).length > 0

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
      {(hasIncome || hasExpenses) && (
        <div className="items-center justify-center gap-1">
          {hasIncome && <span className="text-primary">●</span>}
          {hasExpenses && <span className="text-muted-foreground">●</span>}
        </div>
      )}
    </div>
  )
}
