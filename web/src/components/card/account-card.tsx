import { Badge } from "@/components/ui/badge"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { cn, priceFormatter } from "@/lib/utils"
import type { Account } from "@/services/accounts.api"
import { useBalanceStore } from "@/store/balance-store"
import {
  Archive02FreeIcons,
  BankFreeIcons,
  Cash02FreeIcons,
  Edit02FreeIcons,
  EllipsisVerticalIcon,
  TrashFreeIcons,
  Wallet02FreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ArchiveAccountAlert from "@/components/pages/accounts/archive-account"
import { useState } from "react"
import UpdateAccountDialog from "@/components/pages/accounts/update-account"
import UnarchiveAccountAlert from "@/components/pages/accounts/unarchive-account"
import DeleteAccountAlert from "@/components/pages/accounts/delete-account"

export default function AccountCard({
  acc,
  withOptions,
  archived,
}: {
  acc: Account
  withOptions?: boolean
  archived?: boolean
}) {
  const currency = useBalanceStore((state) => state.currency)

  return (
    <Item
      variant="outline"
      className={cn(
        "flex-1",
        archived && acc.is_archived && "bg-secondary opacity-50"
      )}
    >
      <ItemContent className="flex flex-col">
        <div className="mb-5 flex items-start justify-between gap-2">
          <ItemTitle className="font-black">{acc.name}</ItemTitle>
          <Badge variant="secondary" className="ml-auto">
            <HugeiconsIcon
              icon={
                acc.type == "BANK"
                  ? BankFreeIcons
                  : acc.type === "CASH"
                    ? Cash02FreeIcons
                    : Wallet02FreeIcons
              }
            />
            {acc.type}
          </Badge>
          {withOptions && <Options acc={acc} archived={archived} />}
        </div>
        <ItemDescription className="mt-auto">
          <span className="text-xs text-muted-foreground/50">
            current balance
          </span>
          <h3 className="text-lg font-semibold text-primary">
            {priceFormatter(currency).format(acc.current_balance)}
          </h3>
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

const Options = ({ acc, archived }: { acc: Account; archived?: boolean }) => {
  const [archiveOpen, setArchiveOpen] = useState<boolean>(false)
  const [unarchiveOpen, setUnarchiveOpen] = useState<boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [updateOpen, setUpdateOpen] = useState<boolean>(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Badge className="cursor-pointer" variant="outline">
              <HugeiconsIcon icon={EllipsisVerticalIcon} />
            </Badge>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault()
                setUpdateOpen(true)
              }}
            >
              <HugeiconsIcon icon={Edit02FreeIcons} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant={archived ? "default" : "destructive"}
              onClick={(e) => {
                e.preventDefault()
                if (archived) setUnarchiveOpen(true)
                else setArchiveOpen(true)
              }}
            >
              <HugeiconsIcon icon={Archive02FreeIcons} />
              {archived ? "Unarchived" : "Archive"}
            </DropdownMenuItem>
            {archived && (
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault()
                  setDeleteOpen(true)
                }}
              >
                <HugeiconsIcon icon={TrashFreeIcons} />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ArchiveAccountAlert
        acc={acc}
        open={{ value: archiveOpen, setValue: setArchiveOpen }}
      />
      <UpdateAccountDialog
        acc={acc}
        open={{ value: updateOpen, setValue: setUpdateOpen }}
      />
      <UnarchiveAccountAlert
        acc={acc}
        open={{ value: unarchiveOpen, setValue: setUnarchiveOpen }}
      />
      <DeleteAccountAlert
        acc={acc}
        open={{ value: deleteOpen, setValue: setDeleteOpen }}
      />
    </>
  )
}
