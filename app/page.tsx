import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Building2, Paintbrush, Store, Award, ArrowRight, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .limit(3)

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .eq("is_published", true)
    .limit(3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 font-serif">
                  Профессиональный ремонт любой сложности
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
                  Создаем комфортные и качественные пространства для жизни и бизнеса. Более 10 лет опыта, гарантия на
                  все виды работ.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/contacts#consultation">
                      Получить консультацию
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent" asChild>
                    <Link href="/portfolio">Наши работы</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/modern-apartment-renovation-interior-design.jpg"
                  alt="Современный интерьер после ремонта"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <Card className="absolute -bottom-6 -left-6 bg-background/95 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-2xl">10+</div>
                        <div className="text-sm text-muted-foreground">лет на рынке</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-serif text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Завершенных проектов</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Лет опыта</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl font-bold text-primary mb-2">3 года</div>
                <div className="text-sm text-muted-foreground">Гарантии</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Наши услуги</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Предлагаем полный спектр строительных и ремонтных работ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {services?.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      {service.category === "renovation" && <Building2 className="h-6 w-6 text-primary" />}
                      {service.category === "design" && <Paintbrush className="h-6 w-6 text-primary" />}
                      {service.category === "commercial" && <Store className="h-6 w-6 text-primary" />}
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>
                    {service.price_from && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">от</span>{" "}
                        <span className="font-bold text-lg">{service.price_from.toLocaleString("ru-RU")}</span>{" "}
                        <span className="text-muted-foreground">₽/м²</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/services">
                  Все услуги
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Наши работы</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Примеры реализованных проектов разной сложности
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {projects?.map((project) => (
                <Card key={project.id} className="overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image_url || "/placeholder-image.jpg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{project.area} м²</span>
                      <span className="text-muted-foreground">{project.duration_days} дней</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/portfolio">
                  Все проекты
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Reviews Section - Flamp Widget */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Отзывы клиентов</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Что говорят наши клиенты о работе с нами
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-orange-200 dark:border-orange-900">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <img
                      src="https://flamp.ru/favicon.ico"
                      alt="Flamp"
                      className="w-8 h-8"
                    />
                    <span className="text-2xl font-bold text-orange-600">Мы есть на Флампе!</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Читайте реальные отзывы наших клиентов на независимой платформе Flamp
                  </p>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <a
                      href="https://novosibirsk.flamp.ru/firm/absolyutprofremont_remontno_otdelochnaya_kompaniya-70000001020667161"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Смотреть отзывы на Флампе
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/reviews">
                  Все отзывы
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-balance">Готовы начать свой проект?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-balance">
              Получите бесплатную консультацию и расчет стоимости вашего проекта
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contacts#consultation">
                Связаться с нами
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
