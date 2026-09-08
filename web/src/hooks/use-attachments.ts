import { attachmentsApi } from "@/services/attachments.api"
import { useMutation } from "@tanstack/react-query"

export function useUploadAttachmentsMutation() {
  return useMutation({
    mutationFn: attachmentsApi.uploadFiles,
  })
}

export function useCancelAttachmentsMutation() {
  return useMutation({
    mutationFn: attachmentsApi.cancelFiles,
  })
}
