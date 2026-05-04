import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { ClientProjectsBoard } from "@/components/admin/client-projects-board"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
            <ClientProjectsBoard
              statusMap={statusMap}
              projects={projects.map((project: ClientProject) => {
                const projectStages = stageMap.get(project.id) || []
                const completedStages = projectStages.filter((stage) => stage.status === "completed").length
                const clientProfile = profileMap.get(project.user_id)

                return {
                  id: project.id,
                  title: project.title,
                  address: project.address,
                  status: project.status,
                  property_type: project.property_type,
                  property_area: project.property_area,
                  client_name: clientProfile?.full_name || null,
                  client_email: clientProfile?.email || null,
                  completed_stages: completedStages,
                  total_stages: projectStages.length,
                }
              })}
            />
          )}
        </div>
      </main>
    </div>
  )
}
