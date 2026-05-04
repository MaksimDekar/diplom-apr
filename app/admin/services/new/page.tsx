import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"

export default async function NewServicePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Новая услуга</h1>
              <p className="text-muted-foreground">Добавление новой услуги</p>
            </div>
            <LogoutButton />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Форма создания</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Форма создания/редактирования будет реализована в следующей версии. Сейчас можно управлять данными через
                Supabase Dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
