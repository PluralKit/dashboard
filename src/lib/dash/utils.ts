import { browser } from "$app/environment"
import type { Page } from "@sveltejs/kit"

export function getDashLink(sid: string, page: string, params?: URLSearchParams) {
  return `/dash${sid ? `/${sid}` : ""}${sid && page ? `?tab=${page}` : ""}${
    params && params.size > 0 ? `${sid && page ? "&" : "?"}${params.toString()}` : ""
  }`
}

export function copyToClipboard(value?: string) {
  navigator.clipboard.writeText(value || "")
}

export async function fetchList<T>(path: string, token?: string): Promise<T[]> {
  if (!browser) return []

  return (
    (await window.api<T[]>(path, {
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
  dash.settings = dash.settings
}

export const dashTabs = [
  {
    title: "Overview",
    private: true,
  },
  {
    title: "System",
  },
  {
    title: "Members",
  },
  {
    title: "Groups",
  },
]

export const publicPrivateLink = (url: string, isOwner: boolean) => {
  let params = url
  if (isOwner) {
    if (url.includes("public=true")) params = url.replace("public=true", "")
    else params = url + "&public=true"
  }

  return params
}

// https://stackoverflow.com/a/19270021
export function getRandom(arr: any[], n: number) {
    let result = new Array(n)
    let len = arr.length
    let taken = new Array(len)
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len)
        result[n] = arr[x in taken ? taken[x] : x]
        taken[x] = --len in taken ? taken[len] : len
    }
    return result;
}