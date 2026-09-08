import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { priceFormatter } from '@/lib/utils';
import { Download03FreeIcons, Upload03FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { View } from 'react-native';

export default function IncomeOutcome() {
  const [income, setIncome] = useState<number>(20000);
  const [outcome, setOtcome] = useState<number>(20000);
  return (
    <View className="flex-row items-start justify-center gap-4 p-4 pt-0">
      <View className="bg-primary flex-1 gap-2 rounded-4xl p-6">
        <HugeiconsIcon size={24} icon={Download03FreeIcons} color={THEME.light.background} />
        <Text className="text-muted-foreground text-xs">Income this month</Text>
        <Text numberOfLines={1} className="text-background text-lg" style={{ fontWeight: 600 }}>
          {priceFormatter.format(income)}
        </Text>
      </View>
      <View className="bg-primary/10 flex-1 gap-2 rounded-4xl p-6">
        <HugeiconsIcon size={24} icon={Upload03FreeIcons} color={THEME.light.primary} />
        <Text className="text-accent-foreground text-xs">Income this month</Text>
        <Text numberOfLines={1} className="text-primary text-lg" style={{ fontWeight: 600 }}>
          {priceFormatter.format(outcome)}
        </Text>
      </View>
    </View>
  );
}
