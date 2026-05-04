import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Calendar, Maximize2, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: project } = await supabase.from("projects").select("title, description").eq("id", id).single()

  if (!project) {
    return {
      title: "Проект не найден",
    }
  }

  return {
    title: `${project.title} - АбсолютПрофРемонт`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).eq("is_published", true).single()

  if (!project) {
    notFound()
  }

  const { data: images } = await supabase.from("project_images").select("*").eq("project_id", id).order("sort_order")

  const categories = {
    renovation: { label: "Ремонт квартир", color: "bg-blue-500 text-white" },
    design: { label: "Дизайн", color: "bg-purple-500 text-white" },
    commercial: { label: "Коммерческие", color: "bg-green-500 text-white" },
    other: { label: "Другое", color: "bg-gray-500 text-white" },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link href="/portfolio" className="hover:text-primary transition-colors">
                Портфолио
              </Link>
              <span>/</span>
              <span className="text-foreground">{project.title}</span>
            </div>
          </div>
        </section>

        {/* Project Header */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="mb-4">
                  <Badge className={categories[project.category as keyof typeof categories]?.color || ""}>
                    {categories[project.category as keyof typeof categories]?.label || project.category}
                  </Badge>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">{project.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {project.location && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Локация</div>
                            <div className="font-semibold">{project.location}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {project.area && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Maximize2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Площадь</div>
                            <div className="font-semibold">{project.area} м²</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {project.duration_days && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Срок работ</div>
                            <div className="font-semibold">{project.duration_days} дней</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {project.completion_date && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Завершен</div>
                            <div className="font-semibold">
                              {new Date(project.completion_date).toLocaleDateString("ru-RU", {
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Button size="lg" asChild>
                  <Link href="/contacts#consultation">
                    Заказать похожий проект
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="relative">
                <img
                  src={project.image_url || "/placeholder-image.jpg"}
                  alt={project.title}
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {images && images.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">Галерея проекта</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="relative group overflow-hidden rounded-lg">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.caption || project.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-sm text-white">{image.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Portfolio */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Вернуться к портфолио
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
