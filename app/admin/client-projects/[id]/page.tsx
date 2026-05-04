"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteClientProjectButton } from "@/components/admin/delete-client-project-button"
import { MediaLightboxGallery } from "@/components/media/media-lightbox-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, Circle, Clock, Loader2 } from "lucide-react"

type Stage = {
  id: string
  title: string
  order_index: number
  status: "pending" | "in_progress" | "completed"
  started_at: string | null
  completed_at: string | null
}

type Media = {
  id: string
  stage_id: string
  file_url: string
  file_type: "photo" | "video"
  caption: string | null
  created_at: string
}

type Project = {
  id: string
  title: string
  address: string | null
  status: string
  property_type: string | null
  property_area: number | null
  profiles: { full_name: string | null; email: string | null } | null
}

const stageStatusIcon = {
  pending: <Circle className="h-5 w-5 text-muted-foreground" />,
  in_progress: <Clock className="h-5 w-5 text-primary" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
}

export default function ClientProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [stages, setStages] = useState<Stage[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [selectedStage, setSelectedStage] = useState<string>("")
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const loadData = useCallback(async () => {
    setIsPageLoading(true)

    try {
      const response = await fetch(`/api/admin/client-projects/${projectId}`, {
        cache: "no-store",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Не удалось загрузить проект")
      }

      setProject(data.project || null)
      setStages(data.stages || [])
      setMedia(data.media || [])

      if (data.stages && data.stages.length > 0 && !selectedStage) {
        setSelectedStage(data.stages[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить проект")
    } finally {
      setIsPageLoading(false)
    }
  }, [projectId, selectedStage])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateStageStatus = async (stageId: string, status: Stage["status"]) => {
    const supabase = createClient()
    await supabase
      .from("project_stages")
      .update({
        status,
        started_at: status === "in_progress" ? new Date().toISOString() : null,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", stageId)

    await loadData()
  }

  const updateProjectStatus = async (status: string) => {
    const supabase = createClient()
    await supabase.from("client_projects").update({ status }).eq("id", projectId)
    await loadData()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedStage) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const currentStage = stages.find((stage) => stage.id === selectedStage)
      const fileExt = file.name.split(".").pop()
      const fileName = `${projectId}/${selectedStage}/${Date.now()}.${fileExt}`
      const fileType = file.type.startsWith("video/") ? "video" : "photo"

      const { error: uploadError } = await supabase.storage.from("project-media").upload(fileName, file)
      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-media").getPublicUrl(fileName)

      const { error: insertError } = await supabase.from("stage_media").insert([
        {
          stage_id: selectedStage,
          project_id: projectId,
          file_url: publicUrl,
          file_type: fileType,
          caption: caption || null,
          uploaded_by: "admin",
        },
      ])

      if (insertError) throw insertError

      if (currentStage?.status === "pending") {
        await supabase
          .from("project_stages")
          .update({
            status: "in_progress",
            started_at: currentStage.started_at || new Date().toISOString(),
            completed_at: null,
          })
          .eq("id", currentStage.id)
      }

      if (project?.status !== "active") {
        await supabase.from("client_projects").update({ status: "active" }).eq("id", projectId)
      }

      setCaption("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки файла")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    const confirmed = window.confirm("Удалить этот файл? Он исчезнет и у клиента, и в админке.")
    if (!confirmed) return

    setDeletingMediaId(mediaId)
    setError(null)

    try {
      const response = await fetch(`/api/admin/stage-media/${mediaId}`, {
        method: "DELETE",
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || "Не удалось удалить файл")
      }

      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить файл")
    } finally {
      setDeletingMediaId(null)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="ml-64 flex-1 p-8">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Не удалось открыть проект</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {error || "Проект не найден или недоступен для просмотра."}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => loadData()}>
                    Повторить
                  </Button>
                  <Button asChild>
                    <Link href="/admin/client-projects">К списку проектов</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const stageMedia = (stageId: string) =>
    media
      .filter((item) => item.stage_id === stageId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const completedStages = stages.filter((stage) => stage.status === "completed").length
  const inProgressStages = stages.filter((stage) => stage.status === "in_progress").length
  const totalFiles = media.length

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/client-projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold">{project.title}</h1>
              <p className="text-muted-foreground">
                {project.profiles?.full_name || project.profiles?.email}
                {project.address ? ` · ${project.address}` : ""}
              </p>
            </div>
            <Select value={project.status} onValueChange={updateProjectStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">В работе</SelectItem>
                <SelectItem value="paused">Приостановлен</SelectItem>
                <SelectItem value="completed">Завершён</SelectItem>
              </SelectContent>
            </Select>
            <DeleteClientProjectButton
              projectId={project.id}
              projectTitle={project.title}
              redirectTo="/admin/client-projects"
            />
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="text-2xl font-bold">{stages.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">Всего этапов</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="text-2xl font-bold text-green-600">{completedStages}</div>
                <p className="mt-1 text-xs text-muted-foreground">Завершено</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="text-2xl font-bold text-primary">{inProgressStages}</div>
                <p className="mt-1 text-xs text-muted-foreground">В работе</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="text-2xl font-bold">{totalFiles}</div>
                <p className="mt-1 text-xs text-muted-foreground">Загружено файлов</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Этапы ремонта</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`cursor-pointer rounded-lg p-2 transition-colors ${
                        selectedStage === stage.id ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedStage(stage.id)}
                    >
                      <div className="flex items-center gap-3">
                        {stageStatusIcon[stage.status]}
                        <span className="flex-1 text-sm">{stage.title}</span>
                        <Select value={stage.status} onValueChange={(value) => updateStageStatus(stage.id, value as Stage["status"])}>
                          <SelectTrigger className="h-6 w-8 border-0 bg-transparent p-0" onClick={(e) => e.stopPropagation()}>
                            <span />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Ожидает</SelectItem>
                            <SelectItem value="in_progress">В работе</SelectItem>
                            <SelectItem value="completed">Завершён</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {stageMedia(stage.id).length > 0 && (
                        <div className="mt-2 pl-8 text-xs text-muted-foreground">
                          {stageMedia(stage.id).length} файл(ов) загружено
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Загрузить фото или видео</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Этап</Label>
                    <Select value={selectedStage} onValueChange={setSelectedStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите этап" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Подпись</Label>
                    <Textarea
                      placeholder="Что сделано на этом этапе?"
                      rows={2}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Файл</Label>
                    <Input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading || !selectedStage} />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    После первой загрузки по этапу он автоматически перейдёт в статус «В работе»,
                    а клиент сразу увидит обновление в личном кабинете.
                  </p>

                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Загрузка...
                    </div>
                  )}
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {success && <p className="text-sm text-green-600">Файл успешно загружен.</p>}
                </CardContent>
              </Card>

              {stages.map((stage) => {
                const stageFiles = stageMedia(stage.id)
                if (stageFiles.length === 0) return null

                return (
                  <Card key={stage.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        {stageStatusIcon[stage.status]}
                        <CardTitle className="text-base">{stage.title}</CardTitle>
                        <Badge variant="secondary">{stageFiles.length} файлов</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <MediaLightboxGallery
                        items={stageFiles}
                        gridClassName="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                        thumbnailClassName="h-24"
                        showMeta
                        onDelete={(file) => handleDeleteMedia(file.id)}
                        deletingId={deletingMediaId}
                      />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
