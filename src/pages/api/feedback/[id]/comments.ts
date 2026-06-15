import type { APIRoute } from "astro";
import { createFeedbackMessage } from "../../../../lib/feedback";

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

export const POST: APIRoute = async (context) => {
  try {
    const feedbackId = context.params.id;

    if (!feedbackId) {
      return json({ error: "Feedback item not found." }, { status: 404 });
    }

    const payload = await context.request.json().catch(() => ({}));
    const detail = await createFeedbackMessage(context.locals, context.locals.user, feedbackId, payload);

    return json({ detail }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};
