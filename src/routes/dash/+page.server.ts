import { loadDash } from "$lib/dash/load.js"

export async function load({ cookies, url, parent, locals }) {
  const { apiBaseUrl } = await parent()

  return await loadDash(locals.api, cookies, url, apiBaseUrl)
}
