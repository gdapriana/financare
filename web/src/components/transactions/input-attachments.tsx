import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Cancel01FreeIcons,
  Delete02FreeIcons,
  File01FreeIcons,
  Image01FreeIcons,
  Upload03FreeIcons,
  ViewFreeIcons,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import React, { type Dispatch, type SetStateAction, useRef, useState } from "react"

export type AttachmentItem = {
  id: string
  file: File
  previewUrl: string
  name: string
  size: number
  type: string
}

export type InputAttachmentsProps = {
  attachments: {
    value: AttachmentItem[]
    setValue: Dispatch<SetStateAction<AttachmentItem[]>>
  }
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export default function InputAttachments({ attachments }: InputAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newItems: AttachmentItem[] = []
    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/")
      const previewUrl = isImage ? URL.createObjectURL(file) : ""
      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      })
    })

    attachments.setValue((prev) => [...prev, ...newItems])
  }

  const handleRemove = (id: string) => {
    attachments.setValue((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFilesAdded(e.dataTransfer.files)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="attachments-input">Media & Document Attachments</FieldLabel>

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          id="attachments-input"
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFilesAdded(e.target.files)}
        />

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HugeiconsIcon icon={Upload03FreeIcons} size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-foreground">
              Click to upload or drag & drop files
            </p>
            <p className="text-[11px] text-muted-foreground">
              Supports receipts, invoices, images (PNG, JPG) or PDF files up to 10MB
            </p>
          </div>
        </div>
      </Field>

      {/* Uploaded Files Review List */}
      {attachments.value.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Uploaded Attachments ({attachments.value.length})
          </span>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {attachments.value.map((item) => {
              const isImage = item.type.startsWith("image/")
              return (
                <div
                  key={item.id}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-card p-2.5 shadow-2xs transition-all hover:border-primary/40"
                >
                  {/* Thumbnail / Icon */}
                  {isImage && item.previewUrl ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImageUrl(item.previewUrl)
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white"
                        title="Preview Full Image"
                      >
                        <HugeiconsIcon icon={ViewFreeIcons} size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                      <HugeiconsIcon
                        icon={isImage ? Image01FreeIcons : File01FreeIcons}
                        size={22}
                      />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex flex-1 flex-col overflow-hidden text-left">
                    <span className="line-clamp-1 text-xs font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatBytes(item.size)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {isImage && item.previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewImageUrl(item.previewUrl)}
                        title="View image"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <HugeiconsIcon icon={ViewFreeIcons} size={16} />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      title="Remove file"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <HugeiconsIcon icon={Delete02FreeIcons} size={16} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox Review Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[85vh] max-w-3xl flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="text-xs font-semibold">Image Attachment Preview</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPreviewImageUrl(null)}
                className="h-8 w-8 rounded-full"
              >
                <HugeiconsIcon icon={Cancel01FreeIcons} size={18} />
              </Button>
            </div>
            <div className="flex items-center justify-center overflow-auto p-2 bg-black/40">
              <img
                src={previewImageUrl}
                alt="Attachment preview"
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
