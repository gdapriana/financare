import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { ProfileMenuType } from '@/types/profile-menu';
import {
  ArrowRight01FreeIcons,
  LockSync02FreeIcons,
  Logout03FreeIcons,
  Moon02Icon,
  Notification03FreeIcons,
  PrisonGuardFreeIcons,
  User02FreeIcons,
  Wallet03FreeIcons,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

const profileMenu: ProfileMenuType = [
  {
    title: 'Personal Informations',
    subMenu: [
      { title: 'Manage Profile', icon: User02FreeIcons, url: '..' },
      { title: 'Change Password', icon: LockSync02FreeIcons, url: '..' },
      { title: 'Privacy', icon: PrisonGuardFreeIcons, url: '..' },
      { title: 'Payment Methods', icon: Wallet03FreeIcons, url: '..' },
    ],
  },
  {
    title: 'Settings',
    subMenu: [
      { title: 'Dark Mode', icon: Moon02Icon },
      { title: 'Notification', icon: Notification03FreeIcons },
    ],
  },
];

export default function Menu() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  return (
    <View className="gap-4 p-4 pb-60">
      {profileMenu.map((menu, idx: number) => (
        <View key={idx} className="bg-secondary rounded-4xl p-8">
          <Text
            className="text-muted-foreground/30 mb-4 text-xs uppercase"
            style={{ fontWeight: 600 }}>
            {menu.title}
          </Text>
          {menu.subMenu && menu.subMenu.length > 0 && (
            <View className="gap-2">
              {menu.subMenu.map((sub, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  className="flex-row items-center justify-between gap-4 py-2">
                  {sub.icon && <HugeiconsIcon icon={sub.icon} size={18} />}
                  <Text className="flex-1 text-sm">{sub.title}</Text>

                  {(() => {
                    switch (sub.title) {
                      case 'Dark Mode':
                        return <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />;
                      default:
                        return (
                          <HugeiconsIcon
                            size={16}
                            color={THEME.light.primary}
                            icon={ArrowRight01FreeIcons}
                          />
                        );
                    }
                  })()}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      <Button size="lg" variant="secondary">
        <Text>Sign Out</Text>
        <HugeiconsIcon size={16} color={THEME.light.primary} icon={Logout03FreeIcons} />
      </Button>
    </View>
  );
}
