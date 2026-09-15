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
  useUnarchiveAccountMutation,
} from "@/hooks/use-accounts"

export default function UnarchiveAccountAlert({
  acc,
  open,
}: {
  acc: Account
  open: { value: boolean; setValue: Dispatch<SetStateAction<boolean>> }
}) {
  const unarchiveMutation = useUnarchiveAccountMutation()

  const handleUnarchive = () => {
    unarchiveMutation.mutate(acc.id)
    open.setValue(false)
  }

  return (
    <AlertDialog open={open.value} onOpenChange={open.setValue}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Put back {acc.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            You can archive again whenever you want
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnarchive}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
