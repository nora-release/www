type CookieOptions = {
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'lax' | 'strict' | 'none'
  secure?: boolean
}

export class FeedbackHttpError extends Error {
  statusCode: number
  data: unknown

  constructor(statusCode: number, statusMessage: string, data?: unknown) {
    super(statusMessage)
    this.name = 'FeedbackHttpError'
    this.statusCode = statusCode
    this.data = data
  }
}

export const feedbackError = (
  statusCode: number,
  statusMessage: string,
  data?: unknown,
) => {
  return new FeedbackHttpError(statusCode, statusMessage, data)
}

export const getRequestUrl = (event: any) => {
  return new URL(event.url || event.req.url)
}

export const getQueryValue = (event: any, name: string) => {
  return getRequestUrl(event).searchParams.get(name)
}

export const getRouterValue = (event: any, name: string) => {
  return event.context?.params?.[name] ?? event.req?.context?.params?.[name]
}

export const readJsonBody = async (event: any) => {
  const text = await event.req.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    throw feedbackError(400, 'Request body must be valid JSON.')
  }
}

export const getCookieValue = (event: any, name: string) => {
  const cookieHeader = event.req?.headers.get('cookie') ?? ''
  const cookies = cookieHeader.split(';')

  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split('=')

    if (rawName === name) {
      return decodeURIComponent(rawValue.join('='))
    }
  }

  return undefined
}

const serializeCookie = (
  name: string,
  value: string,
  options: CookieOptions,
) => {
  const parts = [`${name}=${encodeURIComponent(value)}`]

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`)
  }

  if (options.path) {
    parts.push(`Path=${options.path}`)
  }

  if (options.httpOnly) {
    parts.push('HttpOnly')
  }

  if (options.secure) {
    parts.push('Secure')
  }

  if (options.sameSite) {
    parts.push(
      `SameSite=${options.sameSite[0].toUpperCase()}${options.sameSite.slice(1)}`,
    )
  }

  return parts.join('; ')
}

export const setCookieValue = (
  event: any,
  name: string,
  value: string,
  options: CookieOptions,
) => {
  event.res.headers.append('set-cookie', serializeCookie(name, value, options))
}

export const clearCookieValue = (
  event: any,
  name: string,
  options: CookieOptions = {},
) => {
  setCookieValue(event, name, '', {
    path: '/',
    ...options,
    maxAge: 0,
  })
}

export const jsonResponse = (
  data: unknown,
  status = 200,
  headers?: HeadersInit,
) => {
  return Response.json(data, {
    status,
    headers,
  })
}

export const redirectResponse = (location: string, status = 302) => {
  return new Response(null, {
    status,
    headers: {
      Location: location,
    },
  })
}

const mergeEventHeaders = (event: any, response: Response) => {
  const eventHeaders = event.res?.headers

  if (!eventHeaders) {
    return response
  }

  const setCookies =
    typeof eventHeaders.getSetCookie === 'function'
      ? eventHeaders.getSetCookie()
      : eventHeaders.get('set-cookie')
        ? [eventHeaders.get('set-cookie')]
        : []

  for (const cookie of setCookies) {
    if (cookie) {
      response.headers.append('set-cookie', cookie)
    }
  }

  return response
}

export const withApiResponse = async (
  event: any,
  handler: () => unknown | Promise<unknown>,
) => {
  try {
    const result = await handler()
    const response = result instanceof Response ? result : jsonResponse(result)

    return mergeEventHeaders(event, response)
  } catch (error) {
    if (error instanceof FeedbackHttpError) {
      return mergeEventHeaders(
        event,
        jsonResponse(
          {
            error: true,
            status: error.statusCode,
            statusMessage: error.message,
            data: error.data,
          },
          error.statusCode,
        ),
      )
    }

    console.error(error)

    return mergeEventHeaders(
      event,
      jsonResponse(
        {
          error: true,
          status: 500,
          statusMessage: 'Internal server error.',
        },
        500,
      ),
    )
  }
}
