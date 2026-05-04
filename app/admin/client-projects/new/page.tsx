"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react"

const DEFAULT_STAGES = [
  "Демонтаж",
  "Черновая электрика",
  "Черновая сантехника",
  "Стяжка пола",
  "Штукатурка стен",
  "Чистовая электрика",
  "Укладка плитки",
  "Чистовая отделка",
  "Установка сантехники",
  "Финальная уборка",
]

export default function NewClientProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUsersLoading, setIsUsersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<{ id: string; full_name: string | null; email: string | null }[]>([])
  const [stages, setStages] = useState(DEFAULT_STAGES.map((title, i) => ({ title, order_index: i })))
  const [newStage, setNewStage] = useState("")

  const [form, setForm] = useState({
    user_id: "",
    title: "",
    address: "",
    property_type: "",
    property_area: "",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        if (!response.ok) {
          throw new Error("Не удалось загрузить список клиентов")
        }

        const data = await response.json()
        setUsers(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Не удалось загрузить список клиентов")
      } finally {
        setIsUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  const addStage = () => {
    if (!newStage.trim()) return
    setStages([...stages, { title: newStage.trim(), order_index: stages.length }])
    setNewStage("")
  }

  const removeStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index).map((s, i) => ({ ...s, order_index: i })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: project, error: projectError } = await supabase
        .from("client_projects")
        .insert([
          {
            user_id: form.user_id,
            title: form.title,
            address: form.address || null,
            property_type: form.property_type || null,
            property_area: form.property_area ? parseFloat(form.property_area) : null,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
          },
        ])
        .select()
        .single()

      if (projectError) throw projectError

      const stagesData = stages.map((s) => ({
        project_id: project.id,
        title: s.title,
        order_index: s.order_index,
        status: "pending",
      }))

      const { error: stagesError } = await supabase.from("project_stages").insert(stagesData)

      if (stagesError) throw stagesError

      router.push(`/admin/client-projects/${project.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка при создании проекта")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 ml-64">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/client-projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Link>
            </Button>
            <h1 className="font-serif text-3xl font-bold">Новый проект</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Данные проекта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Клиент *</Label>
                  <Select
                    value={form.user_id}
                    onValueChange={(v) => setForm({ ...form, user_id: v })}
                    disabled={isUsersLoading || users.length === 0}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isUsersLoading ? "Загрузка клиентов..." : "Выберите клиента"} />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.full_name || u.email || u.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Название проекта *</Label>
                  <Input
                    placeholder="Ремонт квартиры на ул. Ленина"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Адрес объекта</Label>
                  <Input
                    placeholder="ул. Ленина, 1, кв. 10"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Тип объекта</Label>
                    <Input
                      placeholder="Квартира, офис..."
                      value={form.property_type}
                      onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Площадь (м²)</Label>
                    <Input
                      type="number"
                      placeholder="65"
                      value={form.property_area}
                      onChange={(e) => setForm({ ...form, property_area: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Дата начала</Label>
                    <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Плановая дата окончания</Label>
                    <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Этапы ремонта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <span className="flex-1 text-sm">{stage.title}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeStage(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Добавить этап..."
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStage())}
                  />
                  <Button type="button" variant="outline" onClick={addStage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading || isUsersLoading || users.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                "Создать проект"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
