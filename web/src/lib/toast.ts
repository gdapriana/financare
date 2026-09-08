import { toast as toastManager } from "@/components/ui/toast"
import { Alert01FreeIcons } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type React from "react"

export type ToastType = "success" | "error" | "warning" | "info" | "loading"

export interface ShowToastOptions {
  type?: ToastType
  title: React.ReactNode
  description?: React.ReactNode
  icon?: IconSvgElement | React.ReactNode
  timeout?: number
}

/**
 * Reusable toast helper function to trigger notifications from anywhere in the application.
 *
 * @example
 * showToast({
 *   type: "warning",
 *   title: "Session Expiring",
 *   description: "Please save your work.",
 *   icon: ClockAlertIcon,
 * })
 */

export function showToast(options: ShowToastOptions) {
  const { type = "info", title, description, icon, timeout } = options

  return toastManager.add({
    type,
    title,
    description,
    timeout,
    data: { icon },
  })
}

// Shorthand helper functions for convenience
showToast.success = (
  title: React.ReactNode,
  description?: React.ReactNode,
  icon?: IconSvgElement | React.ReactNode,
  timeout?: number
) => showToast({ type: "success", title, description, icon, timeout })

showToast.error = (
  title: React.ReactNode,
  description?: React.ReactNode,
  icon?: IconSvgElement | React.ReactNode,
  timeout?: number
) => showToast({ type: "error", title, description, icon, timeout })

showToast.warning = (
  title: React.ReactNode,
  description?: React.ReactNode,
  icon?: IconSvgElement | React.ReactNode,
  timeout?: number
) => showToast({ type: "warning", title, description, icon, timeout })

showToast.info = (
  title: React.ReactNode,
  description?: React.ReactNode,
  icon?: IconSvgElement | React.ReactNode,
  timeout?: number
) => showToast({ type: "info", title, description, icon, timeout })

showToast.loading = (
  title: React.ReactNode,
  description?: React.ReactNode,
  icon?: IconSvgElement | React.ReactNode,
  timeout = 0
) => showToast({ type: "loading", title, description, icon, timeout })

showToast.dismiss = (id?: string) => toastManager.close(id)

export const templateToastComingSoon: ShowToastOptions = {
  type: "info",
  title: "Coming Soon!",
  description: "This features will available soon!",
  icon: Alert01FreeIcons,
}
