import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const adminSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

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
