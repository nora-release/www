import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const maxUploadFiles = 5;
export const maxUploadBytes = 5 * 1024 * 1024;
export const maxUploadTotalBytes = 15 * 1024 * 1024;
export const uploadLifetimeMs = 60 * 60 * 1000;
export const uploadPrefix = "feedback-staging/";

export type UploadMetadata = {
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

export type UploadClaim = UploadMetadata & {
  pathname: string;
  user: string;
  createdAt: number;
  expiresAt: number;
};

export function uploadUserKey(userId: string): string {
  return createHash("sha256").update(userId).digest("hex");
}

export function validateUploadMetadata(value: unknown): UploadMetadata[] {
  if (!Array.isArray(value) || value.length > maxUploadFiles) {
    throw new Response("You can upload up to 5 files.", { status: 400 });
  }

  const files = value.map((entry): UploadMetadata => {
    if (!entry || typeof entry !== "object") {
      throw new Response("Attachment metadata is invalid.", { status: 400 });
    }

    const { fileName, contentType, sizeBytes } = entry as Partial<UploadMetadata>;

    if (
      typeof fileName !== "string" ||
      !fileName.trim() ||
      fileName.trim().length > 180 ||
      /[\x00-\x1f\x7f]/u.test(fileName) ||
      typeof contentType !== "string" ||
      !/^[\w!#$&^.+-]+\/[\w!#$&^.+-]+$/u.test(contentType) ||
      typeof sizeBytes !== "number" ||
      !Number.isSafeInteger(sizeBytes) ||
      !sizeBytes || sizeBytes < 1 || sizeBytes > maxUploadBytes
    ) {
      throw new Response("Each attachment must have a valid name, type, and size of 1 byte to 5 MB.", { status: 400 });
    }

    return { fileName: fileName.trim(), contentType, sizeBytes };
  });

  if (files.reduce((sum, file) => sum + file.sizeBytes, 0) > maxUploadTotalBytes) {
    throw new Response("Uploaded files are too large.", { status: 400 });
  }

  return files;
}

export function signUploadClaim(claim: UploadClaim, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claim)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function createUploadTickets(
  files: unknown,
  userId: string,
  secret: string,
  now = Date.now(),
) {
  const user = uploadUserKey(userId);

  return validateUploadMetadata(files).map((file) => {
    const claim: UploadClaim = {
      ...file,
      user,
      createdAt: now,
      expiresAt: now + uploadLifetimeMs,
      pathname: `${uploadPrefix}${user}/${now}/${randomUUID()}`,
    };

    return { pathname: claim.pathname, ticket: signUploadClaim(claim, secret) };
  });
}

export function verifyUploadTicket(
  ticket: unknown,
  userId: string,
  secret: string,
  now = Date.now(),
): UploadClaim {
  if (typeof ticket !== "string" || ticket.length > 2048) {
    throw new Response("Attachment ticket is invalid.", { status: 400 });
  }

  const [payload, signature, extra] = ticket.split(".");
  const expected = createHmac("sha256", secret).update(payload || "").digest();
  const supplied = Buffer.from(signature || "", "base64url");

  if (extra || supplied.length !== expected.length || !timingSafeEqual(expected, supplied)) {
    throw new Response("Attachment ticket is invalid.", { status: 400 });
  }

  let claim: UploadClaim;

  try {
    claim = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new Response("Attachment ticket is invalid.", { status: 400 });
  }

  if (claim.user !== uploadUserKey(userId)) {
    throw new Response("Attachment belongs to another user.", { status: 403 });
  }

  validateUploadMetadata([claim]);

  if (
    !Number.isSafeInteger(claim.createdAt) ||
    !Number.isSafeInteger(claim.expiresAt) ||
    claim.createdAt > now + 5_000 ||
    claim.expiresAt !== claim.createdAt + uploadLifetimeMs ||
    claim.expiresAt <= now ||
    !new RegExp(`^${uploadPrefix}${claim.user}/${claim.createdAt}/[0-9a-f-]{36}$`, "u").test(claim.pathname)
  ) {
    throw new Response("Attachment ticket has expired or is invalid. Please upload the file again.", { status: 400 });
  }

  return claim;
}
