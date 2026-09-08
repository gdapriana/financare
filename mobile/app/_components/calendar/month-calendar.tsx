import DayCalendar from '@/app/_components/calendar/day-calendar';
import { useCalendarStore } from '@/stores/calendar-store';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  addMonths,
  createMonthGrid,
  formatMonthYear,
  getDateKey,
  isSameDay,
  startOfMonth,
} from '@/lib/utils';
import {
  ArrowLeft01FreeIcons,
  ArrowRight01FreeIcons,
  Calendar02FreeIcons,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { mockTransactions } from '@/mocks/transactions';
import moment from 'moment';

export default function MonthCalendar() {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const selectedDateKey = useCalendarStore((state) => state.selectedDateKey);
  const selectDate = useCalendarStore((state) => state.selectDate);
  const today = new Date();
  const monthDays = useMemo(() => createMonthGrid(visibleMonth), [visibleMonth]);

  function showPreviousMonth() {
    setVisibleMonth((currentMonth) => addMonths(currentMonth, -1));
  }

  function showNextMonth() {
    setVisibleMonth((currentMonth) => addMonths(currentMonth, 1));
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between p-4">
        <Button
          accessibilityLabel="Show previous month"
          onPress={showPreviousMonth}
          variant="secondary"
          size="icon">
          <HugeiconsIcon icon={ArrowLeft01FreeIcons} />
        </Button>
        <Button variant="ghost" size="sm">
          <HugeiconsIcon icon={Calendar02FreeIcons} size={16} />
          <Text className="text-sm">{formatMonthYear(visibleMonth)}</Text>
        </Button>
        <Button
          accessibilityLabel="Show next month"
          onPress={showNextMonth}
          variant="secondary"
          size="icon">
          <HugeiconsIcon icon={ArrowRight01FreeIcons} />
        </Button>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysScroll}
        contentContainerStyle={styles.daysContent}>
        {monthDays.map((date, idx: number) => {
          return (
            <DayCalendar
              key={date ? getDateKey(date) : `empty-${idx}`}
              date={date}
              isToday={date ? isSameDay(date, today) : false}
              isSelected={date ? getDateKey(date) === selectedDateKey : false}
              onPress={(pressedDate) => {
                selectDate(getDateKey(pressedDate));
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  daysScroll: {
    flexGrow: 0,
    flexShrink: 0,
    minHeight: 64,
  },
  daysContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
  },
});
