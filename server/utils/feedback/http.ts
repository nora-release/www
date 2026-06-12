import {
  deleteCookie,
  getCookie,
  getQuery,
  getRequestURL,
  getRouterParam,
  readBody,
  setCookie,
} from 'nitro/h3'

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
  return getRequestURL(event)
}

export const getQueryValue = (event: any, name: string) => {
  const value = getQuery(event)[name]

  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : null
  }

  return typeof value === 'string' ? value : null
}

export const getRouterValue = (event: any, name: string) => {
  return (
    getRouterParam(event, name)
    ?? event.context?.params?.[name]
    ?? event.req?.context?.params?.[name]
  )
}

export const readJsonBody = async (event: any) => {
  const body = await readBody(event)

  if (!body) {
    return {}
  }

  if (typeof body !== 'string') {
    return body
  }

  try {
    return JSON.parse(body)
  } catch {
    throw feedbackError(400, 'Request body must be valid JSON.')
  }
}

export const getCookieValue = (event: any, name: string) => {
  return getCookie(event, name)
}

export const setCookieValue = (
  event: any,
  name: string,
  value: string,
  options: CookieOptions,
) => {
  setCookie(event, name, value, options)
}

export const clearCookieValue = (
  event: any,
  name: string,
  options: CookieOptions = {},
) => {
  deleteCookie(event, name, {
    path: '/',
    ...options,
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
