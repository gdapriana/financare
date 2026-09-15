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
import { useArchiveAccountMutation } from "@/hooks/use-accounts"

export default function ArchiveAccountAlert({
  acc,
  open,
}: {
  acc: Account
  open: { value: boolean; setValue: Dispatch<SetStateAction<boolean>> }
}) {
  const archiveMutation = useArchiveAccountMutation()

  const handleArchive = () => {
    archiveMutation.mutate(acc.id)
    open.setValue(false)
  }

  return (
    <AlertDialog open={open.value} onOpenChange={open.setValue}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive {acc.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            You can unarchive again on setting
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
