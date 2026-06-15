import type { APIRoute } from "astro";
import { addFeedbackAdmin, listFeedbackAdmins } from "../../../lib/feedback";

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

export const GET: APIRoute = async (context) => {
  try {
    const admins = await listFeedbackAdmins(context.locals, context.locals.user);

    return json({ admins });
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const payload = await context.request.json().catch(() => ({}));
    const admins = await addFeedbackAdmin(context.locals, context.locals.user, payload);

    return json({ admins }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};
