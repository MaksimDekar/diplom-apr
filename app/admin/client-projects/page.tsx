import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderOpen } from "lucide-react"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    active: { label: "В работе", variant: "default" },
    paused: { label: "Приостановлен", variant: "secondary" },
    completed: { label: "Завершён", variant: "outline" },
}

export default async function ClientProjectsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/admin/login")

    const { data: projects } = await supabase
        .from("client_projects")
        .select(`
      *,
      profiles (full_name, email),
      project_stages (id, status)
    `)
        .order("created_at", { ascending: false })

    return (
        <div className="flex min-h-screen">
            <AdminNav />
            <main className="flex-1 p-8 ml-64">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-serif text-3xl font-bold mb-2">Проекты клиентов</h1>
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
                                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Проектов пока нет</p>
                                <Button asChild className="mt-4">
                                    <Link href="/admin/client-projects/new">Создать первый проект</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((project) => {
                                const status = statusMap[project.status] ?? statusMap.active
                                const totalStages = project.project_stages?.length ?? 0
                                const completedStages = project.project_stages?.filter((s: { status: string }) => s.status === "completed").length ?? 0

                                return (
                                    <Card key={project.id} className="hover:border-primary/50 transition-colors">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                                    <p className="text-sm text-muted-foreground mt-1">{project.address}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Клиент: {project.profiles?.full_name || project.profiles?.email || "—"}
                                                    </p>
                                                </div>
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    {project.property_type && <span>{project.property_type}</span>}
                                                    {project.property_area && <span>{project.property_area} м²</span>}
                                                    <span>Этапов: {completedStages}/{totalStages}</span>
                                                    {totalStages > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary rounded-full transition-all"
                                                                    style={{ width: `${(completedStages / totalStages) * 100}%` }}
                                                                />
                                                            </div>
                                                            <span>{Math.round((completedStages / totalStages) * 100)}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/admin/client-projects/${project.id}`}>Управление</Link>
                                                </Button>
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