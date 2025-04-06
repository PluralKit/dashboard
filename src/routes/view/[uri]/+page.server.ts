import { error, redirect } from "@sveltejs/kit"
import { Base64 } from "js-base64"

export function load({ params, url }) {
  let system: string | undefined = undefined
  let tab: string = "members"
  let isPublic = false

  try {
    const json = Base64.decode(params.uri)
    const data = JSON.parse(json)
    if (data.system) {
      system = data.system
    } else throw new Error("No system found")

    if (data.tab) {
      tab = data.tab
    }

    if (data.public) {
      isPublic = data.public
    }
  } catch (e) {
    console.error(e)
    error(404, "Could not decode the given URI.")
  }

  if (system)
    redirect(
      302,
      `/dash/${system}?${isPublic ? `public=true&` : ""}uri=${params.uri}&tab=${tab}${url.searchParams.toString()}`
    )
  else error(404)
}
