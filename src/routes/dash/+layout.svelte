<script lang="ts">
  import { setContext } from "svelte"
  import type { Member } from "$api/types"
  import type { LayoutData } from "./$types"

  export let data: LayoutData

  if (data.members) {
    setContext<Member[]>("members", data.members)
  }
</script>

<slot />
