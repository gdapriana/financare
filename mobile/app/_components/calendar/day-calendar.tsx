type CalendarDayProps = {
  date: Date | null;
  isToday: boolean;
  isSelected: boolean;
  onPress: (date: Date) => void;
};

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { mockTransactions } from '@/mocks/transactions';
import moment from 'moment';
import { View } from 'react-native';

export default function DayCalendar({ date, isToday, isSelected, onPress }: CalendarDayProps) {
  if (!date) return null;

  const hasIncome =
    mockTransactions.filter((item) => {
      return (
        item.type === 'INCOME' &&
        moment(item.occurredAt).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
      );
    }).length > 0;

  const hasExpenses =
    mockTransactions.filter((item) => {
      return (
        item.type === 'EXPENSE' &&
        moment(item.occurredAt).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
      );
    }).length > 0;

  return (
    <View className="items-center">
      <Button
        size="icon"
        variant={isSelected ? 'default' : 'secondary'}
        className={cn('', isToday && 'border')}
        onPress={() => onPress(date)}>
        <Text>{date.getDate()}</Text>
      </Button>
      {(hasIncome || hasExpenses) && (
        <View className="flex-row items-center justify-center gap-1">
          {hasIncome && <Text className="text-primary">●</Text>}
          {hasExpenses && <Text className="text-muted-foreground">●</Text>}
        </View>
      )}
    </View>
  );
}
