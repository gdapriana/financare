import { Button } from "@/components/ui/button"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Link } from "react-router"

type SectionHeader = {
  title: string
  cta?: {
    text: string
    icon: IconSvgElement
    url: string
  }
}

export default function SectionHeader({ title, cta }: SectionHeader) {
  return (
    <header className="flex items-center justify-between">
      <h3 className="font-bold">{title}</h3>
      {cta && (
        <Button variant="link" render={<Link to={cta.url} />}>
          {cta.text} <HugeiconsIcon icon={cta.icon} />
        </Button>
      )}
    </header>
  )
}
