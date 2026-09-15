import DayCalendar from "@/components/pages/calendar/day-calendar"
import { Button } from "@/components/ui/button"
import {
  addMonths,
  createMonthGrid,
  formatMonthYear,
  getDateKey,
  isSameDay,
  startOfMonth,
} from "@/lib/utils"
import { useCalendarStore } from "@/store/calendar-store"
import {
  ArrowLeft01FreeIcons,
  ArrowRight01FreeIcons,
  Calendar01FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion } from "framer-motion"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

// Helper to compute element offset relative to scroll container
function getRelativeOffsetLeft(element: HTMLElement, parent: HTMLElement) {
  let offset = 0
  let curr: HTMLElement | null = element
  while (curr && curr !== parent) {
    offset += curr.offsetLeft
    curr = curr.offsetParent as HTMLElement | null
  }
  return offset
}

export default function MonthCalendar() {
  const selectedDateKey = useCalendarStore((state) => state.selectedDateKey)
  const selectDate = useCalendarStore((state) => state.selectDate)
  const today = useMemo(() => new Date(), [])

  useEffect(() => {
    if (!selectedDateKey) {
      selectDate(getDateKey(today))
    }
  }, [selectedDateKey, selectDate, today])

  const baseMonth = useMemo(() => startOfMonth(new Date()), [])

  const [visibleMonth, setVisibleMonth] = useState<Date>(baseMonth)

  const [range, setRange] = useState({ start: -4, end: 4 })

  const containerRef = useRef<HTMLDivElement>(null)
  const monthRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const todayRef = useRef<HTMLDivElement | null>(null)
  const prevScrollWidthRef = useRef<number | null>(null)
  const isInitialScrollDone = useRef(false)

  const monthsData = useMemo(() => {
    const list = []
    for (let offset = range.start; offset <= range.end; offset++) {
      const monthDate = addMonths(baseMonth, offset)
      const rawDays = createMonthGrid(monthDate)
      const days = rawDays.filter((d): d is Date => d !== null)
      list.push({
        offset,
        date: monthDate,
        days,
      })
    }
    return list
  }, [baseMonth, range.start, range.end])

  // Center scroll position directly on TODAY's date item upon mount/reload
  useLayoutEffect(() => {
    if (isInitialScrollDone.current) return
    const container = containerRef.current
    const todayEl = todayRef.current

    if (container && todayEl) {
      const relativeLeft = getRelativeOffsetLeft(todayEl, container)
      const targetLeft =
        relativeLeft - container.clientWidth / 2 + todayEl.clientWidth / 2
      container.scrollLeft = Math.max(0, targetLeft)
      isInitialScrollDone.current = true
    }
  }, [monthsData])

  // Adjust scroll position when prepending items to prevent layout jump
  useLayoutEffect(() => {
    if (prevScrollWidthRef.current !== null && containerRef.current) {
      const container = containerRef.current
      const scrollWidthDiff = container.scrollWidth - prevScrollWidthRef.current
      if (scrollWidthDiff > 0) {
        container.scrollLeft += scrollWidthDiff
      }
      prevScrollWidthRef.current = null
    }
  }, [range.start])

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const scrollRight = scrollWidth - scrollLeft - clientWidth

    if (scrollLeft < 350) {
      prevScrollWidthRef.current = scrollWidth
      setRange((prev) => ({ ...prev, start: prev.start - 4 }))
    }

    if (scrollRight < 350) {
      setRange((prev) => ({ ...prev, end: prev.end + 4 }))
    }

    const containerCenter = scrollLeft + clientWidth / 2
    let closestOffset = 0
    let minDistance = Infinity

    monthRefs.current.forEach((el, offset) => {
      if (!el) return
      const elCenter = getRelativeOffsetLeft(el, container) + el.clientWidth / 2
      const distance = Math.abs(containerCenter - elCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestOffset = offset
      }
    })

    const activeMonthDate = addMonths(baseMonth, closestOffset)
    if (
      activeMonthDate.getMonth() !== visibleMonth.getMonth() ||
      activeMonthDate.getFullYear() !== visibleMonth.getFullYear()
    ) {
      setVisibleMonth(activeMonthDate)
    }
  }, [baseMonth, visibleMonth])

  const scrollToOffset = useCallback((offset: number) => {
    const container = containerRef.current
    const targetEl = monthRefs.current.get(offset)
    if (container && targetEl) {
      const relativeLeft = getRelativeOffsetLeft(targetEl, container)
      const targetLeft =
        relativeLeft - container.clientWidth / 2 + targetEl.clientWidth / 2
      container.scrollTo({ left: targetLeft, behavior: "smooth" })
    }
  }, [])

  const handlePrevMonth = () => {
    const currentOffset = Math.round(
      (visibleMonth.getFullYear() - baseMonth.getFullYear()) * 12 +
        (visibleMonth.getMonth() - baseMonth.getMonth()) -
        1
    )
    if (currentOffset < range.start + 1) {
      setRange((prev) => ({ ...prev, start: prev.start - 4 }))
    }
    scrollToOffset(currentOffset)
  }

  const handleNextMonth = () => {
    const currentOffset = Math.round(
      (visibleMonth.getFullYear() - baseMonth.getFullYear()) * 12 +
        (visibleMonth.getMonth() - baseMonth.getMonth()) +
        1
    )
    if (currentOffset > range.end - 1) {
      setRange((prev) => ({ ...prev, end: prev.end + 4 }))
    }
    scrollToOffset(currentOffset)
  }

  const handleResetToToday = () => {
    selectDate(getDateKey(today))
    const container = containerRef.current
    const todayEl = todayRef.current
    if (container && todayEl) {
      const relativeLeft = getRelativeOffsetLeft(todayEl, container)
      const targetLeft =
        relativeLeft - container.clientWidth / 2 + todayEl.clientWidth / 2
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" })
    } else {
      scrollToOffset(0)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto mt-6 flex w-auto items-center justify-center">
        <Button
          onClick={handlePrevMonth}
          variant="secondary"
          size="icon-lg"
          className="transition-transform active:scale-95"
        >
          <HugeiconsIcon icon={ArrowLeft01FreeIcons} />
        </Button>

        <Button
          onClick={handleResetToToday}
          variant="ghost"
          size="lg"
          className="relative min-w-[200px] overflow-hidden"
        >
          <HugeiconsIcon icon={Calendar01FreeIcons} />
          <AnimatePresence mode="wait">
            <motion.span
              key={visibleMonth.toISOString()}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block font-semibold"
            >
              {formatMonthYear(visibleMonth)}
            </motion.span>
          </AnimatePresence>
        </Button>

        <Button
          onClick={handleNextMonth}
          variant="secondary"
          size="icon-lg"
          className="transition-transform active:scale-95"
        >
          <HugeiconsIcon icon={ArrowRight01FreeIcons} />
        </Button>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-background via-background/80 to-transparent" />
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex w-full scrollbar-none flex-nowrap items-center justify-start overflow-x-auto [mask-image:linear-gradient(to_right,transparent_0%,black_64px,black_calc(100%-64px),transparent_100%)] py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex min-w-max items-start gap-10 px-16">
            {monthsData.map(({ offset, date, days }) => {
              const monthLabel = formatMonthYear(date)
              return (
                <div
                  key={offset}
                  ref={(el) => {
                    if (el) monthRefs.current.set(offset, el)
                    else monthRefs.current.delete(offset)
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground/80 uppercase">
                    {monthLabel}
                  </span>
                  <div className="flex items-start gap-3">
                    {days.map((dayDate) => {
                      const isToday = isSameDay(dayDate, today)
                      return (
                        <motion.div
                          key={getDateKey(dayDate)}
                          ref={(el) => {
                            if (isToday) todayRef.current = el
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        >
                          <DayCalendar
                            date={dayDate}
                            isToday={isToday}
                            isSelected={getDateKey(dayDate) === selectedDateKey}
                            onPress={(pressedDate) => {
                              selectDate(getDateKey(pressedDate))
                            }}
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
