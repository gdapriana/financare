"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Apple, GoogleIcon } from "@hugeicons/core-free-icons"
import { showToast, templateToastComingSoon } from "@/lib/toast"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to {SITE_CONFIG.name}</h1>
            <FieldDescription>
              Already have an account? <Link to="/login">Sign in</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
            <Input
              id="displayName"
              type="text"
              placeholder="John Doe"
              required
            />
          </Field>
          <Field orientation="horizontal">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="*********"
                required
              />
            </Field>
          </Field>
          <Field>
            <Button type="submit">Create Account</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              onClick={() =>
                showToast({
                  ...templateToastComingSoon,
                  description: null,
                  title: "Signup with apple coming soon!",
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
                  title: "Signup with google coming soon!",
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
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
