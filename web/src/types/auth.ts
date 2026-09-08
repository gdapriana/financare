import type { MediaAsset } from "@/types/media"

export type Role = "USER" | "ADMIN"

export interface User {
  id: string
  email: string
  display_name: string
  role: Role
  timezone: string
  currency_code: string
  created_at: string
  updated_at: string
}

export interface UserProfileResponse {
  user: User
  primary_profile_image: MediaAsset | null
}

export interface RegisterPayload {
  email: string
  password: string
  display_name: string
  timezone: string
}

export interface LoginPayload {
  email: string
  password: string
  device_name: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user?: User
}
