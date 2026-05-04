import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Mail, Phone, Calendar } from "lucide-react"

export default async function AdminContactsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: contacts } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })

  const statusColors = {
    new: "bg-blue-500",
    in_progress: "bg-yellow-500",
    completed: "bg-green-500",
    cancelled: "bg-gray-500",
  }

  const statusLabels = {
    new: "Новое",
    in_progress: "В работе",
    completed: "Завершено",
    cancelled: "Отменено",
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Обращения</h1>
              <p className="text-muted-foreground">Заявки с формы обратной связи</p>
            </div>
            <LogoutButton />
          </div>

          <div className="space-y-4">
            {contacts && contacts.length > 0 ? (
              contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{contact.full_name}</CardTitle>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {contact.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(contact.created_at).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                      </div>
                      <Badge className={statusColors[contact.status as keyof typeof statusColors]}>
                        {statusLabels[contact.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {contact.service_type && (
                      <div className="mb-2">
                        <span className="font-semibold">Услуга:</span> {contact.service_type}
                      </div>
                    )}
                    {contact.budget_range && (
                      <div className="mb-2">
                        <span className="font-semibold">Бюджет:</span> {contact.budget_range}
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="font-semibold">Сообщение:</span>
                    </div>
                    <p className="text-muted-foreground">{contact.message}</p>
                    {contact.admin_notes && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <span className="font-semibold">Заметки администратора:</span>
                        <p className="text-sm text-muted-foreground mt-1">{contact.admin_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Обращений пока нет</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
