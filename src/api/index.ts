import { env } from "$env/dynamic/public"

export interface ApiOptions {
  token?: string
  headers?: Record<string, string>
  method?: string
  body?: any
}

export enum ErrorType {
  Unknown = 0,
  InvalidToken = 401,
  NotFound = 404,
  InternalServerError = 500,
  Forbidden = 403,
  RateLimit = 429,
}

export interface ApiError {
  code: number
  type: ErrorType
  message?: string
  data?: any
}

export type SvelteFetch = (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>

export type ApiClient = <T>(path: string, options?: ApiOptions) => Promise<T | undefined>

export default function apiClient(fetch: SvelteFetch, baseUrl?: string): ApiClient {
  return async function <T>(path: string, options?: ApiOptions): Promise<T | undefined> {
    const resp = await fetch(
      `${baseUrl ?? env.PUBLIC_BASE_API_URL ?? "https://api.pluralkit.me"}/${path.startsWith("private") ? "" : "v2/"}${path}`,
      {
        method: (options && options.method) || "GET",
        headers: {
          ...(options && options.token ? { Authorization: options.token } : {}),
          ...(options && options.headers ? options.headers : {}),
          "Content-Type": "application/json",
          "User-Agent": `PluralKit Dashboard (https://github.com/PluralKit/dashboard)`
        },
        body: options && options.body ? JSON.stringify(options.body) : null,
      }
    )

    const delay = checkRateLimit(resp)

    if (!resp.ok) {
      await parseError(resp)
    } else if (resp.status === 204) {
      return undefined
    } else {
      const data = await resp.json()
      return data
    }

    if (delay > 0) await new Promise((res) => setTimeout(res, delay))
  }
}

async function parseError(resp: Response) {
  let type = ErrorType.Unknown
  if (!Object.values(ErrorType).includes(resp.status))
    resp.status > 500 ? (type = ErrorType.InternalServerError) : (type = ErrorType.Unknown)
  else type = resp.status

  let err: ApiError = {
    type: type,
    code: resp.status,
  }

  if (resp.headers.get("content-type")?.includes("application/json")) {
    let body = await resp.json()

    ;(err.message = body.message), (err.data = body)
  }

  throw err
}

export function checkRateLimit(resp: Response) {
  let remaining: string | number | undefined =
    resp.headers.get("X-RateLimit-Remaining") ?? undefined
  let reset: string | number | undefined = resp.headers.get("X-RateLimit-Reset") ?? undefined

  if (remaining && reset) {
    remaining = parseInt(remaining)
    reset = parseInt(reset)

    if (remaining !== 0) return 0
    if (!Number.isNaN(reset)) {
      return Math.max(0, (reset as number) - Math.floor(Date.now() / 1000))
    }
  }

  return 0
}
