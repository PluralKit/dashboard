import { loadDash } from "$lib/dash/load.js"

export async function load({ cookies, url, params, locals }) {
  return await loadDash(locals.api, cookies, url, params)
}
