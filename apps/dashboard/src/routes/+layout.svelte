<script lang="ts">
  import { browser } from "$app/environment"
  import "$lib/app.scss"
  import "$lib/nprogress.scss"
  import "$lib/highlightjs.scss"
  import type { LayoutData } from "./$types"
  import { dash } from "$lib/dash/dash.svelte"
  import { page } from "$app/stores"
  import { navigating } from "$app/stores"
  import nprogress from "nprogress"
  import apiClient from "$api"

  import favicon from "@pluralkit-web/ui/assets/favicon.png"
  import { Footer, NavBar } from "@pluralkit-web/ui"
  import { IconBook, IconBrandDiscord, IconShare3, IconUrgent } from "@tabler/icons-svelte"

  export let data: LayoutData

  if (browser) {
    window.api = apiClient(fetch, data.apiBaseUrl)
  }

  if (data.token && browser) {
    localStorage.setItem("pk-token", data.token)
  } else if (browser) {
    localStorage.removeItem("pk-token")
  }

  nprogress.configure({
    parent: "#themed-container",
  })

  $: {
    if ($navigating) nprogress.start()
    else if (!$navigating) nprogress.done()
  }

  dash.user = data.system
</script>

<div
  id="themed-container"
  class="max-w-screen min-h-screen bg-base-100 flex flex-col"
  data-theme={data.theme}
>
  <NavBar
    links={[
      {
        href: "https://pluralkit.me",
        label: "Documentation",
        icon: IconBook,
      },
      {
        href: "https://discord.com/oauth2/authorize?client_id=466378653216014359&scope=bot%20applications.commands&permissions=536995904",
        label: "Invite Bot",
        icon: IconShare3,
      },
      {
        href: "https://discord.gg/PczBt78",
        label: "Support Server",
        icon: IconBrandDiscord,
      },
      {
        href: "https://status.pluralkit.me/",
        label: "Bot Status",
        icon: IconUrgent,
      },
    ]}
    user={dash.user}
  />
  <div class="flex flex-col flex-1">
    <slot />
  </div>
  <Footer />
</div>

<svelte:head>
  <title>PluralKit | {$page.data?.meta?.title ?? "Dash"}</title>
  <link rel="icon" href={favicon} />
  <meta
    property="og:title"
    content={`PluralKit | ${$page.data?.meta?.ogTitle ?? "Web Dashboard"}`}
  />
  <meta property="theme-color" content={`#${$page.data?.meta?.color ?? "da9317"}`} />
  <meta
    property="og:description"
    content={$page.data?.meta?.ogDescription ?? "PluralKit's official dashboard."}
  />
</svelte:head>
