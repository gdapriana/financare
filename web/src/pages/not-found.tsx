import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileNotFoundIcon,
  ArrowLeft01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 left-0 z-999 flex min-h-svh w-full flex-col items-center justify-center bg-background p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted/60 text-muted-foreground ring-8 ring-muted/30">
          <HugeiconsIcon icon={FileNotFoundIcon} className="size-10" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            404 Error
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4" />
            Go Back
          </Button>
          <Link to="/">
            <Button>
              <HugeiconsIcon icon={Home01Icon} className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
