<script lang="ts">
  import { PrivacyMode, dash } from "$lib/dash/dash.svelte"
  import ItemCollapse from "../ItemCollapse.svelte"
  import Pagination from "../Pagination.svelte"
  import MemberCreate from "./create/MemberCreate.svelte"

  let fetching = $state(false)

  async function refreshList() {
    fetching = true
    dash.errors.members = ""
    try {
      const token =
        (dash.privacyMode === PrivacyMode.PRIVATE && localStorage.getItem("pk-token")) || undefined
      await dash.members.fetch(token)
    } catch (e) {
      dash.errors.members = (e as Error).message
    }
    fetching = false
  }
</script>

{#if dash.privacyMode === PrivacyMode.PRIVATE}
  <MemberCreate />
{/if}
<div class="text-center">
  <p>
    {dash.members.list.processed.length} members ({dash.members.list.paginated.length} shown)
    <button disabled={fetching} class="btn btn-xs btn-primary ml-2" onclick={() => refreshList()}
      >{fetching ? "Loading..." : "Refresh list"}</button
    >
  </p>
</div>
<Pagination class="mx-auto" bind:list={dash.members} />
{#each dash.members.list.paginated as member (member.uuid)}
  <ItemCollapse item={member} type="member" />
{/each}
{#if dash.members.list.processed.length === 0}
  <div class="alert bg-info/20 flex flex-col text-center">No members found.</div>
{/if}
<Pagination class="mx-auto" bind:list={dash.members} />
