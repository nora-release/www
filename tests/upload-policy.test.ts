import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createUploadTickets,
  maxUploadBytes,
  signUploadClaim,
  uploadLifetimeMs,
  validateUploadMetadata,
  verifyUploadTicket,
} from "../src/lib/upload-policy.ts";

const secret = "unit-test-signing-secret-only";
const now = 1_790_000_000_000;
const metadata = { fileName: "screenshot.png", contentType: "image/png", sizeBytes: maxUploadBytes };

function rejectsResponse(action: () => unknown, status: number) {
  assert.throws(action, (error: unknown) => error instanceof Response && error.status === status);
}

test("retains 5 MB per file, 15 MB total and five-file limits", () => {
  assert.equal(validateUploadMetadata([metadata, metadata, metadata]).length, 3);
  assert.equal(validateUploadMetadata(Array.from({ length: 5 }, () => ({ ...metadata, sizeBytes: 1 }))).length, 5);
  rejectsResponse(() => validateUploadMetadata([{ ...metadata, sizeBytes: maxUploadBytes + 1 }]), 400);
  rejectsResponse(() => validateUploadMetadata([metadata, metadata, metadata, { ...metadata, sizeBytes: 1 }]), 400);
  rejectsResponse(() => validateUploadMetadata(Array.from({ length: 6 }, () => ({ ...metadata, sizeBytes: 1 }))), 400);
});

test("rejects empty, fractional, non-finite and dishonest sizes and unsafe metadata", () => {
  for (const sizeBytes of [0, -1, 1.5, NaN, Infinity, "5"]) {
    rejectsResponse(() => validateUploadMetadata([{ ...metadata, sizeBytes }]), 400);
  }
  rejectsResponse(() => validateUploadMetadata([{ ...metadata, fileName: "file\r\nheader" }]), 400);
  rejectsResponse(() => validateUploadMetadata([{ ...metadata, contentType: "text/plain\r\nX-Header: value" }]), 400);
});

test("signed references are bound to the current user and cannot be modified", () => {
  const [{ ticket }] = createUploadTickets([metadata], "user-a", secret, now);
  const claim = verifyUploadTicket(ticket, "user-a", secret, now);
  assert.equal(claim.sizeBytes, maxUploadBytes);
  assert.ok(!claim.pathname.includes("user-a"));
  rejectsResponse(() => verifyUploadTicket(ticket, "user-b", secret, now), 403);
  rejectsResponse(() => verifyUploadTicket(ticket.slice(0, -2) + "xx", "user-a", secret, now), 400);
  rejectsResponse(() => verifyUploadTicket(ticket, "user-a", "different-secret", now), 400);
});

test("rejects arbitrary URLs, path traversal and expiry without fetching anything", () => {
  const [{ ticket }] = createUploadTickets([metadata], "user-a", secret, now);
  const claim = verifyUploadTicket(ticket, "user-a", secret, now);
  for (const pathname of ["https://169.254.169.254/latest/meta-data", "https://other-store.private.blob.vercel-storage.com/file", claim.pathname + "/../other"]) {
    rejectsResponse(() => verifyUploadTicket(signUploadClaim({ ...claim, pathname }, secret), "user-a", secret, now), 400);
  }
  assert.ok(verifyUploadTicket(ticket, "user-a", secret, now + uploadLifetimeMs - 1));
  rejectsResponse(() => verifyUploadTicket(ticket, "user-a", secret, now + uploadLifetimeMs), 400);
  rejectsResponse(() => verifyUploadTicket(ticket, "user-a", secret, now - 5_001), 400);
});
