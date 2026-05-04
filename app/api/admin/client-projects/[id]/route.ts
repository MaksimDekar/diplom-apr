import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

async function getAdminSupabase() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return {
    adminSupabase: createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    ),
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { adminSupabase, error } = await getAdminSupabase()

  if (error || !adminSupabase) {
    return error
  }

  const { data: project, error: projectError } = await adminSupabase
    .from("client_projects")
    .select("*")
    .eq("id", id)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: projectError?.message || "Project not found" }, { status: 404 })
  }

  const [{ data: clientProfile }, { data: stages }, { data: media }] = await Promise.all([
    adminSupabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", project.user_id)
      .single(),
    adminSupabase
      .from("project_stages")
      .select("*")
      .eq("project_id", id)
      .order("order_index"),
    adminSupabase
      .from("stage_media")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ])

  return NextResponse.json({
    project: {
      ...project,
      profiles: clientProfile || null,
    },
    stages: stages || [],
    media: media || [],
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { adminSupabase, error } = await getAdminSupabase()

  if (error || !adminSupabase) {
    return error
  }

  const { data: media } = await adminSupabase
    .from("stage_media")
    .select("file_url")
    .eq("project_id", id)

  const storagePaths = (media || [])
    .map((item) => {
      try {
        const url = new URL(item.file_url)
        const marker = "/object/public/project-media/"
        const index = url.pathname.indexOf(marker)
        return index >= 0 ? decodeURIComponent(url.pathname.slice(index + marker.length)) : null
      } catch {
        return null
      }
    })
    .filter((path): path is string => Boolean(path))

  if (storagePaths.length > 0) {
    await adminSupabase.storage.from("project-media").remove(storagePaths)
  }

  await adminSupabase.from("stage_media").delete().eq("project_id", id)
  await adminSupabase.from("project_stages").delete().eq("project_id", id)

  const { error: projectDeleteError } = await adminSupabase
    .from("client_projects")
    .delete()
    .eq("id", id)

  if (projectDeleteError) {
    return NextResponse.json({ error: projectDeleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
