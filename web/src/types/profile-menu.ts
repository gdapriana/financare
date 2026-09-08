import type { IconSvgElement } from "@hugeicons/react"

export type ProfileMenuType = {
  title: string
  icon?: IconSvgElement
  subMenu?: {
    title: string
    url?: string
    icon?: IconSvgElement
  }[]
}[]
