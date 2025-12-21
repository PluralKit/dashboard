<script lang="ts">
  import RandomMember from "$components/dash/members/RandomMember.svelte"
  import RandomGroup from "$components/dash/groups/RandomGroup.svelte";
  import { page } from "$app/state"
  import { goto } from "$app/navigation"
  import { IconFolderQuestion, IconUserQuestion } from "@tabler/icons-svelte"

  let tab: string|null = $derived(
      page.url.searchParams.get("tab") !== null
        ? page.url.searchParams.get("tab")
        : "members"
    )

    function changeTab(newTab: string) {
      let params = page.url.searchParams
      params.delete("tab")
      params.append("tab", newTab)
      goto(`?${params.toString()}`, {})
      tab = newTab
    }
</script>

<div class="flex flex-row mb-4 justify-center">
    <button
      class="btn btn-ghost w-fit"
      onclick={() => changeTab("members")}
    >
      <IconUserQuestion /> Random Members
</button>
    <button
      class="btn btn-ghost w-fit"
      onclick={() => changeTab("groups")}
    >
      <IconFolderQuestion /> Random Groups
</button>
  </div>
<div class="flex flex-col flex-1 w-full p-6 px-2 mx-auto bg-base-200 sm:px-4 lg:px-6 xl:px-8">
  {#if tab === "groups"}
    <RandomGroup />
  {:else}
    <RandomMember />
  {/if}
</div>