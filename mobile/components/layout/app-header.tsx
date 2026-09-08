import React from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { usePathname } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Bell } from '@hugeicons/core-free-icons';
import { authenticatedUser } from '@/mocks/authenticated-user';

const HIDDEN_ON = ['/profile', '/transactions'];
const DURATION = 260;

export function AppHeader() {
  const pathname = usePathname();
  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));

  // rendered = apakah komponen masih ada di tree sama sekali
  const [rendered, setRendered] = React.useState(!hidden);

  const translateY = useSharedValue(hidden ? -80 : 0);
  const opacity = useSharedValue(hidden ? 0 : 1);

  React.useEffect(() => {
    if (hidden) {
      // animasikan keluar dulu, baru unmount (display:none) setelah selesai
      translateY.value = withTiming(-80, {
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, { duration: DURATION - 60 }, (finished) => {
        if (finished) runOnJS(setRendered)(false);
      });
    } else {
      // mount dulu, baru animasikan masuk
      setRendered(true);
      translateY.value = -80;
      opacity.value = 0;
      translateY.value = withTiming(0, {
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, { duration: DURATION });
    }
  }, [hidden]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!rendered) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className="mt-16 w-full flex-row items-center justify-between p-4">
      <View className="flex-row items-center justify-center gap-4">
        <View>
          <Image
            className="h-12 w-12 rounded-full"
            source={{ uri: authenticatedUser.avatarUrl ?? '' }}
            width={200}
            height={200}
          />
        </View>
        <View className="items-start justify-center">
          <Text className="text-muted-foreground text-sm">Hello 👋</Text>
          <Text style={{ fontWeight: 800 }} className="text-base font-bold">
            {authenticatedUser.displayName}
          </Text>
        </View>
      </View>
      <Button size="icon" variant="ghost">
        <HugeiconsIcon icon={Bell} />
      </Button>
    </Animated.View>
  );
}
