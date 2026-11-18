import { defineMiddleware } from "astro:middleware";
import { getAuth } from "./lib/auth";

/**
 * The docs are static files built by VitePress into /docs/. Hosts differ on
 * whether a folder URL serves its index.html, so send folder URLs there.
 */
function docsIndexRedirect(url: URL): Response | null {
  const { pathname } = url;
  if (pathname !== "/docs" && !pathname.startsWith("/docs/")) return null;
  if (!pathname.endsWith("/") && pathname !== "/docs") return null;

  const target = new URL(url);
  target.pathname = `${pathname.replace(/\/?$/u, "/")}index.html`;
  return Response.redirect(target.toString(), 308);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  const redirect = docsIndexRedirect(url);
  if (redirect) return redirect;

  context.locals.user = null;
  context.locals.session = null;

  if (context.isPrerendered) {
    return next();
  }

  const session = await getAuth(context.locals, url.origin).api
    .getSession({
      headers: request.headers,
    })
    .catch(() => null);

  context.locals.user = session?.user ?? null;
  context.locals.session = session?.session ?? null;

  return next();
});
