import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { View } from 'react-native';

type SectionHeader = {
  title: string;
  cta?: {
    text: string;
    icon: IconSvgElement;
    url: RelativePathString;
  };
};

export default function SectionHeader({ title, cta }: SectionHeader) {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="h3" className="text-lg" style={{ fontWeight: 600 }}>
        {title}
      </Text>
      {cta && (
        <Button size="sm" onPress={() => router.push(cta.url)} variant="link">
          <Text className="text-sm">{cta.text}</Text>
          <HugeiconsIcon size={16} icon={cta.icon} />
        </Button>
      )}
    </View>
  );
}
