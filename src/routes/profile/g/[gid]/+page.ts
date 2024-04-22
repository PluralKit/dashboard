import { redirect } from "@sveltejs/kit"

export function load({ params, url }) {
  redirect(302, `/dash/g/${params.gid}?public=true&${url.searchParams.toString()}`)
}
