import { redirect, type Actions } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"

export const load = () => {
  return {
    meta: {
      title: "Home",
      ogTitle: "Web Dashboard",
      ogDescription: "View and edit your system's content on PluralKit's dashboard!",
    },
  }
}

export const actions = {
  login: async ({ request, fetch, cookies }) => {
    const formData = await request.formData()
    const token = formData.get("token")

    if (!token)
      return {
        error: "Token is required.",
      }

    cookies.set("pk-token", token as string, {
      path: "/",
      secure: env.NODE_ENV !== "development",
    })

    redirect(302, "/")
  },

  logout: async ({ cookies }) => {
    cookies.delete("pk-token", {
      path: "/",
      secure: env.NODE_ENV !== "development",
    })
    cookies.delete("pk-sid", {
      path: "/",
      secure: env.NODE_ENV !== "development",
    })

    redirect(302, "/")
  },
} satisfies Actions
