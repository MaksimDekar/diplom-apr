"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, CheckCircle, Clock, Circle, Image, Video } from "lucide-react"

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
    const [stages, setStages] = useState<Stage[]>([])
    const [media, setMedia] = useState<Media[]>([])
    const [selectedStage, setSelectedStage] = useState<string>("")
    const [caption, setCaption] = useState("")
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const loadData = useCallback(async () => {
        const supabase = createClient()

        const { data: proj } = await supabase
            .from("client_projects")
            .select("*, profiles(full_name, email)")
            .eq("id", projectId)
            .single()

        const { data: stagesData } = await supabase
            .from("project_stages")
            .select("*")
            .eq("project_id", projectId)
            .order("order_index")

        const { data: mediaData } = await supabase
            .from("stage_media")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false })

        setProject(proj)
        setStages(stagesData || [])
        setMedia(mediaData || [])
        if (stagesData && stagesData.length > 0 && !selectedStage) {
            setSelectedStage(stagesData[0].id)
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
                started_at: status === "in_progress" ? new Date().toISOString() : undefined,
                completed_at: status === "completed" ? new Date().toISOString() : undefined,
            })
            .eq("id", stageId)
        loadData()
    }

    const updateProjectStatus = async (status: string) => {
        const supabase = createClient()
        await supabase.from("client_projects").update({ status }).eq("id", projectId)
        loadData()
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedStage) return

        setUploading(true)
        setError(null)

        try {
            const supabase = createClient()
            const fileExt = file.name.split(".").pop()
            const fileName = `${projectId}/${selectedStage}/${Date.now()}.${fileExt}`
            const fileType = file.type.startsWith("video/") ? "video" : "photo"

            const { error: uploadError } = await supabase.storage
                .from("project-media")
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from("project-media")
                .getPublicUrl(fileName)

            const { error: insertError } = await supabase.from("stage_media").insert([{
                stage_id: selectedStage,
                project_id: projectId,
                file_url: publicUrl,
                file_type: fileType,
                caption: caption || null,
                uploaded_by: "admin",
            }])

            if (insertError) throw insertError

            setCaption("")
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
            loadData()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё С„Р°Р№Р»Р°")
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    if (!project) return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )

    const stageMedia = (stageId: string) => media.filter(m => m.stage_id === stageId)

    return (
        <div className="flex min-h-screen">
            <main className="flex-1 p-8 ml-64">
                <div className="max-w-5xl mx-auto">
                    {/* РЁР°РїРєР° */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/client-projects">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                РќР°Р·Р°Рґ
                            </Link>
                        </Button>
                        <div className="flex-1">
                            <h1 className="font-serif text-3xl font-bold">{project.title}</h1>
                            <p className="text-muted-foreground">
                                {project.profiles?.full_name || project.profiles?.email} В· {project.address}
                            </p>
                        </div>
                        <Select value={project.status} onValueChange={updateProjectStatus}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Р’ СЂР°Р±РѕС‚Рµ</SelectItem>
                                <SelectItem value="paused">РџСЂРёРѕСЃС‚Р°РЅРѕРІР»РµРЅ</SelectItem>
                                <SelectItem value="completed">Р—Р°РІРµСЂС€С‘РЅ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Р­С‚Р°РїС‹ */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Р­С‚Р°РїС‹ СЂРµРјРѕРЅС‚Р°</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {stages.map((stage) => (
                                        <div
                                            key={stage.id}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedStage === stage.id ? "bg-primary/10" : "hover:bg-muted"
                                                }`}
                                            onClick={() => setSelectedStage(stage.id)}
                                        >
                                            {stageStatusIcon[stage.status]}
                                            <span className="flex-1 text-sm">{stage.title}</span>
                                            <Select
                                                value={stage.status}
                                                onValueChange={(v) => updateStageStatus(stage.id, v as Stage["status"])}
                                            >
                                                <SelectTrigger className="w-8 h-6 p-0 border-0 bg-transparent" onClick={e => e.stopPropagation()}>
                                                    <span />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">РћР¶РёРґР°РµС‚</SelectItem>
                                                    <SelectItem value="in_progress">Р’ СЂР°Р±РѕС‚Рµ</SelectItem>
                                                    <SelectItem value="completed">Р—Р°РІРµСЂС€С‘РЅ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Р—Р°РіСЂСѓР·РєР° РјРµРґРёР° Рё РіР°Р»РµСЂРµСЏ */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Р—Р°РіСЂСѓР·РёС‚СЊ С„РѕС‚Рѕ/РІРёРґРµРѕ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Р­С‚Р°Рї</Label>
                                        <Select value={selectedStage} onValueChange={setSelectedStage}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Р’С‹Р±РµСЂРёС‚Рµ СЌС‚Р°Рї" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {stages.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>РџРѕРґРїРёСЃСЊ (РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ)</Label>
                                        <Textarea
                                            placeholder="РћРїРёСЃР°РЅРёРµ С„РѕС‚Рѕ..."
                                            rows={2}
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Р¤Р°Р№Р» (С„РѕС‚Рѕ РёР»Рё РІРёРґРµРѕ)</Label>
                                        <Input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading || !selectedStage}
                                        />
                                    </div>

                                    {uploading && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Р—Р°РіСЂСѓР·РєР°...
                                        </div>
                                    )}
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    {success && (
                                        <p className="text-sm text-green-600">Р¤Р°Р№Р» СѓСЃРїРµС€РЅРѕ Р·Р°РіСЂСѓР¶РµРЅ!</p>
                                    )}
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
                                                <Badge variant="secondary">{stageFiles.length} С„Р°Р№Р»РѕРІ</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-2">
                                                {stageFiles.map((file) => (
                                                    <div key={file.id} className="relative group">
                                                        {file.file_type === "photo" ? (
                                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                                <img
                                                                    src={file.file_url}
                                                                    alt={file.caption || ""}
                                                                    className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                                                />
                                                                <div className="absolute top-1 left-1">
                                                                    <Image className="h-3 w-3 text-white drop-shadow" />
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                                <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
                                                                    <Video className="h-8 w-8 text-muted-foreground" />
                                                                </div>
                                                            </a>
                                                        )}
                                                        {file.caption && (
                                                            <p className="text-xs text-muted-foreground mt-1 truncate">{file.caption}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
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
