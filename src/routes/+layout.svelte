<script lang="ts">
  import { browser } from "$app/environment"
  import NavBar from "$components/NavBar.svelte"
  import "$lib/app.css"
  import type { LayoutData } from "./$types"
  import Footer from "$components/Footer.svelte"
  import { dash } from "$lib/dash/dash.svelte"

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
