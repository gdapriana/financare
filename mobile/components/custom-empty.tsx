import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { FileNotFoundFreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { View } from 'react-native';

type EmptyType = {
  title: string;
  icon?: IconSvgElement;
  description?: string;
  cta?: {
    text: string;
    icon?: IconSvgElement;
    url: RelativePathString;
  };
};

export default function CustomEmpty({
  title,
  cta,
  description,
  icon = FileNotFoundFreeIcons,
}: EmptyType) {
  const router = useRouter();
  return (
    <View className="items-center justify-center gap-2 p-8">
      <HugeiconsIcon size={30} icon={icon} />
      <Text variant="h4" style={{ maxWidth: 200 }} className="max-w-sm text-center text-base">
        {title}
      </Text>
      {cta && (
        <Button onPress={() => router.push(cta.url)} className="mt-4">
          {cta.icon && <HugeiconsIcon size={18} color={THEME.light.background} icon={cta.icon} />}
          <Text>{cta.text}</Text>
        </Button>
      )}
    </View>
  );
}
