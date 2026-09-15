import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateAccountMutation } from "@/hooks/use-accounts"
import { showToast } from "@/lib/toast"
import { mockAccountType } from "@/mocks/accounts"
import { type AccountType } from "@/services/accounts.api"
import {
  useState,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react"

export default function NewAccountDialog({
  children,
}: {
  children: ReactNode
}) {
  const newAccountMutation = useCreateAccountMutation()
  const [name, setName] = useState<string>("")
  const [openingBalance, setOpeningBalance] = useState<number>(1)
  const [type, setType] = useState<AccountType>("BANK")
  const [insName, setInsName] = useState<string>()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name === "") {
      showToast({
        title: "Validation Error",
        description: "Please enter the name",
      })
      return
    }
    if (openingBalance === 0) {
      showToast({
        title: "Validation Error",
        description: "Opening balance cannot be 0",
      })
      return
    }

    newAccountMutation.mutate(
      {
        name,
        type,
        institution_name: insName,
        opening_balance: openingBalance,
      },
      {
        onSettled: () => {
          setDialogOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
      <DialogTrigger render={children as ReactElement} />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add new account</DialogTitle>
            <DialogDescription>
              Fill the form bellow to make new accounts, make transactions
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Account Name</FieldLabel>
              <Input
                id="name"
                required
                onChange={(e) => setName(() => e.target.value)}
                placeholder="e.g Primary Account"
                name="name"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="openingBalance">Opening Balance</FieldLabel>
              <Input
                id="openingBalance"
                required
                onChange={(e) =>
                  setOpeningBalance(() => Number(e.target.value))
                }
                placeholder="e.g 2000000"
                name="opening balance"
                type="number"
                min={1}
              />
            </Field>
            <Field orientation="horizontal">
              <Field>
                <FieldLabel htmlFor="insName">Institution Name</FieldLabel>
                <Input
                  placeholder="e.g BCA, BNI..."
                  onChange={(e) =>
                    setInsName(() =>
                      e.target.value === "" ? undefined : e.target.value
                    )
                  }
                  name="Institution Name"
                  id="insName"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="accType">Account type</FieldLabel>
                <Select
                  onValueChange={(val) => setType(val as AccountType)}
                  defaultValue={mockAccountType[0]}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mockAccountType.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-8">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
