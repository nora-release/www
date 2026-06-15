import { betterAuth } from "better-auth";
import { Pool } from "pg";

type RuntimeEnv = Record<string, string | undefined>;
type RuntimeLocals = {
  runtime?: {
    env?: RuntimeEnv;
  };
};

const authInstances = new Map<string, ReturnType<typeof betterAuth>>();
const localBaseUrl = "http://localhost:4322";

function normalizeEnvValue(value: string | undefined): string {
  const trimmed = (value ?? "").trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function getRuntimeEnv(locals?: unknown): RuntimeEnv {
  const runtimeEnv = (locals as RuntimeLocals | undefined)?.runtime?.env ?? {};
  const buildEnv = import.meta.env as RuntimeEnv;

  return {
    ...buildEnv,
    ...runtimeEnv,
  };
}

function getFirstEnvValue(env: RuntimeEnv, names: string[]): string {
  for (const name of names) {
    const value = normalizeEnvValue(env[name]);

    if (value) {
      return value;
    }
  }

  return "";
}

function getTrustedOrigins(baseURL: string): string[] {
  return Array.from(
    new Set(
      [baseURL, localBaseUrl, "http://127.0.0.1:4322"]
        .map((origin) => origin.replace(/\/+$/u, ""))
        .filter(Boolean),
    ),
  );
}

function isLocalOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return false;
  }

  try {
    const { hostname } = new URL(origin);

    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

export function getAuth(locals?: unknown, requestOrigin?: string) {
  const env = getRuntimeEnv(locals);
  const databaseUrl = getFirstEnvValue(env, ["DATABASE_URL", "POSTGRES_URL"]);
  const clientId = getFirstEnvValue(env, ["GITHUB_CLIENT_ID", "GITHUB_OAUTH_CLIENT_ID"]);
  const clientSecret = getFirstEnvValue(env, ["GITHUB_CLIENT_SECRET", "GITHUB_OAUTH_CLIENT_SECRET"]);
  const secret = getFirstEnvValue(env, ["BETTER_AUTH_SECRET", "NORA_SESSION_SECRET", "SESSION_SECRET"]);
  const configuredBaseURL =
    getFirstEnvValue(env, ["BETTER_AUTH_URL"]) ||
    getFirstEnvValue(env, ["NORA_SITE_URL", "PUBLIC_SITE_URL"]);
  const baseURL =
    isLocalOrigin(requestOrigin) && requestOrigin
      ? requestOrigin
      : configuredBaseURL || requestOrigin || localBaseUrl;
  const cacheKey = JSON.stringify({
    baseURL,
    clientId,
    databaseUrl,
    secret,
  });
  const cached = authInstances.get(cacheKey);

  if (cached) {
    return cached;
  }

  const auth = betterAuth({
    appName: "Nora",
    baseURL,
    database: new Pool({
      connectionString: databaseUrl,
      max: 5,
    }),
    secret,
    socialProviders: {
      github: {
        clientId,
        clientSecret,
      },
    },
    trustedOrigins: getTrustedOrigins(baseURL),
  });

  authInstances.set(cacheKey, auth);

  return auth;
}

export const auth = getAuth();
