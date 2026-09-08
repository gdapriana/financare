import { api } from "@/lib/axios"
import type { User } from "@/types/user"

export interface MediaAsset {
  id: string
  owner_user_id: string
  provider: "CLOUDINARY"
  provider_asset_id: string | null
  public_id: string
  resource_type: string
  delivery_type: string
  format: string | null
  original_filename: string
  mime_type: string
  bytes: number | null
  width: number | null
  height: number | null
  version: number | null
  etag: string | null
  secure_url: string
  status:
    | "PENDING"
    | "UPLOADED"
    | "ATTACHED"
    | "DELETE_PENDING"
    | "DELETED"
    | "FAILED"
  upload_expires_at: string
  uploaded_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface UploadAttachmentsResponseData {
  media_asset?: MediaAsset
  media_assets: MediaAsset[]
}

export interface CancelAttachmentsResponseData {
  cancelled_count: number
}

export interface PresignedUploadUrlInput {
  filename: string
  mime_type: string
  size_bytes: number
}

export interface PresignedUploadUrlResponseData {
  media_asset_id: string
  upload_url: string
  fields: Record<string, any>
  expires_at: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const attachmentsApi = {
  uploadFiles: async (
    files: File[]
  ): Promise<UploadAttachmentsResponseData> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    const res = await api.post<ApiResponse<UploadAttachmentsResponseData>>(
      "/attachments/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return res.data.data
  },

  cancelFiles: async (
    attachmentIds: string[]
  ): Promise<CancelAttachmentsResponseData> => {
    const res = await api.post<ApiResponse<CancelAttachmentsResponseData>>(
      "/attachments/cancel",
      {
        attachment_ids: attachmentIds,
      }
    )
    return res.data.data
  },

  deleteById: async (id: string): Promise<void> => {
    await api.delete(`/attachments/${id}`)
  },

  getUploadUrl: async (
    payload: PresignedUploadUrlInput
  ): Promise<PresignedUploadUrlResponseData> => {
    const res = await api.post<ApiResponse<PresignedUploadUrlResponseData>>(
      "/attachments/upload-url",
      payload
    )
    return res.data.data
  },
}
