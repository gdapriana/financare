import DayTransactions from '@/app/_components/calendar/day-transactions';
import MonthCalendar from '@/app/_components/calendar/month-calendar';
import { ScrollView, StyleSheet } from 'react-native';

export default function Calendar() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <MonthCalendar />
      <DayTransactions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 120,
  },
});
