"use client"

import { useMemo, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, Trash2, Video, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type MediaItem = {
  id: string
  file_url: string
  file_type: string
  caption: string | null
  created_at?: string
}

type MediaLightboxGalleryProps = {
  items: MediaItem[]
  gridClassName?: string
  thumbnailClassName?: string
  onDelete?: (item: MediaItem) => void
  deletingId?: string | null
  showMeta?: boolean
}

export function MediaLightboxGallery({
  items,
  gridClassName = "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
  thumbnailClassName = "h-20",
  onDelete,
  deletingId,
  showMeta = true,
}: MediaLightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const selectedItem = useMemo(() => {
    if (selectedIndex === null) return null
    return items[selectedIndex] ?? null
  }, [items, selectedIndex])

  const openItem = (index: number) => setSelectedIndex(index)
  const closeItem = () => setSelectedIndex(null)

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return current
      return current === 0 ? items.length - 1 : current - 1
    })
  }

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return current
      return current === items.length - 1 ? 0 : current + 1
    })
  }

  return (
    <>
      <div className={gridClassName}>
        {items.map((file, index) => (
          <div key={file.id} className="space-y-2">
            <button
              type="button"
              onClick={() => openItem(index)}
              className="block w-full text-left"
            >
              {file.file_type === "photo" ? (
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={file.file_url}
                    alt={file.caption || ""}
                    className={`${thumbnailClassName} w-full object-cover transition-transform hover:scale-[1.02]`}
                  />
                  <div className="absolute top-1 left-1">
                    <ImageIcon className="h-3 w-3 text-white drop-shadow" />
                  </div>
                </div>
              ) : (
                <div className={`${thumbnailClassName} flex w-full items-center justify-center rounded-lg bg-muted transition-colors hover:bg-muted/80`}>
                  <Video className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </button>

            {showMeta && (
              <div className="space-y-1">
                {file.caption && <p className="text-xs text-muted-foreground">{file.caption}</p>}
                {file.created_at && (
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(file.created_at).toLocaleString("ru-RU")}
                  </p>
                )}
              </div>
            )}

            {onDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={deletingId === file.id}
                onClick={() => onDelete(file)}
              >
                {deletingId === file.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </>
                )}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog.Root open={selectedItem !== null} onOpenChange={(open) => !open && closeItem()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {selectedItem && (
              <div className="relative w-full max-w-5xl">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/75"
                    aria-label="Закрыть"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>

                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrevious}
                      className="absolute top-1/2 left-3 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/75"
                      aria-label="Предыдущее"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute top-1/2 right-3 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/75"
                      aria-label="Следующее"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
                  {selectedItem.file_type === "photo" ? (
                    <img
                      src={selectedItem.file_url}
                      alt={selectedItem.caption || ""}
                      className="max-h-[80vh] w-full object-contain"
                    />
                  ) : (
                    <video
                      src={selectedItem.file_url}
                      controls
                      autoPlay
                      className="max-h-[80vh] w-full bg-black"
                    />
                  )}
                </div>

                {(selectedItem.caption || selectedItem.created_at) && (
                  <div className="mt-3 space-y-1 rounded-xl bg-black/60 px-4 py-3 text-sm text-white">
                    {selectedItem.caption && <div>{selectedItem.caption}</div>}
                    {selectedItem.created_at && (
                      <div className="text-xs text-white/75">
                        {new Date(selectedItem.created_at).toLocaleString("ru-RU")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
