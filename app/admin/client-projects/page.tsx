import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteClientProjectButton } from "@/components/admin/delete-client-project-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderOpen } from "lucide-react"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "В работе", variant: "default" },
  paused: { label: "Приостановлен", variant: "secondary" },
  completed: { label: "Завершён", variant: "outline" },
}

type ClientProject = {
  id: string
  title: string
  address: string | null
  status: string
  property_type: string | null
  property_area: number | null
  user_id: string
}

type ProjectStage = {
  project_id: string
  status: string
}

type ProfileSummary = {
  id: string
  full_name: string | null
  email: string | null
}

export default async function ClientProjectsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (currentProfile?.role !== "admin") {
    redirect("/admin/login?error=access_denied")
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ data: projects }, { data: stages }, { data: profiles }] = await Promise.all([
    adminSupabase.from("client_projects").select("*").order("created_at", { ascending: false }),
    adminSupabase.from("project_stages").select("project_id, status"),
    adminSupabase.from("profiles").select("id, full_name, email"),
  ])

  const profileMap = new Map((profiles || []).map((profile: ProfileSummary) => [profile.id, profile]))
  const stageMap = new Map<string, ProjectStage[]>()

  for (const stage of stages || []) {
    const list = stageMap.get(stage.project_id) || []
    list.push(stage)
    stageMap.set(stage.project_id, list)
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-serif text-3xl font-bold">Проекты клиентов</h1>
              <p className="text-muted-foreground">Управление трекером ремонта</p>
            </div>
            <Button asChild>
              <Link href="/admin/client-projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Новый проект
              </Link>
            </Button>
          </div>

          {!projects || projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Проектов пока нет</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/client-projects/new">Создать первый проект</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {projects.map((project: ClientProject) => {
                const status = statusMap[project.status] ?? statusMap.active
                const projectStages = stageMap.get(project.id) || []
                const totalStages = projectStages.length
                const completedStages = projectStages.filter((stage) => stage.status === "completed").length
                const clientProfile = profileMap.get(project.user_id)

                return (
                  <Card key={project.id} className="transition-colors hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">{project.address}</p>
                          <p className="text-sm text-muted-foreground">
                            Клиент: {clientProfile?.full_name || clientProfile?.email || "—"}
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {project.property_type && <span>{project.property_type}</span>}
                          {project.property_area && <span>{project.property_area} м²</span>}
                          <span>Этапов: {completedStages}/{totalStages}</span>
                          {totalStages > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${(completedStages / totalStages) * 100}%` }}
                                />
                              </div>
                              <span>{Math.round((completedStages / totalStages) * 100)}%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/client-projects/${project.id}`}>Управление</Link>
                          </Button>
                          <DeleteClientProjectButton
                            projectId={project.id}
                            projectTitle={project.title}
                            variant="outline"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
