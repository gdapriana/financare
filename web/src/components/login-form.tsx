import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"
import { SITE_CONFIG } from "@/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { Apple, GoogleIcon } from "@hugeicons/core-free-icons"
import { showToast, templateToastComingSoon } from "@/lib/toast"
import { useState } from "react"
import { useLoginMutation } from "@/hooks/use-auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useLoginMutation()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      showToast({
        title: "Validation Error",
        description: "Please enter both email and password.",
      })
      return
    }
    loginMutation.mutate({
      email: email.trim(),
      password,
      device_name: "Iphone 15 Pro Max",
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-5" />
            </div>
            <h1 className="text-xl font-bold">Welcome to {SITE_CONFIG.name}</h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              required
            />
          </Field>
          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <>Logging in...</> : "Login"}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() =>
                showToast({
                  ...templateToastComingSoon,
                  description: null,
                  title: "Signin with Apple coming soon!",
                })
              }
              variant="outline"
              type="button"
            >
              <HugeiconsIcon icon={Apple} />
              With Apple
            </Button>
            <Button
              onClick={() =>
                showToast({
                  ...templateToastComingSoon,
                  description: null,
                  title: "Signin with Google coming soon!",
                })
              }
              variant="outline"
              type="button"
            >
              <HugeiconsIcon icon={GoogleIcon} />
              With Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  )
}
