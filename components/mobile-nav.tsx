"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col gap-6 py-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif text-xl font-bold">
              АПР
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-none">АбсолютПрофРемонт</span>
              <span className="text-xs text-muted-foreground">Строим с 2014 года</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/services"
              className="text-base font-medium transition-colors hover:text-primary py-2"
              onClick={() => setOpen(false)}
            >
              Услуги
            </Link>
            <Link
              href="/portfolio"
              className="text-base font-medium transition-colors hover:text-primary py-2"
              onClick={() => setOpen(false)}
            >
              Портфолио
            </Link>
            <Link
              href="/about"
              className="text-base font-medium transition-colors hover:text-primary py-2"
              onClick={() => setOpen(false)}
            >
              О компании
            </Link>
            <Link
              href="/reviews"
              className="text-base font-medium transition-colors hover:text-primary py-2"
              onClick={() => setOpen(false)}
            >
              Отзывы
            </Link>
            <Link
              href="/contacts"
              className="text-base font-medium transition-colors hover:text-primary py-2"
              onClick={() => setOpen(false)}
            >
              Контакты
            </Link>
          </nav>

          <div className="pt-6 border-t">
            <a
              href="tel:+74951234567"
              className="flex items-center gap-2 text-base font-semibold hover:text-primary transition-colors mb-4"
            >
              <Phone className="h-5 w-5" />
              +7 (495) 123-45-67
            </a>
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link href="/contacts#consultation">Бесплатная консультация</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
