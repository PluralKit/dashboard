<script lang="ts">
  import { browser } from "$app/environment"
  import NavBar from "$components/NavBar.svelte"
  import "$lib/app.css"
  import "$lib/nprogress.css"
  import "$lib/highlightjs.scss"
  import type { LayoutData } from "./$types"
  import Footer from "$components/Footer.svelte"
  import { dash } from "$lib/dash/dash.svelte"
  import { page } from "$app/stores"
  import { navigating } from "$app/stores"
  import nprogress from "nprogress"

  export let data: LayoutData

  if (data.token && browser) {
    localStorage.setItem("pk-token", data.token)
  } else if (browser) {
    localStorage.removeItem("pk-token")
  }

  nprogress.configure({
    parent: "#themed-container"
  })

  $: {
    if ($navigating) nprogress.start()
    else if (!$navigating) nprogress.done()
  }

  dash.initUser(data.system)
</script>

<div id="themed-container" class="max-w-screen min-h-screen bg-base-100 flex flex-col" data-theme={data.theme}>
  <NavBar />
  <div class="flex flex-col flex-1">
    <slot />
  </div>
  <Footer />
</div>

<svelte:head>
  <title>PluralKit | {$page.data?.meta?.title ?? "Dash"}</title>
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
