import { IconSvgElement } from '@hugeicons/react-native';
import { RelativePathString } from 'expo-router';

export type ProfileMenuType = {
  title: string;
  icon?: IconSvgElement;
  subMenu?: {
    title: string;
    url?: RelativePathString;
    icon?: IconSvgElement;
  }[];
}[];
