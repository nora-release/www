import type { APIRoute } from "astro";
import { handleTemporaryUpload } from "../../../lib/temporary-uploads";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    return await handleTemporaryUpload(context.request, context.locals.user);
  } catch (error) {
    return Response.json(
      { error: error instanceof Response ? await error.text() : "Attachment upload failed." },
      { status: error instanceof Response ? error.status : 400 },
    );
  }
};
