import { loadDash } from "$lib/dash/load.js"

export async function load({ cookies, fetch, url, params, parent }) {
  const { apiBaseUrl } = await parent()

  return await loadDash(fetch, cookies, url, apiBaseUrl, params)
}
