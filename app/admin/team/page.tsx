import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Plus, Edit, Eye, EyeOff, Users } from "lucide-react"

export default async function AdminTeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: team } = await supabase.from("team_members").select("*").order("sort_order")

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Команда</h1>
              <p className="text-muted-foreground">Управление сотрудниками компании</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/admin/team/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить сотрудника
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team && team.length > 0 ? (
              team.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url || "/placeholder.svg"}
                            alt={member.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold mb-1">{member.full_name}</h3>
                      <p className="text-sm text-primary mb-2">{member.position}</p>
                      {member.is_active ? (
                        <Badge className="bg-green-500">
                          <Eye className="h-3 w-3 mr-1" />
                          Активен
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Скрыт
                        </Badge>
                      )}
                    </div>
                    {member.experience_years && (
                      <div className="text-sm text-center mb-4 text-muted-foreground">
                        Опыт: {member.experience_years} лет
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <Link href={`/admin/team/${member.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-3">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">Сотрудников пока нет</p>
                  <Button asChild>
                    <Link href="/admin/team/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить первого сотрудника
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
