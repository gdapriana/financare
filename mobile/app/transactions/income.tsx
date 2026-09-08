import AccountInput from '@/app/transactions/_components/account-input';
import NameInput from '@/app/transactions/_components/name-input';
import ValueInput from '@/app/transactions/_components/value-input';
import SubpageHeader from '@/components/layout/subpage-header';
import { Transaction } from '@/types/transaction';
import { ArrowLeft02FreeIcons } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Income() {
  const [newTransaction, setNewTransaction] = useState<any>();
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="gap-4 p-4">
          <SubpageHeader
            title="New Income"
            goBack={{ text: 'Cancel', icon: ArrowLeft02FreeIcons }}
          />

          <ValueInput />
          <NameInput />
          <AccountInput />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
