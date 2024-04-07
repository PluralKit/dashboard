export function getDashLink(sid: string, page: string, params?: URLSearchParams) {
  return `/dash/${sid}${page ? `/${page}` : ""}${params && params.size > 0 ? `?${params.toString()}` : ""}`
}
