import { Text } from '@/components/ui/text';
import { authenticatedUser } from '@/mocks/authenticated-user';
import { View, Image } from 'react-native';

export default function User() {
  return (
    <View className="items-center justify-center gap-2 px-4 py-12">
      <View className="bg-primary h-20 w-20 overflow-hidden rounded-full">
        <Image
          source={{ uri: authenticatedUser.avatarUrl || '' }}
          alt="profile"
          className="h-full w-full"
          width={200}
          height={200}
        />
      </View>
      <View className="items-center justify-center gap-0.5">
        <Text variant="h1" className="text-lg" style={{ fontWeight: 700 }} numberOfLines={2}>
          {authenticatedUser.displayName}
        </Text>
        <Text className="text-muted-foreground text-sm">{authenticatedUser.email}</Text>
      </View>
    </View>
  );
}
