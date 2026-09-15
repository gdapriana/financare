import {
  Download03FreeIcons,
  Upload03FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router"

export default function Transactions() {
  return (
    <div className="container">
      <div className="flex flex-col items-stretch gap-4 py-20 md:flex-row md:items-start">
        <Link
          to={"/transactions/income"}
          className="flex flex-col items-center justify-center gap-1 rounded-4xl bg-primary p-8 md:w-1/2"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
            <HugeiconsIcon
              icon={Download03FreeIcons}
              size={30}
              className="text-background"
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-background">Income</h2>
          <p className="text-sm text-muted-foreground">
            Salary, pasif income, etc...
          </p>
        </Link>
        <Link
          to={"/transactions/expense"}
          className="flex flex-col items-center justify-center gap-1 rounded-4xl bg-secondary p-8 md:w-1/2"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <HugeiconsIcon
              icon={Upload03FreeIcons}
              size={30}
              className="text-primary"
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-primary">Expense</h2>
          <p className="text-sm text-muted-foreground">
            Shopping, loan, payments...
          </p>
        </Link>
      </div>
    </div>
  )
}
