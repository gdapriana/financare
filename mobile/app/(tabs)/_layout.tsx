import CustomNavBar from '@/components/custom-tab';
import { Tabs } from 'expo-router';

export default function _layout() {
  return (
    <Tabs detachInactiveScreens={false} tabBar={(props) => <CustomNavBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{ animation: 'shift', title: 'Home', headerShown: false }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ animation: 'shift', title: 'Calendar', headerShown: false }}
      />
      <Tabs.Screen
        name="statistic"
        options={{ animation: 'shift', title: 'Statistic', headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ animation: 'shift', title: 'Profile', headerShown: false }}
      />
    </Tabs>
  );
}
