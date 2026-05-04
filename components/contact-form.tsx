"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service_type: formData.get("service_type") as string,
      message: formData.get("message") as string,
      budget_range: formData.get("budget_range") as string,
      preferred_contact_method: "email",
    }

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from("contact_requests").insert([data])

      if (insertError) throw insertError

      // 🔴 ОТПРАВКА В TELEGRAM - НАЧАЛО
      try {
        const telegramResponse = await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formType: 'contact',
            name: data.full_name,
            phone: data.phone,
            email: data.email,
            service_type: data.service_type,
            message: data.message,
            budget: data.budget_range,
          }),
        })

        const telegramResult = await telegramResponse.json()
        
        if (!telegramResponse.ok) {
          console.error('Ошибка отправки в Telegram:', telegramResult.error)
          // Можно залогировать ошибку, но не показывать пользователю
        } else {
          console.log('✅ Уведомление отправлено в Telegram')
        }
      } catch (telegramError) {
        console.error('Ошибка при отправке в Telegram:', telegramError)
        // Продолжаем выполнение даже при ошибке Telegram
      }
      // 🔴 ОТПРАВКА В TELEGRAM - КОНЕЦ

      setIsSuccess(true)
      ;(e.target as HTMLFormElement).reset()

      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка при отправке формы")
    } finally {
      setIsLoading(false)
    }
  }

  // 🔴 ВАЖНО: Создайте API endpoint для Telegram
  // Создайте файл: app/api/telegram/route.ts

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">
          Ваше имя <span className="text-destructive">*</span>
        </Label>
        <Input id="full_name" name="full_name" placeholder="Иван Иванов" required disabled={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input id="email" name="email" type="email" placeholder="ivan@example.com" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Телефон <span className="text-destructive">*</span>
          </Label>
          <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required disabled={isLoading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_type">Интересующая услуга</Label>
        <Select name="service_type" disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите услугу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="renovation">Ремонт квартиры</SelectItem>
            <SelectItem value="design">Дизайн интерьера</SelectItem>
            <SelectItem value="commercial">Коммерческое помещение</SelectItem>
            <SelectItem value="other">Другое</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget_range">Бюджет проекта</Label>
        <Select name="budget_range" disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите диапазон" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up_to_500k">До 500 000 ₽</SelectItem>
            <SelectItem value="500k_1m">500 000 - 1 000 000 ₽</SelectItem>
            <SelectItem value="1m_2m">1 000 000 - 2 000 000 ₽</SelectItem>
            <SelectItem value="2m_plus">Более 2 000 000 ₽</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Сообщение <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Расскажите подробнее о вашем проекте..."
          rows={5}
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {isSuccess && (
        <div className="p-4 bg-green-500/10 text-green-700 dark:text-green-400 text-sm rounded-lg border border-green-500/20">
          Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Отправка...
          </>
        ) : (
          "Отправить заявку"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
      </p>
    </form>
  )
}
