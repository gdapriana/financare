import { Text } from '@/components/ui/text';
import { View, TextInput } from 'react-native';

export default function ValueInput() {
  return (
    <View className="flex items-center justify-center py-16">
      <View className="flex-row items-end gap-4">
        <Text className="text-2xl" variant="h1">
          Rp.
        </Text>
        <TextInput
          style={{ fontFamily: 'Poppins_100Thin' }}
          placeholder="Input Nominal"
          className="text-2xl font-bold"
        />
      </View>
    </View>
  );
}
