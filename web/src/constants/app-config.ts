import {
  Calendar01FreeIcons,
  GraphicCardFreeIcons,
  Home01FreeIcons,
  Home02FreeIcons,
  Home03FreeIcons,
  UserFreeIcons,
} from "@hugeicons/core-free-icons"

export const SITE_CONFIG = {
  name: "Financare",
  shortName: "Financare",
  description:
    "Solusi pintar pengelola keuangan pribadi dan bisnis Anda secara terstruktur dan aman.",
  url: "https://financare.app",
  ogImage: "https://financare.app/og.png",
  author: "Financare Team",
} as const

export const BRAND_CONFIG = {
  name: "Financare",
  tagline: "Smart Financial Care for Everyone",
  logo: "/vite.svg",
  supportEmail: "support@financare.app",
} as const

export const NAV_LINKS = [
  { label: "Home", href: "/", icon: Home03FreeIcons },
  { label: "Calendar", href: "/calendar", icon: Calendar01FreeIcons },
  { label: "Statistic", href: "/statistic", icon: GraphicCardFreeIcons },
  { label: "Profile", href: "/profile", icon: UserFreeIcons },
] as const

export const SOCIAL_LINKS = {
  github: "https://github.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
} as const

// Type exports untuk keamanan tipe data TypeScript
export type SiteConfig = typeof SITE_CONFIG
export type BrandConfig = typeof BRAND_CONFIG
export type NavLink = (typeof NAV_LINKS)[number]
