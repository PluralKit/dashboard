import apiClient, { type SvelteFetch } from "$api"

export function getDashLink(sid: string, page: string, params?: URLSearchParams) {
  return `/dash${sid ? `/${sid}` : ""}${sid && page ? `?tab=${page}` : ""}${
    params && params.size > 0 ? `${sid && page ? "&" : "?"}${params.toString()}` : ""
  }`
}


export async function fetchList<T>(fetch: SvelteFetch, path: string, token?: string): Promise<T[]> {
  const api = apiClient(fetch)
  return await api<T[]>(path, {
    token
  }) || []
}