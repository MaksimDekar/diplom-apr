import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="АбсолютПрофРемонт" width={180} height={48} className="h-12 w-auto" priority />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Профессиональный ремонт и строительство в Новосибирске с 2008 года
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services#renovation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Ремонт квартир
                </Link>
              </li>
              <li>
                <Link
                  href="/services#design"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Дизайн интерьера
                </Link>
              </li>
              <li>
                <Link
                  href="/services#commercial"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Коммерческие помещения
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Наши работы
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+74951234567"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +7 (905) 094-32-16
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@absolutprofremont.ru"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  apr.info@bk.ru
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>г. Новосибирск, улица Бориса Богаткова, 210/1 — 810 офис; 8 этаж</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 ООО "АбсолютПрофРемонт". Все права защищены.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
