"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { DeleteClientProjectButton } from "@/components/admin/delete-client-project-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderSearch } from "lucide-react"

type ClientProjectCard = {
  id: string
  title: string
  address: string | null
  status: string
  property_type: string | null
  property_area: number | null
  client_name: string | null
  client_email: string | null
  completed_stages: number
  total_stages: number
}

type ClientProjectsBoardProps = {
  projects: ClientProjectCard[]
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }>
}

export function ClientProjectsBoard({ projects, statusMap }: ClientProjectsBoardProps) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesStatus = statusFilter === "all" || project.status === statusFilter
      const haystack = [
        project.title,
        project.address,
        project.client_name,
        project.client_email,
        project.property_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery)
      return matchesStatus && matchesQuery
    })
  }, [projects, query, statusFilter])

  const summary = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((project) => project.status === "active").length,
      paused: projects.filter((project) => project.status === "paused").length,
      completed: projects.filter((project) => project.status === "completed").length,
    }),
    [projects]
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="mt-1 text-xs text-muted-foreground">Всего клиентских проектов</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-2xl font-bold text-primary">{summary.active}</div>
            <p className="mt-1 text-xs text-muted-foreground">В работе</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-2xl font-bold">{summary.paused}</div>
            <p className="mt-1 text-xs text-muted-foreground">Приостановлены</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
            <p className="mt-1 text-xs text-muted-foreground">Завершены</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Поиск и фильтрация</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input
            placeholder="Найти проект по названию, адресу, клиенту или email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">В работе</SelectItem>
              <SelectItem value="paused">Приостановлены</SelectItem>
              <SelectItem value="completed">Завершены</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <FolderSearch className="mb-4 h-12 w-12 text-muted-foreground" />
            <div className="font-medium">По текущим фильтрам ничего не найдено</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Попробуйте изменить запрос или выбрать другой статус.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => {
            const status = statusMap[project.status] ?? statusMap.active
            const progress = project.total_stages > 0
              ? Math.round((project.completed_stages / project.total_stages) * 100)
              : 0

            return (
              <Card key={project.id} className="transition-colors hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.address && <p className="mt-1 text-sm text-muted-foreground">{project.address}</p>}
                      <p className="text-sm text-muted-foreground">
                        Клиент: {project.client_name || project.client_email || "—"}
                      </p>
                      {project.client_name && project.client_email && (
                        <p className="text-xs text-muted-foreground">{project.client_email}</p>
                      )}
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {project.property_type && <span>{project.property_type}</span>}
                      {project.property_area && <span>{project.property_area} м²</span>}
                      <span>Этапов: {project.completed_stages}/{project.total_stages}</span>
                      {project.total_stages > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span>{progress}%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/client-projects/${project.id}`}>Управление</Link>
                      </Button>
                      <DeleteClientProjectButton
                        projectId={project.id}
                        projectTitle={project.title}
                        variant="outline"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
