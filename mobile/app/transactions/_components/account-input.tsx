import { mockAccounts } from '@/mocks/accounts';
import { authenticatedUser } from '@/mocks/authenticated-user';
import { Account } from '@/types/account';
import { View, Text } from 'react-native';

export default function AccountInput() {
  const activeAccounts: Account[] = mockAccounts.filter(
    (acc) => acc.userId === authenticatedUser.id
  );
  return (
    <View className="">
      {}
      <Text>AccountInput</Text>
    </View>
  );
}
