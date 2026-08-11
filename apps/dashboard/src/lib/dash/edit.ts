import moment from "moment"

export function validateViewEdit<T>(item: T, err: string[]) {
  const body = Object.fromEntries(
    Object.entries(item as any)
      .map(([key, value]) => [key, value && typeof value === "string" ? value.trim() : value])
      .filter(([_, value]) => value != null)
  )

  // check the fields that need a specific format
  if (body?.birthday) {
    // replace slashes with dashes
    body.birthday = body.birthday.split("/").join("-")

    // check if there's a year included, if not, we add 0004
    // we're just looking for the amount of dashes in the string
    if (body?.birthday.split("-").length === 2) {
      body.birthday = "0004-" + body.birthday
    }

    if (body.birthday.split("-").length !== 3 || !moment(body.birthday, "YYYY-MM-DD").isValid()) {
      // invalid format!
      err.push("Invalid birthday format (use YYYY-MM-DD instead)")
    }
  }

  if (body?.color) {
    body.color = body.color.replace("#", "")
    const match = new RegExp(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i).test(body.color)
    if (!match) {
      err.push("Invalid color format")
    }
  }

  return body
}
