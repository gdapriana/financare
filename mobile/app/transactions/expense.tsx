import SubpageHeader from '@/components/layout/subpage-header';
import { ArrowLeft02FreeIcons } from '@hugeicons/core-free-icons';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Expense() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-4">
          <SubpageHeader
            title="New Expense"
            goBack={{ text: 'Cancel', icon: ArrowLeft02FreeIcons }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
