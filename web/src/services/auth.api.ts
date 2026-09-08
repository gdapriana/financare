import { api } from "@/lib/axios"
import type {
  User,
  LoginPayload,
  RegisterPayload,
  UserProfileResponse,
} from "@/types/auth"

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    tokens: {
      access_token: string
      token_type: string
      expires_in: number
    }
  }
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", payload)
    return res.data
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", payload)
    return res.data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
  },

  getMe: async (): Promise<UserProfileResponse> => {
    const res = await api.get("/me")
    return res.data.data.user
  },
}
