import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

type RevalidatePayload = {
  _type?: string;
  slug?: string;
  path?: string;
};

function normalizePath(path?: string) {
  if (!path) {
    return undefined;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function inferPathFromPayload(payload: RevalidatePayload) {
  if (payload.path) {
    return normalizePath(payload.path);
  }

  if (!payload.slug) {
    return undefined;
  }

  if (payload._type === "blogPost") {
    return `/clanky/${payload.slug}`;
  }

  if (payload._type === "category") {
    return `/kategorie/${payload.slug}`;
  }

  if (payload._type === "page" && payload.slug === "home") {
    return "/";
  }

  return `/${payload.slug}`;
}

export async function POST(request: Request) {
  if (!env.sanityRevalidateSecret) {
    return NextResponse.json({ ok: false, error: "SANITY_REVALIDATE_SECRET is not configured." }, { status: 500 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  const body = await request.text();

  const isValid = await isValidSignature(body, signature, env.sanityRevalidateSecret);
  if (!isValid) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  let payload: RevalidatePayload = {};
  try {
    payload = JSON.parse(body) as RevalidatePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const tags = new Set<string>(["siteShell"]);
  const path = inferPathFromPayload(payload);

  if (payload._type) {
    tags.add(payload._type);
  }

  if (payload._type === "page" && payload.slug === "home") {
    tags.add("page");
    tags.add("page:home");
    tags.add("route:/");
  }

  if (path) {
    tags.add(`route:${path}`);
  }

  tags.forEach((tag) => revalidateTag(tag, "max"));

  if (payload._type === "siteSettings" || payload._type === "navigation" || payload._type === "footer") {
    revalidatePath("/", "layout");
  }

  if (path) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: {
      path: path ?? null,
      tags: Array.from(tags)
    }
  });
}
