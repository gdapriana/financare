import { ScrollView, View } from 'react-native';
import User from '@/app/_components/profile/user';
import { SafeAreaView } from 'react-native-safe-area-context';
import Menu from '@/app/_components/profile/menu';

export default function Profile() {
  return (
    <SafeAreaView>
      <ScrollView className="h-screen-safe">
        <View>
          <User />
          <Menu />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
