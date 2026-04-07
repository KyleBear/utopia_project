import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NOT_SET";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "NOT_SET";

  return NextResponse.json({
    url_prefix: url.slice(0, 30),
    key_prefix: key.slice(0, 20),
    key_length: key.length,
  });
}
