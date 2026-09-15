import AccountCard from "@/components/card/account-card"
import { EmptyItem } from "@/components/empty"
import SectionHeader from "@/components/section-header"
import { ItemGroup } from "@/components/ui/item"
import { useAccountsQuery } from "@/hooks/use-accounts"
import {
  ArrowRight01FreeIcons,
  Plus,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"

export default function Accounts() {
  const { data: accounts, isLoading: loadingAccounts } = useAccountsQuery()

  if (loadingAccounts) return <div className="container">Loading...</div>
  if (
    !loadingAccounts &&
    accounts &&
    accounts.accounts &&
    accounts.accounts.length === 0
  )
    return (
      <div className="container">
        <EmptyItem
          title="No accounts"
          description="Add some account to make any transaction"
          icon={UserAccountIcon}
          cta={{ icon: Plus, text: "Add account", actions: () => {} }}
        />
      </div>
    )

  if (!loadingAccounts && accounts && accounts.accounts)
    return (
      <div className="container">
        <SectionHeader
          title="Accounts"
          cta={{
            icon: ArrowRight01FreeIcons,
            text: "All Accounts",
            url: "/accounts",
          }}
        />
        <ItemGroup className="mt-4 grid grid-cols-2 md:grid-cols-3">
          {accounts?.accounts.slice(0, 3).map((acc, idx: number) => (
            <AccountCard acc={acc} key={idx} />
          ))}
        </ItemGroup>
      </div>
    )
}
