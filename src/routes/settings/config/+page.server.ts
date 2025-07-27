import type { Actions } from "@sveltejs/kit"

export async function load({ cookies, params, url, locals }) {
  const token = cookies.get("pk-token")

  const api = locals.api

  let configData: any

  try {
    configData = await api(`systems/@me/settings`, { token })
  } catch (err) {
    console.error(err)
  }

  return {
    configData,
  }
}
