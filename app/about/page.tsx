import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Award, Target, Users, Shield, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "О компании - АбсолютПрофРемонт",
  description: "Узнайте больше о нашей команде профессионалов с 10-летним опытом в строительстве и ремонте",
}

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: team } = await supabase.from("team_members").select("*").eq("is_active", true).order("sort_order")

  const { data: settings } = await supabase.from("site_settings").select("*").single()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance mb-6">О нашей компании</h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 text-pretty">
                  {settings?.about_text ||
                    "Мы — команда профессионалов с более чем 10-летним опытом в сфере строительства и ремонта."}
                </p>
                <div className="flex flex-wrap gap-8">
                  <div>
                    <div className="font-serif text-3xl font-bold text-primary">10+</div>
                    <div className="text-sm text-muted-foreground">лет на рынке</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">проектов</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">довольных клиентов</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/construction-team-at-work.jpg"
                  alt="Команда строителей за работой"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Наши ценности</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Принципы, которыми мы руководствуемся в работе
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Award,
                  title: "Качество",
                  description: "Используем только проверенные материалы и технологии",
                },
                {
                  icon: Target,
                  title: "Точность",
                  description: "Соблюдаем сроки и бюджет каждого проекта",
                },
                {
                  icon: Users,
                  title: "Команда",
                  description: "Опытные специалисты с профильным образованием",
                },
                {
                  icon: Shield,
                  title: "Гарантия",
                  description: "3 года гарантии на все выполненные работы",
                },
              ].map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="text-center">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {team && team.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Наша команда</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                  Профессионалы, которые воплотят ваш проект в жизнь
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="relative h-64 bg-muted">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url || "/placeholder.svg"}
                          alt={member.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Users className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-bold mb-1">{member.full_name}</h3>
                      <p className="text-sm text-primary mb-3">{member.position}</p>
                      {member.bio && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{member.bio}</p>}
                      {member.experience_years && (
                        <div className="text-sm">
                          <span className="font-semibold">Опыт:</span> {member.experience_years} лет
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-balance">
                  Готовы работать с профессионалами?
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-balance">
                  Свяжитесь с нами для обсуждения вашего проекта
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contacts">
                    Связаться с нами
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
