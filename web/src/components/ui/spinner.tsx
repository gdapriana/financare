import { LoaderIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"

function Spinner() {
  return (
    <HugeiconsIcon
      icon={LoaderIcon}
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin")}
    />
  )
}

export { Spinner }
