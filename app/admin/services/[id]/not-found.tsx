import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminNav } from "@/components/admin/admin-nav"
import { FileQuestion } from "lucide-react"

export default function ServiceNotFound() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <FileQuestion className="w-20 h-20 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-2">Услуга не найдена</h1>
          <p className="text-muted-foreground mb-8">Запрашиваемая услуга не существует или была удалена</p>
          <Button asChild>
            <Link href="/admin/services">Вернуться к списку услуг</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
