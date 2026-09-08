import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const priceFormatter = (currency: string) =>
  Intl.NumberFormat("id", {
    notation: "standard",
    style: "currency",
    currency,
  })

export const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const addMonths = (date: Date, amount: number): Date => {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export const createMonthGrid = (date: Date): Array<Date | null> => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const requiredCells = firstWeekday + daysInMonth
  const totalCells = Math.ceil(requiredCells / 7) * 7

  return Array.from({ length: totalCells }, (_, index: number) => {
    const dayNumber = index - firstWeekday + 1
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null
    }

    return new Date(year, month, dayNumber)
  })
}

export const isSameDay = (first: Date, second: Date): boolean => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

export const getDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const formatMonthYear = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date)
}

export const startOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export const isPastDate = (
  date: Date,
  referenceDate: Date = new Date()
): boolean => {
  const targetDay = startOfDay(date).getTime()
  const referenceDay = startOfDay(referenceDate).getTime()
  return targetDay < referenceDay
}
