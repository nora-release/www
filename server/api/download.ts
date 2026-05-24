import {
  AbortController,
  Headers,
  createFetch,
  createNodeFetch,
} from 'ofetch'

const $githubFetch = createFetch({
  AbortController,
  Headers,
  fetch: createNodeFetch(),
})

type GitHubReleaseAsset = {
  browser_download_url?: string
  name?: string
  state?: string
}

type GitHubRelease = {
  assets?: GitHubReleaseAsset[]
}

const latestReleaseApiUrl =
  'https://api.github.com/repos/nora-release/release/releases/latest'
const appcastUrl =
  'https://github.com/nora-release/release/releases/latest/download/appcast.xml'
const latestTextUrl =
  'https://github.com/nora-release/release/releases/latest/download/latest.txt'
const latestDownloadBaseUrl =
  'https://github.com/nora-release/release/releases/latest/download/'

const redirectTo = (location: string, fallbackReason?: string) => {
  const headers = new Headers({
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
    Location: location,
  })

  if (fallbackReason) {
    headers.set('X-Nora-Download-Fallback', fallbackReason)
  }

  return new Response(null, {
    status: 302,
    headers,
  })
}

const errorResponse = (
  event: DownloadEvent | undefined,
  fallbackReason: string,
) => {
  const headers = new Headers({
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
    'X-Nora-Download-Fallback': fallbackReason,
  })

  if (isFetchRequest(event)) {
    return Response.json(
      {
        error: 'Nora download is temporarily unavailable.',
        fallback: fallbackReason,
      },
      {
        status: 503,
        headers,
      },
    )
  }

  headers.set('Content-Type', 'text/plain; charset=utf-8')

  return new Response('Nora download is temporarily unavailable.', {
    status: 503,
    headers,
  })
}

type DownloadEvent = {
  req?: Request
}

const isFetchRequest = (event?: DownloadEvent) => {
  const mode = event?.req?.headers.get('sec-fetch-mode')
  const accept = event?.req?.headers.get('accept') ?? ''

  return mode ? mode !== 'navigate' : accept.includes('application/json')
}

const respondWithDownload = (
  event: DownloadEvent | undefined,
  location: string,
  fallbackReason?: string,
) => {
  if (!isFetchRequest(event)) {
    return redirectTo(location, fallbackReason)
  }

  const headers = new Headers({
    'Cache-Control': 'no-store, max-age=0',
    Pragma: 'no-cache',
  })

  if (fallbackReason) {
    headers.set('X-Nora-Download-Fallback', fallbackReason)
  }

  return Response.json(
    {
      url: location,
      fallback: fallbackReason ?? null,
    },
    { headers },
  )
}

const findDmgUrl = (appcast: string) => {
  const match = appcast.match(
    /https:\/\/github\.com\/nora-release\/release\/releases\/download\/[^"'\s<>]+\.dmg/i,
  )
  const url = match?.[0]

  if (!url) {
    return null
  }

  try {
    const parsedUrl = new URL(url)

    if (
      parsedUrl.hostname !== 'github.com' ||
      !parsedUrl.pathname.startsWith(
        '/nora-release/release/releases/download/',
      )
    ) {
      return null
    }

    return parsedUrl.toString()
  } catch {
    return null
  }
}

const validateDmgUrl = (url?: string) => {
  if (!url) {
    return null
  }

  try {
    const parsedUrl = new URL(url)

    const isNoraReleaseDownload = parsedUrl.pathname.startsWith(
      '/nora-release/release/releases/download/',
    )
    const isNoraLatestDownload = parsedUrl.pathname.startsWith(
      '/nora-release/release/releases/latest/download/',
    )

    if (
      parsedUrl.hostname !== 'github.com' ||
      (!isNoraReleaseDownload && !isNoraLatestDownload) ||
      !parsedUrl.pathname.toLowerCase().endsWith('.dmg')
    ) {
      return null
    }

    return parsedUrl.toString()
  } catch {
    return null
  }
}

const buildLatestDownloadUrl = (filename: string) => {
  const sanitizedFilename = filename.trim()

  if (
    !sanitizedFilename.toLowerCase().endsWith('.dmg') ||
    sanitizedFilename.includes('/') ||
    sanitizedFilename.includes('\\')
  ) {
    return null
  }

  return validateDmgUrl(
    `${latestDownloadBaseUrl}${encodeURIComponent(sanitizedFilename)}`,
  )
}

const fetchDmgUrlFromLatestRelease = async () => {
  const release = await $githubFetch<GitHubRelease>(latestReleaseApiUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'nora-www-download',
    },
    redirect: 'follow',
    retry: 0,
  })

  const asset = release.assets?.find((item) => {
    return (
      item.state === 'uploaded' &&
      item.name?.toLowerCase().endsWith('.dmg') &&
      item.browser_download_url
    )
  })

  return validateDmgUrl(asset?.browser_download_url)
}

const fetchDmgUrlFromAppcast = async () => {
  const appcast = await $githubFetch<string>(appcastUrl, {
    headers: {
      Accept: 'application/xml,text/xml',
      'User-Agent': 'nora-www-download',
    },
    redirect: 'follow',
    responseType: 'text',
    retry: 0,
  })

  return findDmgUrl(appcast)
}

const fetchDmgUrlFromLatestText = async () => {
  const filename = await $githubFetch<string>(latestTextUrl, {
    headers: {
      Accept: 'text/plain',
      'User-Agent': 'nora-www-download',
    },
    redirect: 'follow',
    responseType: 'text',
    retry: 0,
  })

  return buildLatestDownloadUrl(filename)
}

const downloadSources = [
  ['latest.txt', fetchDmgUrlFromLatestText],
  ['latest release API', fetchDmgUrlFromLatestRelease],
  ['appcast', fetchDmgUrlFromAppcast],
] as const

const resolveDmgUrl = async () => {
  for (const [name, resolve] of downloadSources) {
    try {
      const url = await resolve()

      if (url) {
        return url
      }
    } catch (error) {
      console.warn(`[download] ${name} lookup failed`, error)
    }
  }

  return null
}

export default async (event?: DownloadEvent) => {
  const dmgUrl = await resolveDmgUrl()

  if (!dmgUrl) {
    return errorResponse(event, 'missing-dmg')
  }

  return respondWithDownload(event, dmgUrl)
}
