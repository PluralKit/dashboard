interface APIOptions {
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
}

export interface ApiError {
  code: number
  type: ErrorType
  message?: string
  data?: any
}

export type SvelteFetch = (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>

export type ApiClient = <T>(path: string, options?: APIOptions) => Promise<T | undefined>

export default function apiClient(fetch: SvelteFetch) {
  const api = async function <T>(path: string, options?: APIOptions): Promise<T | undefined> {
    const resp = await fetch(`https://api.pluralkit.me/v2/${path}`, {
      method: (options && options.method) || "GET",
      headers: {
        ...(options && options.token ? { Authorization: options.token } : {}),
        ...(options && options.headers ? options.headers : {}),
        "Content-Type": "application/json",
      },
      body: options && options.body ? JSON.stringify(options.body) : null,
    })

    if (!resp.ok) await parseError(resp)

    if (resp.status === 204) return undefined

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
