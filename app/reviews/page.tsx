import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FlampWidget } from "@/components/flamp-widget"

export default function ReviewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Отзывы наших клиентов</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Узнайте, что думают о нас те, кто уже доверил нам свои проекты
              </p>
            </div>

            <FlampWidget />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
