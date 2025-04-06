<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/state"
  import GroupHome from "$components/dash/groups/GroupHome.svelte"
  import MemberHome from "$components/dash/members/MemberHome.svelte"
  import Overview from "$components/dash/overview/Overview.svelte"
  import SystemHome from "$components/dash/system/SystemHome.svelte"
  import { dash, PrivacyMode } from "$lib/dash/dash.svelte.js"

  let { data } = $props()
  let tab = $state(
    page.url.searchParams.get("tab") || data.tab || dash.privacyMode === PrivacyMode.PRIVATE
      ? "overview"
      : "system"
  )

  $effect(() => {
    tab = data.tab
  })

  function changeTab(newTab: string) {
    let params = page.url.searchParams
    params.delete("tab")
    params.append("tab", newTab)
    goto(`?${params.toString()}`, {})
    tab = newTab
  }
</script>

<div class="container px-4 mx-auto">
  <div role="tablist" class="grid-cols-2 mb-4 tabs tabs-boxed md:grid-cols-none">
    {#if dash.privacyMode === PrivacyMode.PRIVATE}
      <button
        role="tab"
        class={`tab ${tab === "overview" ? "tab-active" : ""} row-auto md:row-start-1`}
        onclick={() => changeTab("overview")}>Overview</button
      >
    {/if}
    <button
      role="tab"
      class={`tab ${tab === "system" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => changeTab("system")}>System</button
    >
    <button
      role="tab"
      class={`tab ${tab === "members" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => changeTab("members")}>Members</button
    >
    <button
      role="tab"
      class={`tab ${tab === "groups" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => changeTab("groups")}>Groups</button
    >
    <!-- <button
      role="tab"
      class={`tab ${tab === "switches" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => changeTab("switches")}>Switches</button
    > -->
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
