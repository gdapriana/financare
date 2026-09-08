import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import TotalBalance from '@/app/_components/home/total-balance';
import IncomeOutcome from '@/app/_components/home/income-outcome';
import RecentTransactions from '@/app/_components/home/recent-transactions';

export default function Homepage() {
  return (
    <ScrollView>
      <TotalBalance />
      <IncomeOutcome />
      <RecentTransactions />
    </ScrollView>
  );
}
