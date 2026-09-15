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
import {
  useCreateAccountMutation,
  useGetAccountByIdQuery,
  useUpdateAccountMutation,
} from "@/hooks/use-accounts"
import { showToast } from "@/lib/toast"
import { mockAccountType } from "@/mocks/accounts"
import { type Account, type AccountType } from "@/services/accounts.api"
import {
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react"

export default function UpdateAccountDialog({
  acc,
  open,
}: {
  acc: Account
  open: { value: boolean; setValue: Dispatch<SetStateAction<boolean>> }
}) {
  const [name, setName] = useState<string>("")
  const [openingBalance, setOpeningBalance] = useState<number>(1)
  const [type, setType] = useState<AccountType>("BANK")
  const [insName, setInsName] = useState<string | null>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { data: account } = useGetAccountByIdQuery(acc.id)
  const updateAccountMutation = useUpdateAccountMutation()

  useEffect(() => {
    if (account) {
      setName(account.name)
      setOpeningBalance(account.opening_balance)
      setType(acc.type)
      setInsName(acc.institution_name)
    }
  }, [account])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (name === "") {
      showToast({
        title: "Validation Error",
        description: "Please enter the name",
      })
      return
    }

    updateAccountMutation.mutate(
      {
        id: acc.id,
        payload: {
          name,
          institution_name: insName,
        },
      },
      {
        onSettled: () => {
          setIsSubmitting(false)
          open.setValue(false)
        },
      }
    )
  }

  return (
    <Dialog open={open.value} onOpenChange={open.setValue}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update account</DialogTitle>
            <DialogDescription>
              Fill the form bellow to make new accounts, make transactions
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Account Name</FieldLabel>
              <Input
                id="name"
                disabled={isSubmitting}
                required
                defaultValue={name}
                onChange={(e) => setName(() => e.target.value)}
                placeholder="e.g Primary Account"
                name="name"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="openingBalance">Opening Balance</FieldLabel>
              <Input
                id="openingBalance"
                disabled
                defaultValue={openingBalance}
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
                  defaultValue={insName ?? ""}
                  disabled={isSubmitting}
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
                  defaultValue={type}
                  disabled={isSubmitting}
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
            <DialogClose
              disabled={isSubmitting}
              render={<Button variant="outline">Cancel</Button>}
            />

            <Button disabled={isSubmitting} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
