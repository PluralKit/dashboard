import { error, redirect } from "@sveltejs/kit"
import { Base64 } from "js-base64"

export function load({ url }) {
  let system: string | undefined = undefined
  let tab: string = "members"
  let isPublic = false

  const uri = url.searchParams.get("uri")

  if (uri) {
    try {
      const json = Base64.decode(uri)
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
      error(400, "Could not decode the given URI.")
    }

    if (system)
      redirect(
        302,
        `/dash/${system}?${isPublic ? `public=true&` : ""}uri=${uri}&tab=${tab}&${url.searchParams.toString()}`
      )
  }

  error(404, "No URI was provided.")
}
