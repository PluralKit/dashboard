<script lang="ts">
  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/state"
  import GroupHome from "$components/dash/groups/GroupHome.svelte"
  import MemberHome from "$components/dash/members/MemberHome.svelte"
  import Overview from "$components/dash/overview/Overview.svelte"
  import SystemHome from "$components/dash/system/SystemHome.svelte"
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte.js"
  import { dashTabs } from "$lib/dash/utils.js"

  let { data } = $props()
  let tab: string|null = $derived(
    page.url.searchParams.get("tab") !== null
      ? page.url.searchParams.get("tab")
      : data.tab
        ? data.tab
        : dash.privacyMode === PrivacyMode.PRIVATE
          ? "overview"
          : "system"
  )

  function changeTab(newTab: string) {
    let params = page.url.searchParams
    params.delete("tab")
    params.append("tab", newTab)
    goto(`?${params.toString()}`, {})
    tab = newTab
  }

  const p = page.url.searchParams
  p.delete("uri")
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="grid-cols-2 mb-4 tabs tabs-boxed md:grid-cols-none">
    {#each dashTabs as t}
      {#if !t.private || dash.privacyMode === PrivacyMode.PRIVATE}
        <button
          role="tab"
          class={`tab ${tab === t.title.toLowerCase() ? "tab-active" : ""} row-auto md:row-start-1`}
          onclick={() => changeTab(t.title.toLowerCase())}
        >
          {t.title}
        </button>
      {/if}
    {/each}
  </div>
</div>

<div class="flex flex-col flex-1 w-full p-6 px-2 mx-auto bg-base-200 sm:px-4 lg:px-6 xl:px-8">
  {#if tab === "overview"}
    <Overview />
  {:else if tab === "system"}
    <SystemHome />
  {:else if tab === "members"}
    <MemberHome />
  {:else if tab === "groups"}
    <GroupHome />
  {:else if tab === "switches"}
    <p>switch history oooo</p>
  {:else}
    <p>How did you get here?</p>
  {/if}
</div>
