import { api } from "@/lib/axios"
import type { User } from "@/types/auth"
import type { MediaAsset } from "@/services/attachments.api"

export interface UserProfileData {
  user: User
  primary_profile_image: MediaAsset | null
}

export interface UpdatePreferencesInput {
  display_name?: string
  timezone?: string
  currency_code?: string
}

export interface UpdatePreferencesResponseData {
  user: User
}

export interface UpdateAvatarResponseData {
  avatar_url: string
  media_asset: MediaAsset
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const userApi = {
  getProfile: async (): Promise<UserProfileData> => {
    const res = await api.get<ApiResponse<UserProfileData>>("/me")
    return res.data.data
  },

  updatePreferences: async (payload: UpdatePreferencesInput): Promise<User> => {
    const res = await api.patch<ApiResponse<UpdatePreferencesResponseData>>(
      "/me",
      payload
    )
    return res.data.data.user
  },

  updateAvatar: async (
    input: File | string
  ): Promise<UpdateAvatarResponseData> => {
    if (input instanceof File) {
      const formData = new FormData()
      formData.append("file", input)

      const res = await api.post<ApiResponse<UpdateAvatarResponseData>>(
        "/users/me/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      return res.data.data
    } else {
      const res = await api.post<ApiResponse<UpdateAvatarResponseData>>(
        "/users/me/avatar",
        {
          media_asset_id: input,
        }
      )
      return res.data.data
    }
  },
}
