import { PUBLIC_BASE_API_URL } from "$env/static/public"

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
  const api: ApiClient = async function <T>(
    path: string,
    options?: ApiOptions
  ): Promise<T | undefined> {
    const resp = await fetch(
      `${baseUrl ?? PUBLIC_BASE_API_URL ?? "https://api.pluralkit.me"}/v2/${path}`,
      {
        method: (options && options.method) || "GET",
        headers: {
          ...(options && options.token ? { Authorization: options.token } : {}),
          ...(options && options.headers ? options.headers : {}),
          "Content-Type": "application/json",
        },
        body: options && options.body ? JSON.stringify(options.body) : null,
      }
    )

    if (!resp.ok) await parseError(resp)

    if (resp.status === 204) return undefined

    await checkRateLimit(resp)

    const data = await resp.json()
    return data
  }
  return api
}

async function parseError(resp: Response): Promise<ApiError> {
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

export async function checkRateLimit(resp: Response) {
  let remaining: string | number | undefined =
    resp.headers.get("X-RateLimit-Remaining") ?? undefined
  let reset: string | number | undefined = resp.headers.get("X-RateLimit-Reset") ?? undefined

  if (remaining && reset) {
    remaining = parseInt(remaining)
    reset = parseInt(reset)

    if (remaining !== 0) return

    if (!Number.isNaN(reset)) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, (reset as number) - Math.floor(Date.now() / 1000)))
      )
    }
  }
}
