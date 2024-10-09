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
  // list of API requests to run
  const scheduled: {
    resolve: (value: any | PromiseLike<any>) => void
    reject: (reason: any) => void
    options: ApiOptions & {
      path: string
    }
  }[] = []

  async function run() {
    if (scheduled.length === 0) {
      // use setTimeout instead of a loop since it's non-blocking
      setTimeout(run, 0)
    } else {
      const { options, resolve, reject } = scheduled.shift() as (typeof scheduled)[0]
      try {
        const resp = await fetch(
          `${baseUrl ?? PUBLIC_BASE_API_URL ?? "https://api.pluralkit.me"}/v2/${options.path}`,
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

        const delay = checkRateLimit(resp)

        if (!resp.ok) {
          await parseError(resp, reject)
        } else if (resp.status === 204) {
          resolve(undefined)
        } else {
          const data = await resp.json()
          resolve(data)
        }

        setTimeout(run, delay)
      } catch (e) {
        reject({
          message: (e as Error).message,
        })

        setTimeout(run, 0)
      }
    }
  }

  run()

  return function <T>(path: string, options?: ApiOptions): Promise<T | undefined> {
    const promise = new Promise<T | undefined>((resolve, reject) =>
      scheduled.push({ resolve, reject, options: { ...options, path } })
    )
    return promise
  }
}

async function parseError(resp: Response, reject: (reason: any) => void) {
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

  reject(err)
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
