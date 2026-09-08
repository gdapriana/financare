import { Button } from "@/components/ui/button"
import type { ProfileMenuType } from "@/types/profile-menu"
import {
  ArrowRight01FreeIcons,
  LockSync02FreeIcons,
  Moon02Icon,
  Notification03FreeIcons,
  PrisonGuardFreeIcons,
  User02FreeIcons,
  Wallet03FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router"

const profileMenu: ProfileMenuType = [
  {
    title: "Personal Informations",
    subMenu: [
      { title: "Manage Profile", icon: User02FreeIcons, url: ".." },
      { title: "Change Password", icon: LockSync02FreeIcons, url: ".." },
      { title: "Privacy", icon: PrisonGuardFreeIcons, url: ".." },
      { title: "Payment Methods", icon: Wallet03FreeIcons, url: ".." },
    ],
  },
  {
    title: "Settings",
    subMenu: [
      { title: "Dark Mode", icon: Moon02Icon },
      { title: "Notification", icon: Notification03FreeIcons },
    ],
  },
]

export default function ProfileMenu() {
  return (
    <div className="container">
      <div className="mx-auto flex max-w-lg flex-col items-stretch justify-start gap-4">
        {profileMenu.map((menu, idx: number) => (
          <div className="rounded-4xl bg-secondary p-8" key={idx}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              {menu.title}
            </h3>
            {menu.subMenu && menu.subMenu?.length > 0 && (
              <div className="mt-2 flex flex-col items-stretch justify-start">
                {menu.subMenu.map((sub, idx: number) => (
                  <Link
                    key={idx}
                    to="/"
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    {sub.icon && <HugeiconsIcon icon={sub.icon} />}
                    <span className="flex-1">{sub.title}</span>
                    <HugeiconsIcon icon={ArrowRight01FreeIcons} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <Button size="lg">Log Out</Button>
      </div>
    </div>
  )
}
