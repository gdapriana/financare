import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react-native';
import { THEME } from '@/lib/theme';
import { useRouter } from 'expo-router';

type SubPageHeaderType = {
  title: string;
  goBack?: {
    text?: string;
    icon?: IconSvgElement;
  };
};

export default function SubpageHeader({ title, goBack }: SubPageHeaderType) {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View className="flex-row items-center justify-between">
      {goBack && (
        <Button onPress={handleGoBack} size="sm" variant="secondary">
          {goBack.icon && (
            <HugeiconsIcon color={THEME.light.primary} size={18} icon={goBack.icon} />
          )}
          {goBack.text && <Text>{goBack.text}</Text>}
        </Button>
      )}
      <Text variant="h1" className="text-base" style={{ fontWeight: 700 }}>
        {title}
      </Text>
    </View>
  );
}
