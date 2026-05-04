import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { FileText, Briefcase, Users, MessageSquare, Settings, Mail } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const [
    { count: servicesCount },
    { count: projectsCount },
    { count: teamCount },
    { count: contactRequestsCount },
    { count: consultationRequestsCount },
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("consultation_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
  ])

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Панель управления</h1>
              <p className="text-muted-foreground">Добро пожаловать, {user.email}</p>
            </div>
            <LogoutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Услуги</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{servicesCount || 0}</div>
                <p className="text-xs text-muted-foreground">Всего услуг на сайте</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Проекты</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectsCount || 0}</div>
                <p className="text-xs text-muted-foreground">Проектов в портфолио</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Команда</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamCount || 0}</div>
                <p className="text-xs text-muted-foreground">Сотрудников</p>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Новые обращения</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{contactRequestsCount || 0}</div>
                <p className="text-xs text-muted-foreground">Требуют внимания</p>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Консультации</CardTitle>
                <Mail className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{consultationRequestsCount || 0}</div>
                <p className="text-xs text-muted-foreground">Новых заявок</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Настройки</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Конфигурация сайта</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
