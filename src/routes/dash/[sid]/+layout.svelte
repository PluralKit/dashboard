<script lang="ts">
  import type { LayoutData } from "./$types"
  import { dash } from "$lib/dash/dash.svelte"

  export let data: LayoutData
  dash.init(data.system, data.members, data.groups, data.privacyMode)
</script>

<slot />
