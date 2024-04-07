import apiClient, { ErrorType, type ApiError } from "$api"
import type { Member } from "$api/types"
import { error } from "@sveltejs/kit"

export async function load({ cookies, fetch }) {
  const token = cookies.get("pk-token")

  if (!token) error(401, "Missing token.");

  const api = apiClient(fetch)

  let members: Member[] = []
  try {
    members =
      (await api<Member[]>("systems/@me/members", {
        token: token,
      })) || []
  } catch (err) {
    let e = err as ApiError
    if (e.type === ErrorType.InvalidToken) error(401, "Invalid token.");
    else {
      console.log(e)
      throw e
    }
  }

  return {
    members: members,
  }
}
