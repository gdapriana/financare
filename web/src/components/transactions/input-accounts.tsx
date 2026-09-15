import { EmptyItem } from "@/components/empty"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { priceFormatter } from "@/lib/utils"
import type { Account } from "@/services/accounts.api"
import { useBalanceStore } from "@/store/balance-store"
import {
  PlusFreeIcons,
  WalletNotFound01FreeIcons,
} from "@hugeicons/core-free-icons"
import React, { type Dispatch, type SetStateAction } from "react"
import { useNavigate } from "react-router"

export default function InputAccounts({
  accountId,
  accounts,
}: {
  accountId: { value: string; setValue: Dispatch<SetStateAction<string>> }
  accounts: { accounts?: Account[]; loadingAccounts: boolean }
}) {
  const currency = useBalanceStore((state) => state.currency)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!accountId.value && accounts.accounts && accounts.accounts.length > 0) {
      const firstActive = accounts.accounts.find((acc) => !acc.is_archived)
      if (firstActive) {
        accountId.setValue(firstActive.id)
      }
    }
  }, [accounts.accounts, accountId])

  return (
    <Field>
      <FieldLabel>Accounts</FieldLabel>
      {accounts.loadingAccounts && (
        <div className="flex items-center justify-center p-20">
          <Spinner />
        </div>
      )}
      {!accounts.loadingAccounts &&
        accounts &&
        accounts.accounts &&
        accounts.accounts.length > 0 && (
          <RadioGroup
            value={accountId.value}
            onValueChange={(e) => accountId.setValue(e)}
          >
            {accounts.accounts.map((acc, idx: number) => {
              if (!acc.is_archived) {
                return (
                  <FieldLabel htmlFor={acc.id} key={idx}>
                    <Field orientation="horizontal">
                      <FieldContent className="gap-2">
                        <FieldTitle>{acc.institution_name}</FieldTitle>
                        <Badge>
                          {priceFormatter(currency).format(acc.current_balance)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {acc.type}
                        </p>
                      </FieldContent>
                      <RadioGroupItem value={acc.id} id={acc.id} />
                    </Field>
                  </FieldLabel>
                )
              }
            })}
          </RadioGroup>
        )}

      {!accounts.loadingAccounts &&
        accounts &&
        accounts.accounts &&
        accounts.accounts.length > 0 &&
        accounts.accounts.filter((acc) => acc.is_archived === true).length ===
          accounts.accounts.length && (
          <EmptyItem
            title="No Accounts Available"
            icon={WalletNotFound01FreeIcons}
            cta={{
              text: "Create Account",
              icon: PlusFreeIcons,
              actions: () => navigate("/accounts/add"),
            }}
            description="Make sure you have or unarchived accounts"
          />
        )}

      {!accounts.loadingAccounts &&
        accounts &&
        accounts.accounts &&
        accounts.accounts.length === 0 && (
          <EmptyItem
            title="No Accounts Available"
            icon={WalletNotFound01FreeIcons}
            cta={{
              text: "Create Account",
              icon: PlusFreeIcons,
              actions: () => navigate("/accounts/add"),
            }}
            description="You currently have no account yet. create one"
          />
        )}
    </Field>
  )
}
