import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Field, FieldLabel } from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState, type Dispatch, type SetStateAction } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01FreeIcons } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"

export default function InputDateTime({
  date,
}: {
  date: {
    value?: Date
    setValue: Dispatch<SetStateAction<Date | undefined>>
  }
}) {
  const [openCalendar, setOpenCalendar] = useState(false)
  const [timeString, setTimeString] = useState("10:30:00")

  const handleTimeChange = (newTimeString: string) => {
    setTimeString(newTimeString)
    if (!newTimeString) return

    const [hoursStr, minutesStr, secondsStr] = newTimeString.split(":")
    const hours = parseInt(hoursStr || "0", 10)
    const minutes = parseInt(minutesStr || "0", 10)
    const seconds = parseInt(secondsStr || "0", 10)

    const baseDate = date.value ? new Date(date.value) : new Date()
    baseDate.setHours(hours, minutes, seconds, 0)
    date.setValue(baseDate)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      date.setValue(undefined)
      setOpenCalendar(false)
      return
    }

    const newDate = new Date(selectedDate)
    const [hoursStr, minutesStr, secondsStr] = (
      date.value ? format(date.value, "HH:mm:ss") : timeString
    ).split(":")

    const hours = parseInt(hoursStr || "0", 10)
    const minutes = parseInt(minutesStr || "0", 10)
    const seconds = parseInt(secondsStr || "0", 10)

    newDate.setHours(hours, minutes, seconds, 0)
    date.setValue(newDate)
    setOpenCalendar(false)
  }

  const handleSetNow = () => {
    const now = new Date()
    date.setValue(now)
    setTimeString(format(now, "HH:mm:ss"))
  }

  const displayTime = date.value ? format(date.value, "HH:mm:ss") : timeString

  return (
    <div className="grid grid-cols-[1fr_auto] grid-rows-2 gap-4 lg:grid-cols-[1fr_auto_auto] lg:grid-rows-1">
      <Field className="col-span-2 lg:col-span-1">
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger
            render={
              <Button
                variant="secondary"
                id="date-picker-optional"
                className="w-32 justify-between font-normal"
              >
                {date.value ? format(date.value, "PPP") : "Select date"}
                <HugeiconsIcon icon={Calendar01FreeIcons} />
              </Button>
            }
          />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date.value}
              captionLayout="dropdown"
              defaultMonth={date.value}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field>
        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          step="1"
          value={displayTime}
          onChange={(e) => handleTimeChange(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel className="invisible">Today</FieldLabel>
        <Button type="button" onClick={handleSetNow} className="font-medium">
          Today
        </Button>
      </Field>
    </div>
  )
}
