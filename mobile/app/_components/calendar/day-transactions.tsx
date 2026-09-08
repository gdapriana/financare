import { useCalendarStore } from '@/stores/calendar-store';
import CustomEmpty from '@/components/custom-empty';
import SectionHeader from '@/components/layout/section-header';
import { mockTransactions } from '@/mocks/transactions';
import { Transaction } from '@/types/transaction';
import { PlusIcon } from '@hugeicons/core-free-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TransactionDropdown } from '@/app/_components/calendar/transaction-dropdown';

export default function DayTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const selectedDate = useCalendarStore((state) => state.selectedDateKey);

  useEffect(() => {
    if (selectedDate) {
      setTransactions(() => {
        return mockTransactions
          .filter((trans) => moment(trans.occurredAt).format('YYYY-MM-DD') === selectedDate)
          .sort(
            (firstTransaction, secondTransaction) =>
              moment(secondTransaction.occurredAt).valueOf() -
              moment(firstTransaction.occurredAt).valueOf()
          );
      });
    }
  }, [selectedDate]);

  return (
    <View className="p-4">
      {transactions.length !== 0 && (
        <SectionHeader
          title={`Transaction on ${moment(selectedDate).format('MMM DD')}`}
          cta={{ text: 'Add', icon: PlusIcon, url: '../' }}
        />
      )}
      <View>
        {transactions.length > 0 &&
          transactions.map((item, idx: number) => (
            <TransactionDropdown key={idx} idx={idx} item={item} itemLength={transactions.length} />
          ))}
        {transactions && transactions.length === 0 && (
          <CustomEmpty
            title={`No transaction on ${moment(selectedDate).format('dddd, D MMM YYYY')}`}
            cta={{ text: 'Add Transaction', icon: PlusIcon, url: '../' }}
          />
        )}
      </View>
    </View>
  );
}
