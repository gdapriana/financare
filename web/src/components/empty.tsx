import { RefreshCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

export type EmptyType = {
  icon?: IconSvgElement
  title: string
  description?: string
  cta?: {
    text: string
    icon: IconSvgElement
    actions: () => void
  }
}

export function EmptyItem({ title, icon, description, cta }: EmptyType) {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        {icon && (
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={icon} />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && (
          <EmptyDescription className="max-w-xs text-pretty">
            {description}
          </EmptyDescription>
        )}
      </EmptyHeader>
      {cta && (
        <EmptyContent>
          <Button variant="outline" onClick={cta.actions}>
            <HugeiconsIcon icon={cta.icon} />
            {cta.text}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
