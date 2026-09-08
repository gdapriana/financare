import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "@/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between gap-8">
        <a href="" className="text-lg font-bold">
          FinanCare
        </a>

        <nav className="hidden gap-2 md:flex">
          {NAV_LINKS.map((nav, idx: number) => (
            <Button
              render={<Link to={nav.href} />}
              variant="ghost"
              size="sm"
              key={idx}
            >
              <HugeiconsIcon icon={nav.icon} /> {nav.label}
            </Button>
          ))}
        </nav>

        <Sidebar />
      </div>
    </header>
  )
}
