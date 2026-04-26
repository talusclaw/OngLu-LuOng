import { NextResponse } from "next/server";

async function computeToken(password: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminPassword || !adminSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await computeToken(adminPassword, adminSecret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_token");
  return response;
}
