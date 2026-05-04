"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Briefcase, Users, MessageSquare, Mail, Settings, HardHat } from "lucide-react"

const navigation = [
  { name: "Главная", href: "/admin", icon: LayoutDashboard },
  { name: "Услуги", href: "/admin/services", icon: FileText },
  { name: "Проекты", href: "/admin/projects", icon: Briefcase },
  { name: "Проекты клиентов", href: "/admin/client-projects", icon: HardHat },
  { name: "Команда", href: "/admin/team", icon: Users },
  { name: "Обращения", href: "/admin/contacts", icon: MessageSquare },
  { name: "Консультации", href: "/admin/consultations", icon: Mail },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif text-xl font-bold">
            АПР
          </div>
          <div>
            <div className="font-serif text-lg font-bold leading-none">АбсолютПрофРемонт</div>
            <div className="text-xs text-muted-foreground">Админ-панель</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Вернуться на сайт
          </Link>
        </div>
      </div>
    </aside>
  )
}