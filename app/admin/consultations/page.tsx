import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Mail, Phone, Calendar } from "lucide-react"

export default async function AdminConsultationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: consultations } = await supabase
    .from("consultation_requests")
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
              <h1 className="font-serif text-3xl font-bold mb-2">Заявки на консультацию</h1>
              <p className="text-muted-foreground">Запросы на бесплатную консультацию</p>
            </div>
            <LogoutButton />
          </div>

          <div className="space-y-4">
            {consultations && consultations.length > 0 ? (
              consultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{consultation.full_name}</CardTitle>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {consultation.phone}
                          </div>
                          {consultation.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {consultation.email}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Создано: {new Date(consultation.created_at).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                      </div>
                      <Badge className={statusColors[consultation.status as keyof typeof statusColors]}>
                        {statusLabels[consultation.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {consultation.property_type && (
                        <div>
                          <span className="font-semibold">Тип объекта:</span>
                          <p className="text-muted-foreground">{consultation.property_type}</p>
                        </div>
                      )}
                      {consultation.property_area && (
                        <div>
                          <span className="font-semibold">Площадь:</span>
                          <p className="text-muted-foreground">{consultation.property_area} м²</p>
                        </div>
                      )}
                      {consultation.preferred_date && (
                        <div>
                          <span className="font-semibold">Желаемая дата:</span>
                          <p className="text-muted-foreground">
                            {new Date(consultation.preferred_date).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                      )}
                      {consultation.preferred_time && (
                        <div>
                          <span className="font-semibold">Время:</span>
                          <p className="text-muted-foreground">{consultation.preferred_time}</p>
                        </div>
                      )}
                    </div>
                    {consultation.message && (
                      <div>
                        <span className="font-semibold">Комментарий:</span>
                        <p className="text-muted-foreground mt-1">{consultation.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Заявок на консультацию пока нет</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
