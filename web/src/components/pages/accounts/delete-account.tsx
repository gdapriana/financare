import type { Account } from "@/services/accounts.api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Dispatch, SetStateAction } from "react"
import {
  useArchiveAccountMutation,
  useDeleteAccountMutation,
} from "@/hooks/use-accounts"
import { useTransactionsQuery } from "@/hooks/use-transactions"

export default function DeleteAccountAlert({
  acc,
  open,
}: {
  acc: Account
  open: { value: boolean; setValue: Dispatch<SetStateAction<boolean>> }
}) {
  const deleteMutation = useDeleteAccountMutation()
  const { data: transactions, isLoading } = useTransactionsQuery({
    account_id: acc.id,
  })

  const handleDelete = () => {
    deleteMutation.mutate(acc.id)
    open.setValue(false)
  }

  return (
    <AlertDialog open={open.value} onOpenChange={open.setValue}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {acc.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {!isLoading &&
              (transactions &&
              transactions.transactions &&
              transactions.transactions.length > 0
                ? `There are ${transactions.transactions.length} transactions in this account, also deleted`
                : "No transaction yet in this account")}
            . This action cannot be undo!.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
