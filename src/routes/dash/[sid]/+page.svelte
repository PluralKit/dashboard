<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/state"
  import GroupHome from "$components/dash/groups/GroupHome.svelte"
  import MemberHome from "$components/dash/members/MemberHome.svelte"
  import Overview from "$components/dash/overview/Overview.svelte"
  import SystemHome from "$components/dash/system/SystemHome.svelte"
  import { dash, initDash, PrivacyMode } from "$lib/dash/dash.svelte.js"
  import { dashTabs, publicPrivateLink } from "$lib/dash/utils.js"
  import { IconLock, IconShare2 } from "@tabler/icons-svelte"

  let { data } = $props()
  let tab: string|null = $derived(
    page.url.searchParams.get("tab") !== null
      ? page.url.searchParams.get("tab")
      : data.tab
        ? data.tab
        : dash?.privacyMode === PrivacyMode.PRIVATE
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

  initDash({...data, user: dash.user})
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="grid-cols-2 mb-4 tabs tabs-boxed md:grid-cols-none">
    {#each dashTabs as t}
      {#if !t.private || dash?.privacyMode === PrivacyMode.PRIVATE}
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
  {#if data.isOwner}
  <div class="flex flex-row mb-4 justify-center">
    <a
      class="btn btn-ghost w-fit"
      href={`/dash/${dash.system.id}?${publicPrivateLink(page.url.searchParams.toString(), data.isOwner)}`}
      target="_blank"
    >
      {#if page.url.searchParams.has("public")}
        <IconLock /> Go to private dashboard
      {:else}
        <IconShare2 /> Go to public page
      {/if}
    </a>
  </div>
  {/if}
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
