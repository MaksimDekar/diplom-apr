import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { AdminNav } from "@/components/admin/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function ServiceDetails({ id }: { id: string }) {
  const supabase = await createServerClient()

  const { data: service, error } = await supabase.from("services").select("*").eq("id", id).single()

  if (error || !service) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{service.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{service.category}</span>
          </div>
        </div>
        <Badge variant={service.is_published ? "default" : "secondary"}>
          {service.is_published ? "Опубликована" : "Черновик"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Стоимость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{service.price}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Срок выполнения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{service.duration || "Не указан"}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Описание</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{service.description}</p>
        </CardContent>
      </Card>

      {service.features && service.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Что входит в услугу</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {service.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminServiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </div>
            }
          >
            <ServiceDetails id={params.id} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
