const channels = {
  release: {
    appcastUrl: "https://github.com/nora-release/release/releases/latest/download/appcast.xml",
    fallbackUrl: "https://github.com/nora-release/release/releases/latest",
    latestDownloadBaseUrl: "https://github.com/nora-release/release/releases/latest/download/",
    latestReleaseApiUrl: "https://api.github.com/repos/nora-release/release/releases/latest",
    latestTextUrl: "https://github.com/nora-release/release/releases/latest/download/latest.txt"
  },
  nightly: {
    appcastUrl: "https://github.com/nora-release/release/releases/latest/download/appcast.xml",
    fallbackUrl: "https://github.com/nora-release/release/releases/latest",
    latestDownloadBaseUrl: "https://github.com/nora-release/release/releases/latest/download/",
    latestReleaseApiUrl: "https://api.github.com/repos/nora-release/release/releases/latest",
    latestTextUrl: "https://github.com/nora-release/release/releases/latest/download/latest.txt"
  }
} as const;

export type DownloadChannel = keyof typeof channels;

type GitHubReleaseAsset = {
  browser_download_url?: string;
  name?: string;
  size?: number;
  state?: string;
  updated_at?: string;
};

type GitHubRelease = {
  assets?: GitHubReleaseAsset[];
  published_at?: string;
  tag_name?: string;
};

const requestHeaders = {
  Accept: "application/vnd.github+json,text/plain,application/xml,text/xml",
  "User-Agent": "nora-www-download"
};

const readNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const readString = (value: unknown) => (typeof value === "string" ? value : null);

export const isDownloadChannel = (value: string): value is DownloadChannel =>
  Object.prototype.hasOwnProperty.call(channels, value);

const validateDmgUrl = (url?: string | null) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const isReleaseDownload = parsedUrl.pathname.startsWith("/nora-release/release/releases/download/");
    const isLatestDownload = parsedUrl.pathname.startsWith("/nora-release/release/releases/latest/download/");

    if (
      parsedUrl.hostname !== "github.com" ||
      (!isReleaseDownload && !isLatestDownload) ||
      !parsedUrl.pathname.toLowerCase().endsWith(".dmg")
    ) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
};

const buildLatestDownloadUrl = (baseUrl: string, filename: string) => {
  const sanitizedFilename = filename.trim();

  if (
    !sanitizedFilename.toLowerCase().endsWith(".dmg") ||
    sanitizedFilename.includes("/") ||
    sanitizedFilename.includes("\\")
  ) {
    return null;
  }

  return validateDmgUrl(`${baseUrl}${encodeURIComponent(sanitizedFilename)}`);
};

const findDmgUrl = (appcast: string) => {
  const match = appcast.match(
    /https:\/\/github\.com\/nora-release\/release\/releases\/download\/[^"'\s<>]+\.dmg/i
  );

  return validateDmgUrl(match?.[0]);
};

const fetchText = async (url: string) => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: requestHeaders
  });

  if (!response.ok) throw new Error(`Text download lookup failed: ${response.status}`);

  return response.text();
};

const fetchRelease = async (url: string) => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: requestHeaders
  });

  if (!response.ok) throw new Error(`Release lookup failed: ${response.status}`);

  return (await response.json()) as GitHubRelease;
};

const fetchDmgFromLatestText = async (channel: DownloadChannel) => {
  const config = channels[channel];
  const filename = await fetchText(config.latestTextUrl);

  return buildLatestDownloadUrl(config.latestDownloadBaseUrl, filename);
};

const fetchDmgFromLatestRelease = async (channel: DownloadChannel) => {
  const release = await fetchRelease(channels[channel].latestReleaseApiUrl);
  const asset = release.assets?.find((item) => {
    return (
      item.state === "uploaded" &&
      item.name?.toLowerCase().endsWith(".dmg") &&
      validateDmgUrl(item.browser_download_url)
    );
  });

  return {
    createdAt: readString(asset?.updated_at) ?? readString(release.published_at),
    name: readString(asset?.name),
    size: readNumber(asset?.size),
    url: validateDmgUrl(asset?.browser_download_url),
    version: readString(release.tag_name)
  };
};

const fetchDmgFromAppcast = async (channel: DownloadChannel) => {
  const appcast = await fetchText(channels[channel].appcastUrl);

  return findDmgUrl(appcast);
};

export const fetchDownloadChannel = async (channel: DownloadChannel) => {
  const release = await fetchDmgFromLatestRelease(channel).catch(() => null);
  const url =
    release?.url ??
    (await fetchDmgFromLatestText(channel).catch(() => null)) ??
    (await fetchDmgFromAppcast(channel).catch(() => null)) ??
    channels[channel].fallbackUrl;

  return {
    build: null,
    channel,
    createdAt: release?.createdAt ?? null,
    name: release?.name ?? null,
    size: release?.size ?? null,
    url,
    version: release?.version ?? null
  };
};
