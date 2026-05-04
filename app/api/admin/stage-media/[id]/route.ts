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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { adminSupabase, error } = await getAdminSupabase()

  if (error || !adminSupabase) {
    return error
  }

  const { data: media, error: mediaError } = await adminSupabase
    .from("stage_media")
    .select("id, file_url")
    .eq("id", id)
    .single()

  if (mediaError || !media) {
    return NextResponse.json({ error: mediaError?.message || "Media not found" }, { status: 404 })
  }

  try {
    const url = new URL(media.file_url)
    const marker = "/object/public/project-media/"
    const index = url.pathname.indexOf(marker)
    const storagePath = index >= 0 ? decodeURIComponent(url.pathname.slice(index + marker.length)) : null

    if (storagePath) {
      await adminSupabase.storage.from("project-media").remove([storagePath])
    }
  } catch {
    // Ignore URL parsing errors and continue deleting DB record.
  }

  const { error: deleteError } = await adminSupabase
    .from("stage_media")
    .delete()
    .eq("id", id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
