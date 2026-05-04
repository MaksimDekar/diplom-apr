import Link from "next/link"
import Image from "next/image" // ← ДОБАВЬТЕ ЭТУ СТРОЧКУ!
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Calendar, Maximize2, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Портфолио - АбсолютПрофРемонт",
  description: "Примеры выполненных работ: ремонт квартир, дизайн интерьера, коммерческие проекты",
}

export default async function PortfolioPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("completion_date", { ascending: false })

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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance mb-6">Наши проекты</h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Более 500 успешно реализованных проектов в Москве и области. Каждый объект — это история качественной
                работы и довольных клиентов.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} href={`/portfolio/${project.id}`}>
                    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <Image
                          src={project.image_url || "/placeholder-image.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={categories[project.category as keyof typeof categories]?.color || ""}>
                            {categories[project.category as keyof typeof categories]?.label || project.category}
                          </Badge>
                        </div>
                        {project.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-accent text-accent-foreground">
                              Избранное
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {project.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{project.location}</span>
                            </div>
                          )}
                          {project.area && (
                            <div className="flex items-center gap-1">
                              <Maximize2 className="h-4 w-4" />
                              <span>{project.area} м²</span>
                            </div>
                          )}
                          {project.completion_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(project.completion_date).getFullYear()}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <span className="text-sm font-medium text-primary group-hover:underline inline-flex items-center gap-1">
                            Подробнее
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Проекты скоро появятся</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-balance">Хотите такой же проект?</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-balance">
                  Оставьте заявку, и мы воплотим ваши идеи в реальность
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contacts#consultation">
                    Начать свой проект
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
