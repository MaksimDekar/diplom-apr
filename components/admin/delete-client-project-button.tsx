"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"

type DeleteClientProjectButtonProps = {
  projectId: string
  projectTitle: string
  redirectTo?: string
  variant?: "destructive" | "outline"
  size?: "default" | "sm"
}

export function DeleteClientProjectButton({
  projectId,
  projectTitle,
  redirectTo,
  variant = "destructive",
  size = "sm",
}: DeleteClientProjectButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(`Удалить проект "${projectTitle}"? Это действие нельзя отменить.`)
    if (!confirmed) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/client-projects/${projectId}`, {
        method: "DELETE",
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || "Не удалось удалить проект")
      }

      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Не удалось удалить проект")
      setIsDeleting(false)
    }
  }

  return (
    <Button type="button" variant={variant} size={size} disabled={isDeleting} onClick={handleDelete}>
      {isDeleting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Удаление...
        </>
      ) : (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Удалить проект
        </>
      )}
    </Button>
  )
}
