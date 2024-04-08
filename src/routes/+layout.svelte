<script lang="ts">
  import { browser } from "$app/environment"
  import NavBar from "$components/NavBar.svelte"
  import "$lib/app.css"
  import type { LayoutData } from "./$types"
  import Footer from "$components/Footer.svelte"
  import { dash } from "$lib/dash/dash.svelte"
  import { page } from "$app/stores"

  export let data: LayoutData

  if (data.token && browser) {
    localStorage.setItem("pk-token", data.token)
  }

  if (data.system) {
    dash.initSystem(data.system)
  }
</script>

<div class="max-w-screen min-h-screen bg-base-100 flex flex-col" data-theme={data.theme}>
  <NavBar />
  <div class="flex flex-col flex-1">
    <slot />
  </div>
  <Footer />
</div>

<svelte:head>
  <title>PluralKit | {$page.data?.meta?.title ?? "Dashboard"}</title>
  <meta property="og:title" content={`PluralKit | ${$page.data?.meta?.ogTitle ?? "Web Dashboard"}`} />
  <meta
    property="og:description"
    content={`PluralKit | ${$page.data?.meta?.ogDescription ?? "PluralKit's official dashboard."}`}
  />
</svelte:head>
