import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Plus, Edit, Eye, EyeOff } from "lucide-react"

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: services } = await supabase.from("services").select("*").order("sort_order")

  const categoryLabels = {
    renovation: "Ремонт",
    design: "Дизайн",
    commercial: "Коммерческие",
    other: "Другое",
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Услуги</h1>
              <p className="text-muted-foreground">Управление услугами компании</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/admin/services/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить услугу
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {services && services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-serif text-xl font-bold">{service.title}</h3>
                          <Badge variant="outline">
                            {categoryLabels[service.category as keyof typeof categoryLabels]}
                          </Badge>
                          {service.is_active ? (
                            <Badge className="bg-green-500">
                              <Eye className="h-3 w-3 mr-1" />
                              Активна
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Скрыта
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                        {service.price_from && (
                          <div className="text-sm">
                            <span className="font-semibold">Цена от:</span> {service.price_from.toLocaleString("ru-RU")}{" "}
                            ₽/м²
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/services/${service.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">Услуг пока нет</p>
                  <Button asChild>
                    <Link href="/admin/services/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить первую услугу
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
