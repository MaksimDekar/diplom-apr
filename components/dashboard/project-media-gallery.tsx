"use client"

import { useMemo, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ChevronLeft, ChevronRight, Image as ImageIcon, Video, X } from "lucide-react"

type MediaItem = {
  id: string
  file_url: string
  file_type: string
  caption: string | null
}

type ProjectMediaGalleryProps = {
  items: MediaItem[]
}

export function ProjectMediaGallery({ items }: ProjectMediaGalleryProps) {
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
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((file, index) => (
          <button
            key={file.id}
            type="button"
            onClick={() => openItem(index)}
            className="space-y-1 text-left"
          >
            {file.file_type === "photo" ? (
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={file.file_url}
                  alt={file.caption || ""}
                  className="h-20 w-full object-cover transition-transform hover:scale-[1.02]"
                />
                <div className="absolute top-1 left-1">
                  <ImageIcon className="h-3 w-3 text-white drop-shadow" />
                </div>
              </div>
            ) : (
              <div className="flex h-20 w-full items-center justify-center rounded-lg bg-muted transition-colors hover:bg-muted/80">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            {file.caption && <p className="text-xs text-muted-foreground">{file.caption}</p>}
          </button>
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

                {selectedItem.caption && (
                  <div className="mt-3 rounded-xl bg-black/60 px-4 py-3 text-sm text-white">
                    {selectedItem.caption}
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
