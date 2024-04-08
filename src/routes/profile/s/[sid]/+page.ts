import { redirect } from "@sveltejs/kit"

export function load({ params, url }) {
  redirect(302, `/dash/${params.sid}?public=true&${url.searchParams.toString()}`)
}
