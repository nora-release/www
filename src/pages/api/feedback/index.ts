import type { APIRoute } from "astro";
import {
  createFeedbackItem,
  listFeedbackContributors,
  listFeedbackItems,
} from "../../../lib/feedback";

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

function getFormString(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function isUploadFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

async function fileToPayload(file: File) {
  return {
    contentType: file.type || "application/octet-stream",
    dataBase64: bytesToBase64(new Uint8Array(await file.arrayBuffer())),
    fileName: file.name || "attachment",
    sizeBytes: file.size,
  };
}

async function parseCreatePayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return request.json().catch(() => ({}));
  }

  const formData = await request.formData();
  const attachments = await Promise.all(
    formData
      .getAll("attachments")
      .filter((entry): entry is File => isUploadFile(entry) && entry.size > 0)
      .map(fileToPayload),
  );

  return {
    attachments,
    category: getFormString(formData, "category"),
    description: getFormString(formData, "description"),
    title: getFormString(formData, "title"),
  };
}

export const GET: APIRoute = async (context) => {
  try {
    const [items, contributors] = await Promise.all([
      listFeedbackItems(context.locals, context.locals.user),
      listFeedbackContributors(context.locals),
    ]);

    return json({ contributors, items });
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const payload = await parseCreatePayload(context.request);
    const item = await createFeedbackItem(context.locals, context.locals.user, payload);
    const contributors = await listFeedbackContributors(context.locals);

    return json({ contributors, item }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};
