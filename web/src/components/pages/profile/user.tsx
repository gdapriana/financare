import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMeQuery } from "@/hooks/use-auth"

export default function User() {
  const { data } = useMeQuery()
  const user = data?.user
  const avatarUrl = data?.primary_profile_image?.secureUrl

  return (
    <div className="container">
      <div className="flex w-full flex-col items-center justify-center gap-6 pt-16 pb-4">
        <Avatar className="h-20 w-20">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={user?.display_name} />
          ) : (
            <AvatarFallback>
              {user?.display_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col items-center justify-start gap-1">
          <h1 className="text-lg font-bold">{user?.display_name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  )
}
