import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Ruler, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

async function ProjectDetails({ id }: { id: string }) {
  const supabase = await createServerClient()

  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">{project.category}</p>
        </div>
        <Badge className="ml-auto" variant={project.is_published ? "default" : "secondary"}>
          {project.is_published ? "Опубликован" : "Черновик"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{project.location}</span>
            </div>
            {project.area && (
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <span>{project.area} м²</span>
              </div>
            )}
            {project.duration && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{project.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(project.completion_date).toLocaleDateString("ru-RU")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{project.description}</p>
          </CardContent>
        </Card>
      </div>

      {project.image_urls && project.image_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Галерея ({project.image_urls.length} изображений)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.image_urls.map((url: string, index: number) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={`${project.title} - изображение ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </div>
            }
          >
            <ProjectDetails id={params.id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
