import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn, priceFormatter } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import {
  Download03FreeIcons,
  Edit01FreeIcons,
  Eye,
  Location03FreeIcons,
  Time02FreeIcons,
  Trash,
  Upload03FreeIcons,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import moment from 'moment';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TransactionDropdown({
  item,
  idx,
  itemLength,
}: {
  item: Transaction;
  idx: number;
  itemLength: number;
}) {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 100,
    right: 4,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Pressable className="flex-row items-center justify-center gap-2">
          <View className="h-full items-center">
            {idx !== 0 ? (
              <View className="bg-muted-foreground/20 w-1 flex-1" />
            ) : (
              <View className="bg-background w-1 flex-1" />
            )}
            <View className="bg-primary h-2 w-2 rounded-full" />
            {itemLength - 1 === idx ? (
              <View className="bg-background w-1 flex-1" />
            ) : (
              <View className="bg-muted-foreground/20 w-1 flex-1" />
            )}
          </View>
          <View className="flex-1 p-2">
            <View
              className={cn(
                'border-muted-foreground/20 flex-row items-center justify-center gap-3 rounded-3xl border p-4',
                item.type === 'INCOME' && 'bg-primary'
              )}>
              <View className="bg-muted-foreground/20 h-10 w-10 items-center justify-center rounded-full">
                <HugeiconsIcon
                  color={item.type === 'INCOME' ? THEME.light.background : THEME.light.primary}
                  icon={item.type === 'INCOME' ? Download03FreeIcons : Upload03FreeIcons}
                />
              </View>
              <View className="flex-1 items-start justify-center gap-1.5 overflow-hidden">
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: 600 }}
                  className={cn('', item.type === 'INCOME' ? 'text-background' : 'text-primary')}>
                  {item.sourceName}
                </Text>
                <Badge
                  className="mb-2 px-4"
                  variant={item.type === 'INCOME' ? 'secondary' : 'default'}>
                  <Text className={cn('text-sm')}>
                    {item.type === 'INCOME' ? '+' : '-'}
                    {priceFormatter.format(item.amount)}
                  </Text>
                </Badge>
                <View className="flex-1 flex-row gap-3">
                  {item.occurredAt && (
                    <View className="flex-row items-center justify-start gap-1">
                      <HugeiconsIcon
                        color={
                          item.type === 'INCOME' ? THEME.light.mutedForeground : THEME.light.primary
                        }
                        size={16}
                        icon={Time02FreeIcons}
                      />
                      <Text
                        className={cn(
                          'text-sm',
                          item.type === 'INCOME' ? 'text-muted-foreground' : 'text-muted-foreground'
                        )}
                        numberOfLines={1}>
                        {moment(item.occurredAt).format('hh:mm a')}
                      </Text>
                    </View>
                  )}

                  {item.locationName && (
                    <View className="flex-1 flex-row items-center justify-start gap-1">
                      <HugeiconsIcon
                        color={
                          item.type === 'INCOME' ? THEME.light.mutedForeground : THEME.light.primary
                        }
                        size={16}
                        icon={Location03FreeIcons}
                      />
                      <Text
                        className={cn(
                          'text-sm',
                          item.type === 'INCOME' ? 'text-muted-foreground' : 'text-muted-foreground'
                        )}
                        numberOfLines={1}>
                        {item.locationName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        insets={contentInsets}
        sideOffset={2}
        className="w-56 rounded-3xl p-4"
        align="start">
        <DropdownMenuItem className="justify-between">
          <Text>See Detail</Text>
          <HugeiconsIcon size={16} icon={Eye} />
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-between">
          <Text>Edit</Text>
          <HugeiconsIcon size={16} icon={Edit01FreeIcons} />
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" className="justify-between">
          <Text>Delete</Text>
          <HugeiconsIcon size={16} icon={Trash} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
