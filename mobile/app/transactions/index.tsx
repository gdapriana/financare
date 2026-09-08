import SubpageHeader from '@/components/layout/subpage-header';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  ArrowLeft02FreeIcons,
  Download03FreeIcons,
  Upload03FreeIcons,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transactions() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <View style={{}} className="h-screen-safe gap-4 p-4">
        <SubpageHeader
          title="New Transaction"
          goBack={{ text: 'Cancel', icon: ArrowLeft02FreeIcons }}
        />
        <View className="flex-1 gap-4" style={{ paddingBottom: 60 }}>
          <TouchableOpacity
            onPress={() => router.push('/transactions/income')}
            className="bg-primary flex-1 items-center justify-center gap-2 rounded-[3rem] p-4">
            <HugeiconsIcon size={40} icon={Download03FreeIcons} color={THEME.light.background} />
            <Text variant="h3" style={{ fontWeight: 800 }} className="text-background text-lg">
              New Income
            </Text>
            <Text className="text-muted-foreground max-w-2/3 text-center">
              Salary, Freelance, Pasif income etc...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/transactions/expense')}
            className="bg-secondary border-muted-foreground/20 flex-1 items-center justify-center gap-2 rounded-[3rem] border p-4">
            <HugeiconsIcon size={40} icon={Upload03FreeIcons} color={THEME.light.primary} />
            <Text variant="h3" style={{ fontWeight: 800 }} className="text-lg">
              New Expense
            </Text>
            <Text className="text-muted-foreground max-w-2/3 text-center">
              Shopping, coffee, payment needed etc...
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
