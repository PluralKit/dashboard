import type { ApiError, SvelteFetch } from "$api"
import apiClient from "$api"
import { error, type Cookies, redirect } from "@sveltejs/kit"
import { PrivacyMode } from "./dash.svelte"
import { getDashInfo } from "$api/utils"

export async function loadDash(fetch: SvelteFetch, cookies: Cookies, url: URL, params?: any) {
  const token = cookies.get("pk-token")
  const sid = cookies.get("pk-sid")

  // if we don't have a system id, assume old dash link
  // redirect to the new dash link if we have a token
  if (!params?.sid) {
    if (token && sid) {
      redirect(302, getRedirectLink(sid, url.searchParams.toString()))
    } else {
      error(401, "Missing token")
    }
  } else {
    // woo! we've got a new link
    const api = apiClient(fetch)

    // if the param system id matches the cookie system id
    // AND we aren't forcing public mode
    // we can go ahead and fetch using the token
    if (params.sid === sid && !url.searchParams.get("public")) {
      try {
        const { system, members, groups, errors, ratelimited } = await getDashInfo(api, sid || "@me", token)
        return {
          errors,
          ratelimited,
          tab: url.searchParams.get("tab") ?? "overview",
          system: system || {},
          members: members || [],
          groups: groups || [],
          privacyMode: PrivacyMode.PRIVATE,
          meta: {
            title: system?.name,
            color: system?.color,
            ogTitle: system?.name,
            ogDescription: system.id ? `View ${system?.name ?? `this system (${system.id})`} on the dashboard.` : "",
          },
        }
      } catch (err) {
        const e = err as ApiError
        error(500, e.message)
      }
      // otherwise we'll just fetch public info
    } else {
      try {
        const { system, members, groups, ratelimited, errors } = await getDashInfo(api, params.sid)
        return {
          errors,
          ratelimited,
          tab: url.searchParams.get("tab") ?? "overview",
          system: system || {},
          members: members || [],
          groups: groups || [],
          privacyMode: PrivacyMode.PUBLIC,
          meta: {
            title: system?.name,
            color: system?.color,
            ogTitle: system?.name,
            ogDescription: system.id ? `View ${system?.name ?? `this system (${system.id})`} on the dashboard.` : "",
          },
        }
      } catch (err) {
        const e = err as ApiError
        error(500, e.message)
      }
    }
  }
}

const getRedirectLink = (sid: string, searchParams: string) =>
  `/dash/${sid}${searchParams.length > 0 ? `?${searchParams}` : ""}`