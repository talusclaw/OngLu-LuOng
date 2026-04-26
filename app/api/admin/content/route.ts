import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const GITHUB_OWNER = "talusclaw";
const GITHUB_REPO = "OngLu-LuOng";
const GITHUB_BRANCH = "main";
const CONTENT_PATH = "data/content.json";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;

  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;
  if (!password || !secret) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(password));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return token === expected;
}

async function getGitHubFile() {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  return res.json() as Promise<{ sha: string; content: string }>;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const file = await getGitHubFile();
    const content = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    return NextResponse.json({ content, sha: file.sha });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await request.json();
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  try {
    const file = await getGitHubFile();
    const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update site content via admin panel`,
          content: encoded,
          sha: file.sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
