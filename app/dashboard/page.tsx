import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { EditProfileForm } from "@/components/edit-profile-form"
import {
    CheckCircle, Clock, Circle, Image as ImageIcon, Video,
    Phone, Mail, MessageSquare, CalendarDays, HardHat
} from "lucide-react"

const projectStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    active: { label: "В работе", variant: "default" },
    paused: { label: "Приостановлен", variant: "secondary" },
    completed: { label: "Завершён", variant: "outline" },
}

const requestStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    new: { label: "Новая", variant: "default" },
    in_progress: { label: "В работе", variant: "secondary" },
    completed: { label: "Выполнено", variant: "outline" },
    cancelled: { label: "Отменено", variant: "destructive" },
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    const { data: clientProjects } = await supabase
        .from("client_projects")
        .select(`
      *,
      project_stages (
        id, title, order_index, status, started_at, completed_at,
        stage_media (id, file_url, file_type, caption, created_at)
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    const { data: consultations } = await supabase
        .from("consultation_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    const name = profile?.full_name || user.email || ""
    const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() || "").join("") || "?"
    const activeProjects = clientProjects?.filter(p => p.status === "active") || []
    const completedProjects = clientProjects?.filter(p => p.status === "completed") || []
    const memberSince = new Date(user.created_at).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto max-w-5xl px-4 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Личный кабинет</h1>
                    <p className="text-muted-foreground mt-1">Добро пожаловать, {profile?.full_name || user.email}</p>
                </div>

                {/* Профиль */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-semibold">{profile?.full_name || "Имя не указано"}</h2>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{user.email}</span>
                                    </div>
                                    {profile?.phone && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <CalendarDays className="h-4 w-4" />
                                        <span>Клиент с {memberSince}</span>
                                    </div>
                                </div>
                            </div>
                            <EditProfileForm
                                userId={user.id}
                                initialName={profile?.full_name || ""}
                                initialPhone={profile?.phone || ""}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Статистика */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="text-2xl font-bold text-primary">{activeProjects.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Активных объектов</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="text-2xl font-bold">{completedProjects.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Завершённых</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="text-2xl font-bold">{consultations?.length || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Заявок</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="text-2xl font-bold text-green-600">
                                {consultations?.filter(c => c.status === "completed").length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Выполнено</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Трекер или пустое состояние */}
                {clientProjects && clientProjects.length > 0 ? (
                    <div className="mb-6 space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <HardHat className="h-5 w-5" />
                            Мои объекты
                        </h2>
                        {clientProjects.map((project) => {
                            const stages = (project.project_stages || []).sort(
                                (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
                            )
                            const totalStages = stages.length
                            const completedStages = stages.filter((s: { status: string }) => s.status === "completed").length
                            const currentStage = stages.find((s: { status: string }) => s.status === "in_progress")
                            const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0
                            const projStatus = projectStatusMap[project.status] ?? projectStatusMap.active

                            return (
                                <Card key={project.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <CardTitle>{project.title}</CardTitle>
                                                {project.address && <p className="text-sm text-muted-foreground mt-1">{project.address}</p>}
                                                {project.property_type && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {project.property_type}{project.property_area ? `, ${project.property_area} м²` : ""}
                                                    </p>
                                                )}
                                                {currentStage && (
                                                    <p className="text-sm text-primary font-medium mt-1">Сейчас: {currentStage.title}</p>
                                                )}
                                            </div>
                                            <Badge variant={projStatus.variant}>{projStatus.label}</Badge>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm text-muted-foreground mb-1.5">
                                                <span>Прогресс ремонта</span>
                                                <span>{completedStages} из {totalStages} этапов · {progress}%</span>
                                            </div>
                                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {stages.map((stage: {
                                                id: string; title: string; status: "pending" | "in_progress" | "completed"
                                                completed_at: string | null
                                                stage_media: { id: string; file_url: string; file_type: string; caption: string | null }[]
                                            }) => {
                                                const stageMedia = stage.stage_media || []
                                                return (
                                                    <div key={stage.id} className={`rounded-lg border p-4 ${stage.status === "in_progress" ? "border-primary/50 bg-primary/5" :
                                                            stage.status === "completed" ? "border-green-500/30 bg-green-500/5" :
                                                                "border-border opacity-60"
                                                        }`}>
                                                        <div className="flex items-center gap-3">
                                                            {stage.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                                                            {stage.status === "in_progress" && <Clock className="h-5 w-5 text-primary shrink-0 animate-pulse" />}
                                                            {stage.status === "pending" && <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                                                            <span className="font-medium text-sm">{stage.title}</span>
                                                            {stage.status === "in_progress" && <span className="text-xs text-primary font-medium">· Выполняется</span>}
                                                            {stage.status === "completed" && stage.completed_at && (
                                                                <span className="text-xs text-muted-foreground">· {new Date(stage.completed_at).toLocaleDateString("ru-RU")}</span>
                                                            )}
                                                            {stageMedia.length > 0 && (
                                                                <Badge variant="secondary" className="ml-auto text-xs">{stageMedia.length} фото</Badge>
                                                            )}
                                                        </div>
                                                        {stageMedia.length > 0 && (
                                                            <div className="grid grid-cols-4 gap-2 mt-3">
                                                                {stageMedia.map((file) => (
                                                                    <div key={file.id}>
                                                                        {file.file_type === "photo" ? (
                                                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                                                <div className="relative">
                                                                                    <img src={file.file_url} alt={file.caption || ""} className="w-full h-20 object-cover rounded-lg hover:opacity-90 transition-opacity" />
                                                                                    <div className="absolute top-1 left-1"><ImageIcon className="h-3 w-3 text-white drop-shadow" /></div>
                                                                                </div>
                                                                            </a>
                                                                        ) : (
                                                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                                                <div className="w-full h-20 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                                                                                    <Video className="h-6 w-6 text-muted-foreground" />
                                                                                </div>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="mb-6">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                <HardHat className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Активных объектов пока нет</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                                После заключения договора здесь появится трекер вашего ремонта с фотоотчётами по каждому этапу
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Button asChild>
                                    <Link href="/contacts#consultation">
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        Записаться на консультацию
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/services">Посмотреть услуги</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Заявки */}
                {consultations && consultations.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Мои заявки
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y">
                                {consultations.map((item) => {
                                    const status = requestStatusMap[item.status] ?? requestStatusMap.new
                                    return (
                                        <div key={item.id} className="py-4 flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-sm">{item.full_name}</p>
                                                <p className="text-sm text-muted-foreground">{item.phone}</p>
                                                {item.property_type && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.property_type}{item.property_area ? `, ${item.property_area} м²` : ""}
                                                    </p>
                                                )}
                                                {item.message && <p className="text-sm mt-1 text-muted-foreground">{item.message}</p>}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(item.created_at).toLocaleDateString("ru-RU")}
                                                </p>
                                            </div>
                                            <Badge variant={status.variant}>{status.label}</Badge>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Быстрые действия */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-base">Быстрые действия</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/contacts#consultation">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    Записаться на консультацию
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/contacts">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Связаться с нами
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/services">Услуги компании</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/portfolio">Наши работы</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Выход из аккаунта — внизу страницы */}
                <Card className="border-destructive/30">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">Выход из аккаунта</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Вы будете перенаправлены на главную страницу</p>
                            </div>
                            <LogoutButton />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}