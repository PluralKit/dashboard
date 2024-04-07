import type { ApiError, SvelteFetch } from "$api"
import apiClient from "$api"
import { error, type Cookies, redirect } from "@sveltejs/kit"
import { PrivacyMode } from "./dash.svelte"
import { getDashInfo } from "$api/utils"

export async function loadDash(fetch: SvelteFetch, cookies: Cookies, url: URL, params?: any) {
  const token = cookies.get("pk-token")
  const sid = cookies.get("pk-sid")

  // if we have a tab url param, convert that to a subpage
  const tab = url.searchParams.get("tab") || ""

  // save the rest of the searchparams (without the tab)
  // so we can save that for further processing later
  let searchParams = url.searchParams.toString()
  searchParams = searchParams.replace(/tab=.*?(?:&|$)/, "")

  // if we don't have a system id, assume old dash link
  // redirect to the new dash link if we have a token
  if (!params?.sid) {
    if (token && sid) {
      redirect(302, getRedirectLink(sid, tab, searchParams))
    } else {
      error(401, "Missing token")
    }
  } else if (tab) {
    // we still have an old tab link! redirect to that page instead
    redirect(302, getRedirectLink(params.sid, tab, searchParams))
  } else {
    // woo! we've got a new link
    const api = apiClient(fetch)

    // if the param system id matches the cookie system id
    // AND we aren't forcing public mode
    // we can go ahead and fetch using the token
    if (params.sid === sid && !url.searchParams.get("public")) {
      try {
        const { system, members, groups } = await getDashInfo(api, sid || "@me", token)
        return {
          system: system || {},
          members: members || [],
          groups: groups || [],
          privacyMode: PrivacyMode.PRIVATE,
        }
      } catch (err) {
        const e = err as ApiError
        error(500, e.message)
      }
      // otherwise we'll just fetch public info
    } else {
      try {
        const { system, members, groups } = await getDashInfo(api, params.sid)
        return {
          system: system || {},
          members: members || [],
          groups: groups || [],
          privacyMode: PrivacyMode.PUBLIC,
        }
      } catch (err) {
        const e = err as ApiError
        error(500, e.message)
      }
    }
  }
}

const getRedirectLink = (sid: string, tab: string, searchParams: string) =>
  `/dash/${sid}${tab ? `/${tab}` : ""}${searchParams.length > 0 ? `?${searchParams}` : ""}`
