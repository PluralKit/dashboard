export function getDashLink(sid: string, page: string, params?: URLSearchParams) {
  return `/dash${sid ? `/${sid}` : ""}${sid && page ? `/${page}` : ""}${
    params && params.size > 0 ? `?${params.toString()}` : ""
  }`
}
