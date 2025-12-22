import type { ApiError } from "$api"
import type { DashView } from "$api/types.js"
import { error, redirect } from "@sveltejs/kit"

export async function load({ params, parent, locals }) {
  const vid = params.vid
  const api = locals.api
  let value = ""

  try {
    const resp = await api<DashView>(`private/dash_view/${vid}`)
    if (resp && resp.value && resp.value.startsWith("ey")) {
      value = resp.value
    }
  } catch (e) {
    const err = e as ApiError
    error(404, err.message)
  }

  if (value) {
    redirect(308, `/view?uri=${value}`)
  } else {
    error(400, "Invalid view value")
  }
}
