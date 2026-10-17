import type { APIRoute } from "astro";
import { timingSafeEqual } from "node:crypto";
import { cleanupTemporaryUploads } from "../../../../lib/temporary-uploads";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET;
  const supplied = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);

  if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(await cleanupTemporaryUploads());
};
