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

      setIsSuccess(true)
      ;(e.target as HTMLFormElement).reset()

      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РїСЂРё РѕС‚РїСЂР°РІРєРµ С„РѕСЂРјС‹")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">
          Р’Р°С€Рµ РёРјСЏ <span className="text-destructive">*</span>
        </Label>
        <Input id="full_name" name="full_name" placeholder="РРІР°РЅ РРІР°РЅРѕРІ" required disabled={isLoading} />
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
            РўРµР»РµС„РѕРЅ <span className="text-destructive">*</span>
          </Label>
          <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required disabled={isLoading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_type">РРЅС‚РµСЂРµСЃСѓСЋС‰Р°СЏ СѓСЃР»СѓРіР°</Label>
        <Select name="service_type" disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Р’С‹Р±РµСЂРёС‚Рµ СѓСЃР»СѓРіСѓ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="renovation">Р РµРјРѕРЅС‚ РєРІР°СЂС‚РёСЂС‹</SelectItem>
            <SelectItem value="design">Р”РёР·Р°Р№РЅ РёРЅС‚РµСЂСЊРµСЂР°</SelectItem>
            <SelectItem value="commercial">РљРѕРјРјРµСЂС‡РµСЃРєРѕРµ РїРѕРјРµС‰РµРЅРёРµ</SelectItem>
            <SelectItem value="other">Р”СЂСѓРіРѕРµ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget_range">Р‘СЋРґР¶РµС‚ РїСЂРѕРµРєС‚Р°</Label>
        <Select name="budget_range" disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Р’С‹Р±РµСЂРёС‚Рµ РґРёР°РїР°Р·РѕРЅ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up_to_500k">Р”Рѕ 500 000 в‚Ѕ</SelectItem>
            <SelectItem value="500k_1m">500 000 - 1 000 000 в‚Ѕ</SelectItem>
            <SelectItem value="1m_2m">1 000 000 - 2 000 000 в‚Ѕ</SelectItem>
            <SelectItem value="2m_plus">Р‘РѕР»РµРµ 2 000 000 в‚Ѕ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          РЎРѕРѕР±С‰РµРЅРёРµ <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїРѕРґСЂРѕР±РЅРµРµ Рѕ РІР°С€РµРј РїСЂРѕРµРєС‚Рµ..."
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
          РЎРїР°СЃРёР±Рѕ! Р’Р°С€Р° Р·Р°СЏРІРєР° РѕС‚РїСЂР°РІР»РµРЅР°. РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ Р±Р»РёР¶Р°Р№С€РµРµ РІСЂРµРјСЏ.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            РћС‚РїСЂР°РІРєР°...
          </>
        ) : (
          "РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        РќР°Р¶РёРјР°СЏ РєРЅРѕРїРєСѓ, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ РїРѕР»РёС‚РёРєРѕР№ РѕР±СЂР°Р±РѕС‚РєРё РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С…
      </p>
    </form>
  )
}
