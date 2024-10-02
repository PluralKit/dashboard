import apiClient from "$api"
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
  const getBaseUrl = () => {
    const param = event.url.searchParams.get("api")
    if (param === "prod" || param === "production") return "https://api.pluralkit.me"
    if (param === "beta") return "https://api.beta.pluralkit.me"

    return event.cookies.get("pk-api-url")
  }
  const apiBaseUrl = getBaseUrl()
  event.locals.api = apiClient(event.fetch, apiBaseUrl)

  const response = await resolve(event)
  return response
}
