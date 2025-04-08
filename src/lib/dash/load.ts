import type { ApiClient, ApiError, SvelteFetch } from "$api"
import apiClient from "$api"
import { error, type Cookies, redirect } from "@sveltejs/kit"
import { PrivacyMode } from "./dash.svelte"
import { getDashInfo } from "$api/utils"
import { Base64 } from "js-base64"

export async function loadDash(api: ApiClient, cookies: Cookies, url: URL, params?: any) {
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

    let view: undefined | Record<string, any[]> = undefined
    // check if we have some URL filters to decode
    if (url.searchParams.has("uri")) {
      try {
        const json = Base64.decode(url.searchParams.get("uri") as string)
        const data = JSON.parse(json)
        if (
          data.m &&
          Array.isArray(data.m) &&
          data.g &&
          Array.isArray(data.g) &&
          data.m.length >= 2 &&
          data.g.length >= 2
        ) {
          // okay, looks like we have a valid URI object.
          // (Unless someone did something really weird with the URI)
          view = data
        }
      } catch (e) {
        // swallow the error and don't do anything
      }
    }

    // if the param system id matches the cookie system id
    // AND we aren't forcing public mode
    // we can go ahead and fetch using the token
    if (params.sid === sid && !url.searchParams.get("public") && !url.searchParams.get("api")) {
      try {
        const { system, members, groups, errors, ratelimited, config } = await getDashInfo(
          api,
          sid || "@me",
          token
        )
        return {
          view,
          errors,
          ratelimited,
          tab: url.searchParams.get("tab") ?? "overview",
          system: system || {},
          members: members || [],
          groups: groups || [],
          privacyMode: PrivacyMode.PRIVATE,
          config,
          meta: {
            title: system?.name,
            color: system?.color,
            ogTitle: system?.name,
            ogDescription: system.id
              ? `View ${system?.name ?? `this system (${system.id})`} on the dashboard.`
              : "",
          },
        }
      } catch (err) {
        const e = err as ApiError
        error(e.code, e.message)
      }
      // otherwise we'll just fetch public info
    } else {
      try {
        const { system, members, groups, ratelimited, errors } = await getDashInfo(api, params.sid)
        return {
          view,
          errors,
          ratelimited,
          tab: url.searchParams.get("tab") ?? "system",
          system: system || {},
          members: members || [],
          groups: groups || [],
          config: undefined,
          privacyMode: PrivacyMode.PUBLIC,
          meta: {
            title: system?.name,
            color: system?.color,
            ogTitle: system?.name,
            ogDescription: system.id
              ? `View ${system?.name ?? `this system (${system.id})`} on the dashboard.`
              : "",
          },
        }
      } catch (err) {
        const e = err as ApiError
        error(e.code, e.message)
      }
    }
  }
}

const getRedirectLink = (sid: string, searchParams: string) =>
  `/dash/${sid}${searchParams.length > 0 ? `?${searchParams}` : ""}`
