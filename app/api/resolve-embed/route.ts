import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")?.trim();
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  // YouTube — no resolution needed
  const ytFull  = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (ytFull || ytShort) {
    const id = (ytFull ?? ytShort)![1];
    return NextResponse.json({ type: "youtube", embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1` });
  }

  // TikTok full URL — no resolution needed
  const ttFull = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttFull) {
    return NextResponse.json({ type: "tiktok", embedUrl: `https://www.tiktok.com/embed/v2/${ttFull[1]}` });
  }

  // TikTok short URL or anything else — follow redirects server-side
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    });
    const finalUrl = res.url;
    const ttResolved = finalUrl.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (ttResolved) {
      return NextResponse.json({ type: "tiktok", embedUrl: `https://www.tiktok.com/embed/v2/${ttResolved[1]}` });
    }
    return NextResponse.json({ error: "Could not detect embed type from URL" }, { status: 422 });
  } catch {
    return NextResponse.json({ error: "Failed to resolve URL" }, { status: 500 });
  }
}
