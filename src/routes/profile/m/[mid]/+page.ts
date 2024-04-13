import { redirect } from "@sveltejs/kit"

export function load({ params, url }) {
  redirect(302, `/dash/m/${params.mid}?public=true&${url.searchParams.toString()}`)
}
