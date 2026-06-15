import { defineMiddleware } from "astro:middleware";
import { getAuth } from "./lib/auth";
import {
  defaultLocale,
  getLocaleFromCookieHeader,
  getPreferredLocaleFromAcceptLanguage,
  localizedLocales,
  localizedPath,
} from "./lib/i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

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

  const isRootRequest = url.pathname === "/" || url.pathname === "/index.html";
  const canRedirect = request.method === "GET" || request.method === "HEAD";

  if (isRootRequest && canRedirect) {
    const preferredLocale =
      getLocaleFromCookieHeader(request.headers.get("cookie")) ??
      getPreferredLocaleFromAcceptLanguage(request.headers.get("accept-language"));

    if (preferredLocale !== defaultLocale && localizedLocales.includes(preferredLocale)) {
      const redirectUrl = new URL(url);
      redirectUrl.pathname = localizedPath(preferredLocale, "/");

      return new Response(null, {
        status: 302,
        headers: {
          "Cache-Control": "private, no-store",
          Location: redirectUrl.toString(),
          Vary: "Accept-Language, Cookie",
        },
      });
    }
  }

  return next();
});
