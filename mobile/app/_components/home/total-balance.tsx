import { View } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Dots,
  EyeClosedFreeIcons,
  EyeFreeIcons,
  PlusIcon,
  TransactionFreeIcons,
} from '@hugeicons/core-free-icons';
import { THEME } from '@/lib/theme';
import { priceFormatter } from '@/lib/utils';
import { useRouter } from 'expo-router';

export default function TotalBalance() {
  const [currentBalance, setCurrentBalance] = useState<number>(2000000);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const router = useRouter();
  return (
    <View className="p-4">
      <View className="bg-primary rounded-4xl p-6">
        <View className="flex-row items-center justify-between">
          <View className="items-start justify-start gap-2">
            <Text className="text-background/50 text-sm">Total Balance</Text>
            {hideBalance ? (
              <HugeiconsIcon icon={Dots} color={THEME.light.background} />
            ) : (
              <Text
                style={{ fontWeight: '800' }}
                variant={'h1'}
                numberOfLines={1}
                className="text-background text-2xl">
                {priceFormatter.format(currentBalance)}
              </Text>
            )}
          </View>
          <Button onPress={() => setHideBalance(!hideBalance)} variant="default" size="icon">
            <HugeiconsIcon
              color={THEME.light.background}
              icon={hideBalance ? EyeClosedFreeIcons : EyeFreeIcons}
            />
          </Button>
        </View>

        <View className="mt-6 flex-row gap-2">
          <Button
            onPress={() => router.push('/transactions')}
            size="lg"
            variant="default"
            className="bg-background flex-1">
            <HugeiconsIcon size={20} icon={PlusIcon} />
            <Text className="text-primary">Transaction</Text>
          </Button>
          <Button size="lg" variant="secondary" className="bg-background/10 flex-1">
            <HugeiconsIcon size={20} icon={TransactionFreeIcons} color={THEME.light.background} />
            <Text className="text-background">Transfer</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
