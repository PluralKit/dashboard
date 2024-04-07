import { loadDash } from "$lib/dash/load.js"

export async function load({ cookies, fetch, url }) {
  return await loadDash(fetch, cookies, url)
}
