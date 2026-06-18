import type { APIRoute } from "astro";
import { getFeedbackAttachmentDownload } from "../../../../../lib/feedback";

export const prerender = false;

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

async function errorResponse(error: unknown) {
  if (error instanceof Response) {
    const message = await error.text().catch(() => "") || "Request failed.";

    return json(
      { error: message },
      {
        status: error.status,
      },
    );
  }

  const message = error instanceof Error ? error.message : "Request failed.";

  return json({ error: message }, { status: 500 });
}

function getContentDisposition(fileName: string): string {
  const fallbackName = fileName.replace(/["\\\r\n]/gu, "_").slice(0, 180) || "attachment";
  const encodedName = encodeURIComponent(fileName);

  return `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`;
}

export const GET: APIRoute = async (context) => {
  const feedbackId = context.params.id;
  const attachmentId = context.params.attachmentId;

  if (!feedbackId || !attachmentId) {
    return json({ error: "Attachment not found." }, { status: 404 });
  }

  try {
    const attachment = await getFeedbackAttachmentDownload(context.locals, feedbackId, attachmentId);

    return new Response(attachment.content, {
      headers: {
        "Content-Disposition": getContentDisposition(attachment.fileName),
        "Content-Length": String(attachment.content.byteLength),
        "Content-Type": attachment.contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
};
