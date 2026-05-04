import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Building2, Paintbrush, Store, Check, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Услуги - АбсолютПрофРемонт",
  description: "Полный спектр строительных и ремонтных услуг: ремонт квартир, дизайн интерьера, коммерческие помещения",
}

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order")

  const categories = {
    renovation: { title: "Ремонт квартир", icon: Building2, color: "bg-blue-500/10 text-blue-600" },
    design: { title: "Дизайн интерьера", icon: Paintbrush, color: "bg-purple-500/10 text-purple-600" },
    commercial: { title: "Коммерческие помещения", icon: Store, color: "bg-green-500/10 text-green-600" },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance mb-6">Наши услуги</h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Предлагаем полный спектр строительных и ремонтных работ любой сложности. Каждый проект выполняется с
                гарантией качества и точным соблюдением сроков.
              </p>
            </div>
          </div>
        </section>

        {/* Services by Category */}
        {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
          const categoryServices = services?.filter((s) => s.category === categoryKey)
          if (!categoryServices || categoryServices.length === 0) return null

          const Icon = categoryInfo.icon

          return (
            <section key={categoryKey} className="py-16" id={categoryKey}>
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${categoryInfo.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold">{categoryInfo.title}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {categoryServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          <h3 className="font-serif text-2xl font-bold mb-3">{service.title}</h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>

                          {service.features && service.features.length > 0 && (
                            <div className="mb-4 space-y-2">
                              {service.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                              {service.price_from && (
                                <div>
                                  <span className="text-sm text-muted-foreground">от</span>{" "}
                                  <span className="font-bold text-2xl">
                                    {service.price_from.toLocaleString("ru-RU")}
                                  </span>{" "}
                                  <span className="text-sm text-muted-foreground">₽/м²</span>
                                </div>
                              )}
                              <Button variant="outline" asChild>
                                <Link href="/contacts#consultation">Заказать</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* Process Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Как мы работаем</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Прозрачный процесс работы от заявки до сдачи объекта
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Заявка",
                  description: "Вы оставляете заявку на сайте или звоните нам",
                },
                {
                  step: "02",
                  title: "Замер",
                  description: "Выезжаем на объект, делаем замеры и консультируем",
                },
                {
                  step: "03",
                  title: "Договор",
                  description: "Составляем смету, заключаем договор с гарантиями",
                },
                {
                  step: "04",
                  title: "Работа",
                  description: "Выполняем ремонт с контролем качества на каждом этапе",
                },
              ].map((item) => (
                <Card key={item.step}>
                  <CardContent className="p-6">
                    <div className="font-serif text-4xl font-bold text-primary/20 mb-4">{item.step}</div>
                    <h3 className="font-serif text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-balance">
                  Нужна консультация по услугам?
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-balance">
                  Оставьте заявку, и наш специалист свяжется с вами для бесплатной консультации
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contacts#consultation">
                    Получить консультацию
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
