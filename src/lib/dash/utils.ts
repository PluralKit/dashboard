import apiClient, { type SvelteFetch } from "$api"

export function getDashLink(sid: string, page: string, params?: URLSearchParams) {
  return `/dash${sid ? `/${sid}` : ""}${sid && page ? `?tab=${page}` : ""}${
    params && params.size > 0 ? `${sid && page ? "&" : "?"}${params.toString()}` : ""
  }`
}

export function copyToClipboard(value?: string) {
  navigator.clipboard.writeText(value || "")
}

export async function fetchList<T>(fetch: SvelteFetch, path: string, token?: string): Promise<T[]> {
  const api = apiClient(fetch)
  return (
    (await api<T[]>(path, {
      token,
    })) || []
  )
}

export function toggleSetting(dash: any, ...path: string[]) {
  let previous = dash.settings
  for (let i = 0; i < path.length - 1; i++) {
    if (!previous[path[i]]) previous[path[i]] = {}
    previous = previous[path[i]]
  }
  previous[path[path.length - 1]] = previous[path[path.length - 1]] === true ? false : true
  console.log(previous[path[path.length - 1]])
}
