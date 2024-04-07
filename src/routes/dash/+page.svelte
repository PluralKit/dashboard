<script lang="ts">
  import type { Member } from "$api/types"
  import { getContext } from "svelte"

  const members = getContext<Member[]>("members")
</script>

<ol>
  {#each members as member (member.id)}
    <li><b>{member.name}</b> ({member.id})</li>
  {/each}
</ol>
