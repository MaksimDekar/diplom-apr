import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Plus, Edit, Eye, EyeOff, Star } from "lucide-react"

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: projects } = await supabase.from("projects").select("*").order("completion_date", { ascending: false })

  const categoryLabels = {
    renovation: "Ремонт",
    design: "Дизайн",
    commercial: "Коммерческие",
    other: "Другое",
  }

  const statusLabels = {
    completed: "Завершен",
    in_progress: "В работе",
    planned: "Планируется",
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Проекты</h1>
              <p className="text-muted-foreground">Управление портфолио проектов</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/admin/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить проект
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-serif text-lg font-bold">{project.title}</h3>
                          {project.is_featured && (
                            <Badge className="bg-accent">
                              <Star className="h-3 w-3 mr-1" />
                              Избранное
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">
                            {categoryLabels[project.category as keyof typeof categoryLabels]}
                          </Badge>
                          <Badge variant="secondary">{statusLabels[project.status as keyof typeof statusLabels]}</Badge>
                          {project.is_published ? (
                            <Badge className="bg-green-500">
                              <Eye className="h-3 w-3 mr-1" />
                              Опубликован
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Скрыт
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          {project.location && <span>{project.location}</span>}
                          {project.area && <span>{project.area} м²</span>}
                          {project.completion_date && <span>{new Date(project.completion_date).getFullYear()}</span>}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <Link href={`/admin/projects/${project.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">Проектов пока нет</p>
                  <Button asChild>
                    <Link href="/admin/projects/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить первый проект
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
