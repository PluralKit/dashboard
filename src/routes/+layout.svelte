<script lang="ts">
  import { browser } from "$app/environment"
  import { setContext } from "svelte"
  import NavBar from "$components/NavBar.svelte"
  import "$lib/app.css"
  import type { LayoutData } from "./$types"
  import type { System } from "$api/types"

  export let data: LayoutData

  if (data.token && browser) {
    localStorage.setItem("pk-token", data.token)
  }

  if (data.system) {
    setContext<System>("system", data.system)
  }
</script>

<div class="w-screen min-h-screen bg-base-100 flex flex-col" data-theme={data.theme}>
  <NavBar />
  <slot />
</div>
