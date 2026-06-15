import type { APIRoute } from "astro";
import { syncFeedbackIssueFromGitHubWebhook } from "../../../lib/feedback";

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
    const body = await context.request.text();
    const result = await syncFeedbackIssueFromGitHubWebhook(
      context.locals,
      body,
      context.request.headers.get("x-hub-signature-256"),
      context.request.headers.get("x-github-event"),
    );

    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
};
