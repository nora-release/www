import { del, get, head, list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import type { FeedbackUpload } from "./feedback";
import {
  createUploadTickets,
  maxUploadFiles,
  uploadLifetimeMs,
  uploadPrefix,
  uploadUserKey,
  validateUploadMetadata,
  verifyUploadTicket,
} from "./upload-policy";

type UploadUser = { id: string } | null | undefined;

function getSigningSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET || process.env.NORA_SESSION_SECRET || process.env.SESSION_SECRET;

  if (!secret) {
    throw new Response("Attachment uploads are not configured.", { status: 503 });
  }

  return secret.trim().replace(/^(["'])(.*)\1$/u, "$2");
}

function requireUser(user: UploadUser): { id: string } {
  if (!user?.id) {
    throw new Response("Sign in to upload attachments.", { status: 401 });
  }

  return user;
}

function requireSameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    throw new Response("Invalid request origin.", { status: 403 });
  }
}

export async function handleTemporaryUpload(request: Request, user: UploadUser) {
  const body = await request.json();

  if (body?.action === "prepare") {
    requireSameOrigin(request);
    const owner = requireUser(user);
    const files = validateUploadMetadata(body.files);
    const pending = await list({ prefix: `${uploadPrefix}${uploadUserKey(owner.id)}/`, limit: 100 });
    const stale = pending.blobs.filter((blob) => blob.uploadedAt.getTime() < Date.now() - 2 * uploadLifetimeMs);

    if (stale.length) {
      await del(stale.map((blob) => blob.pathname));
    }

    if (pending.hasMore || pending.blobs.length - stale.length + files.length > 20) {
      throw new Response("Too many pending attachments. Please try again later.", { status: 429 });
    }

    return Response.json({ uploads: createUploadTickets(files, owner.id, getSigningSecret()) });
  }

  if (body?.type !== "blob.generate-client-token" && body?.type !== "blob.upload-completed") {
    throw new Response("Invalid upload request.", { status: 400 });
  }

  const response = await handleUpload({
    request,
    body: body as HandleUploadBody,
    onBeforeGenerateToken: async (pathname, ticket, multipart) => {
      requireSameOrigin(request);
      const owner = requireUser(user);
      const claim = verifyUploadTicket(ticket, owner.id, getSigningSecret());

      if (pathname !== claim.pathname || multipart) {
        throw new Response("Invalid attachment path.", { status: 400 });
      }

      return {
        allowedContentTypes: [claim.contentType],
        maximumSizeInBytes: claim.sizeBytes,
        validUntil: claim.expiresAt,
        addRandomSuffix: false,
        allowOverwrite: false,
      };
    },
  });

  return Response.json(response);
}

export async function readTemporaryUploads(value: unknown, user: UploadUser) {
  const owner = requireUser(user);

  if (!Array.isArray(value) || value.length > maxUploadFiles) {
    throw new Response("You can upload up to 5 files.", { status: 400 });
  }

  const claims = value.map((entry) => verifyUploadTicket(entry, owner.id, getSigningSecret()));
  validateUploadMetadata(claims);

  if (new Set(claims.map((claim) => claim.pathname)).size !== claims.length) {
    throw new Response("Duplicate attachment reference.", { status: 400 });
  }

  const uploads: FeedbackUpload[] = [];

  for (const claim of claims) {
    // Only signed pathnames are passed to the SDK; client URLs are never fetched.
    const metadata = await head(claim.pathname);

    if (metadata.pathname !== claim.pathname || metadata.size !== claim.sizeBytes || metadata.contentType !== claim.contentType) {
      throw new Response("Attachment metadata does not match the upload.", { status: 400 });
    }

    const result = await get(claim.pathname, { access: "private" });

    if (!result || result.statusCode !== 200) {
      throw new Response("Attachment could not be loaded. Please upload it again.", { status: 400 });
    }

    const reader = result.stream.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;

    try {
      while (true) {
        const chunk = await reader.read();

        if (chunk.done) break;

        bytes += chunk.value.byteLength;

        if (bytes > claim.sizeBytes) {
          await reader.cancel();
          throw new Response("Attachment is too large.", { status: 400 });
        }

        chunks.push(chunk.value);
      }
    } finally {
      reader.releaseLock();
    }

    if (bytes !== claim.sizeBytes) {
      throw new Response("Attachment size is invalid.", { status: 400 });
    }

    uploads.push({
      fileName: claim.fileName,
      contentType: claim.contentType,
      sizeBytes: bytes,
      dataBase64: Buffer.concat(chunks).toString("base64"),
    });
  }

  return { uploads, pathnames: claims.map((claim) => claim.pathname) };
}

export async function deleteTemporaryUploads(pathnames: string[]) {
  if (pathnames.length) await del(pathnames);
}

export async function cleanupTemporaryUploads() {
  const pending = await list({ prefix: uploadPrefix, limit: 1000 });
  const expired = pending.blobs
    .filter((blob) => blob.uploadedAt.getTime() < Date.now() - 2 * uploadLifetimeMs)
    .slice(0, 100);

  await deleteTemporaryUploads(expired.map((blob) => blob.pathname));

  return { deleted: expired.length, more: pending.hasMore || expired.length === 100 };
}
