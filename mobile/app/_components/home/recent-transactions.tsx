import SectionHeader from '@/components/layout/section-header';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn, formatToK, priceFormatter } from '@/lib/utils';
import { recentTransactions } from '@/mocks/recent-transactions';
import {
  ArrowRight02FreeIcons,
  Download03FreeIcons,
  Upload03FreeIcons,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';

export default function RecentTransactions() {
  return (
    <View className="gap-4 p-4">
      <SectionHeader
        title="Recent Transactions"
        cta={{ text: 'All Transactions', icon: ArrowRight02FreeIcons, url: '..' }}
      />

      <View className="items-stretch justify-start gap-4">
        {recentTransactions.map((item, idx: number) => (
          <TouchableOpacity key={idx} className="flex-row items-center justify-between">
            <View className="flex-row items-center justify-center gap-2">
              <View
                className={cn(
                  'h-12 w-12 items-center justify-center rounded-full',
                  item.type === 'INCOME' ? 'bg-primary' : 'bg-secondary'
                )}>
                <HugeiconsIcon
                  color={item.type === 'INCOME' ? THEME.light.background : ''}
                  icon={item.type === 'INCOME' ? Download03FreeIcons : Upload03FreeIcons}
                />
              </View>
              <View className="items-start justify-center gap-1">
                <Text numberOfLines={1} className="text-md" style={{ fontWeight: 600 }}>
                  {item.sourceName}
                </Text>
                <Text numberOfLines={1} className="text-muted-foreground text-xs">
                  {item.locationName} {moment(item.createdAt).fromNow()}
                </Text>
              </View>
            </View>
            <Text className={cn('text-sm', item.type === 'EXPENSE' && 'text-destructive')}>
              {item.type === 'INCOME' ? '+' : '-'}
              {priceFormatter.format(item.amount)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
