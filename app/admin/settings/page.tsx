import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminNav } from "@/components/admin/admin-nav"
import { LogoutButton } from "@/components/admin/logout-button"
import { Building2, Phone, Mail, MapPin, Clock } from "lucide-react"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: settings } = await supabase.from("site_settings").select("*").single()

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold mb-2">Настройки сайта</h1>
              <p className="text-muted-foreground">Основная информация о компании</p>
            </div>
            <LogoutButton />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Информация о компании
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-1">Название компании</div>
                  <div className="text-muted-foreground">{settings?.company_name || "Не указано"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Описание</div>
                  <div className="text-muted-foreground">{settings?.company_description || "Не указано"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">О компании</div>
                  <div className="text-muted-foreground">{settings?.about_text || "Не указано"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Лет на рынке</div>
                  <div className="text-muted-foreground">{settings?.years_of_experience || 0} лет</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Телефон
                  </div>
                  <div className="text-muted-foreground">{settings?.phone || "Не указан"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <div className="text-muted-foreground">{settings?.email || "Не указан"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Адрес
                  </div>
                  <div className="text-muted-foreground">{settings?.address || "Не указан"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Режим работы
                  </div>
                  <div className="text-muted-foreground">{settings?.working_hours || "Не указан"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Социальные сети</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-semibold mb-1">VK</div>
                  <div className="text-muted-foreground">{settings?.social_vk || "Не указан"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Instagram</div>
                  <div className="text-muted-foreground">{settings?.social_instagram || "Не указан"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Telegram</div>
                  <div className="text-muted-foreground">{settings?.social_telegram || "Не указан"}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">WhatsApp</div>
                  <div className="text-muted-foreground">{settings?.social_whatsapp || "Не указан"}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/20">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Для редактирования настроек обратитесь к администратору системы или отредактируйте данные напрямую в
                  Supabase Dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
