import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center py-16">
          <div className="max-w-md mx-auto">
            <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="font-serif text-3xl font-bold mb-4">Проект не найден</h2>
            <p className="text-muted-foreground mb-8 text-balance">
              К сожалению, этот проект не существует или был удален
            </p>
            <Button size="lg" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Вернуться к портфолио
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
