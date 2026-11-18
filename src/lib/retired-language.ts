import type { APIRoute } from "astro";

/**
 * The site was once published in Chinese and Japanese too. Their old
 * addresses are real routes, not middleware, because Vercel answers an
 * unknown path with the 404 page without running the server.
 */
export const redirectToEnglish: APIRoute = ({ params, url }) => {
  const target = new URL(`/${params.path ?? ""}`, url);
  target.search = url.search;
  return Response.redirect(target, 301);
};
