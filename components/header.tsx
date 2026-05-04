import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, User, LogIn } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="АбсолютПрофРемонт" width={48} height={48} className="h-12 w-auto" />
              <div className="hidden sm:flex flex-col">
                <span className="font-serif text-lg font-bold leading-none">АбсолютПрофРемонт</span>
                <span className="text-xs text-muted-foreground">Строим с 2008 года</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary">
              Услуги
            </Link>
            <Link href="/portfolio" className="text-sm font-medium transition-colors hover:text-primary">
              Портфолио
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              О компании
            </Link>
            <Link href="/reviews" className="text-sm font-medium transition-colors hover:text-primary">
              Отзывы
            </Link>
            <Link href="/contacts" className="text-sm font-medium transition-colors hover:text-primary">
              Контакты
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <a
                href="tel:+79050943216"
                className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                +7 (905) 094-32-16
              </a>
              <span className="text-xs text-muted-foreground">{"Пн-Пт: 9:00-18:00"}</span>
            </div>

            {user ? (
              <Button asChild size="sm" variant="outline" className="hidden sm:flex">
                <Link href="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Личный кабинет
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline" className="hidden sm:flex">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Войти
                </Link>
              </Button>
            )}

            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/contacts#consultation">Бесплатная консультация</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
