import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { ConsultationForm } from "@/components/consultation-form"

export const metadata = {
  title: "Контакты - АбсолютПрофРемонт",
  description: "Свяжитесь с нами для бесплатной консультации. Телефон: +7 (905) 094-32-16, Email: apr.info@bk.ru",
}

export default function ContactsPage() {
  const contactInfo = {
    phone: "+7 (905) 094-32-16",
    email: "apr.info@bk.ru",
    address: "Новосибирск, улица Бориса Богаткова, 210/1 — 810 офис; 8 этаж",
    working_hours: "Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 16:00",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-balance mb-6">Свяжитесь с нами</h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Ответим на все ваши вопросы и предоставим бесплатную консультацию по вашему проекту
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card>
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Телефон</h3>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                  >
                    {contactInfo.email}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Адрес</h3>
                  <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Режим работы</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{contactInfo.working_hours}</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Contact Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Напишите нам</h2>
                <p className="text-muted-foreground mb-6">Заполните форму, и мы свяжемся с вами в ближайшее время</p>
                <ContactForm />
              </div>

              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Как нас найти</h2>
                <p className="text-muted-foreground mb-6">Наш офис находится в Новосибирске</p>
                <Card className="overflow-hidden">
                  <div className="relative overflow-hidden w-full h-[400px]">
                    <a
                      href="https://yandex.ru/maps/org/absolyutprofremont/141730596470/?utm_medium=mapframe&utm_source=maps"
                      className="text-xs text-muted-foreground absolute top-0 left-0 z-10 bg-background/80 px-2 py-1"
                    >
                      АбсолютПрофРемонт
                    </a>
                    <a
                      href="https://yandex.ru/maps/65/novosibirsk/category/construction_and_finishing_works/184107547/?utm_medium=mapframe&utm_source=maps"
                      className="text-xs text-muted-foreground absolute top-5 left-0 z-10 bg-background/80 px-2 py-1"
                    >
                      Строительные и отделочные работы в Новосибирске
                    </a>
                    <a
                      href="https://yandex.ru/maps/65/novosibirsk/category/plumbing_works/184107545/?utm_medium=mapframe&utm_source=maps"
                      className="text-xs text-muted-foreground absolute top-10 left-0 z-10 bg-background/80 px-2 py-1"
                    >
                      Сантехнические работы в Новосибирске
                    </a>
                    <iframe
                      src="https://yandex.ru/map-widget/v1/?indoorLevel=1&ll=82.977513%2C55.036642&mode=search&oid=141730596470&ol=biz&z=17.29"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      allowFullScreen
                      className="relative"
                      title="Карта расположения офиса АбсолютПрофРемонт"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Form Section */}
        <section id="consultation" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Бесплатная консультация</h2>
                <p className="text-lg text-muted-foreground text-balance">
                  Оставьте заявку, и наш специалист свяжется с вами для обсуждения вашего проекта
                </p>
              </div>
              <Card>
                <CardContent className="p-8">
                  <ConsultationForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
