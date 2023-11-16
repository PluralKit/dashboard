export function load({ cookies }) {
  const theme = cookies.get("pk-theme") ?? "dark"

  return {
    theme: theme,
  }
}
