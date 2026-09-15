import AccountCard from "@/components/card/account-card"
import { EmptyItem } from "@/components/empty"
import NewAccountDialog from "@/components/pages/accounts/new-account"
import { ItemGroup } from "@/components/ui/item"
import { useAccountsQuery } from "@/hooks/use-accounts"
import { Plus, UserAccountIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function Accounts() {
  const { data: accounts, isLoading: loadingAccounts } = useAccountsQuery()

  return (
    <div className="container">
      <ItemGroup className="mt-4 grid grid-cols-2 md:grid-cols-3">
        <NewAccountDialog>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-primary py-8">
            <HugeiconsIcon icon={Plus} size={20} className="text-background" />
            <h3 className="font-semibold text-background">Add account</h3>
          </div>
        </NewAccountDialog>
        {accounts?.accounts.map((acc, idx: number) => {
          if (!acc.is_archived) {
            return <AccountCard acc={acc} key={idx} withOptions />
          }
        })}
        {accounts?.accounts.map((acc, idx: number) => {
          if (acc.is_archived) {
            return <AccountCard archived acc={acc} key={idx} withOptions />
          }
        })}
      </ItemGroup>
    </div>
  )
}
