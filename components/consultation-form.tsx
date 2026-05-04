"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function ConsultationForm() {
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
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || null,
      property_type: (formData.get("property_type") as string) || null,
      property_area: formData.get("property_area") ? Number.parseFloat(formData.get("property_area") as string) : null,
      preferred_date: (formData.get("preferred_date") as string) || null,
      preferred_time: (formData.get("preferred_time") as string) || null,
      message: (formData.get("message") as string) || null,
    }

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error: insertError } = await supabase
        .from("consultation_requests")
        .insert([{ ...data, user_id: user?.id ?? null }])

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
        <Label htmlFor="cons_full_name">
          Р’Р°С€Рµ РёРјСЏ <span className="text-destructive">*</span>
        </Label>
        <Input id="cons_full_name" name="full_name" placeholder="РРІР°РЅ РРІР°РЅРѕРІ" required disabled={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cons_phone">
            РўРµР»РµС„РѕРЅ <span className="text-destructive">*</span>
          </Label>
          <Input id="cons_phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cons_email">Email</Label>
          <Input id="cons_email" name="email" type="email" placeholder="ivan@example.com" disabled={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="property_type">РўРёРї РѕР±СЉРµРєС‚Р°</Label>
          <Input id="property_type" name="property_type" placeholder="РљРІР°СЂС‚РёСЂР°, РѕС„РёСЃ..." disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="property_area">РџР»РѕС‰Р°РґСЊ (РјВІ)</Label>
          <Input id="property_area" name="property_area" type="number" step="0.1" placeholder="65" disabled={isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preferred_date">РџСЂРµРґРїРѕС‡С‚РёС‚РµР»СЊРЅР°СЏ РґР°С‚Р°</Label>
          <Input id="preferred_date" name="preferred_date" type="date" disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferred_time">РџСЂРµРґРїРѕС‡С‚РёС‚РµР»СЊРЅРѕРµ РІСЂРµРјСЏ</Label>
          <Input id="preferred_time" name="preferred_time" type="time" placeholder="14:00" disabled={isLoading} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cons_message">РљРѕРјРјРµРЅС‚Р°СЂРёР№</Label>
        <Textarea
          id="cons_message"
          name="message"
          placeholder="Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ Рѕ РІР°С€РµРј РїСЂРѕРµРєС‚Рµ..."
          rows={4}
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
          РЎРїР°СЃРёР±Рѕ! Р—Р°СЏРІРєР° РЅР° РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЋ РѕС‚РїСЂР°РІР»РµРЅР°. РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РІ СѓРєР°Р·Р°РЅРЅРѕРµ РІСЂРµРјСЏ.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            РћС‚РїСЂР°РІРєР°...
          </>
        ) : (
          "Р—Р°РєР°Р·Р°С‚СЊ РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЋ"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        РќР°Р¶РёРјР°СЏ РєРЅРѕРїРєСѓ, РІС‹ СЃРѕРіР»Р°С€Р°РµС‚РµСЃСЊ СЃ РїРѕР»РёС‚РёРєРѕР№ РѕР±СЂР°Р±РѕС‚РєРё РїРµСЂСЃРѕРЅР°Р»СЊРЅС‹С… РґР°РЅРЅС‹С…
      </p>
    </form>
  )
}
