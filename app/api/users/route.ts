import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "user")
        .order("full_name")

    if (error) return NextResponse.json([], { status: 500 })
    return NextResponse.json(data)
}