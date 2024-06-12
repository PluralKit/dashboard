<script lang="ts">
  import { replaceState } from "$app/navigation"
  import { page } from "$app/stores"
  import GroupHome from "$components/dash/groups/GroupHome.svelte"
  import MemberHome from "$components/dash/members/MemberHome.svelte"
  import Overview from "$components/dash/overview/Overview.svelte"
  import SystemHome from "$components/dash/system/SystemHome.svelte"

  let { data } = $props()
  let tab = $state(data.tab || "overview")
  $effect(() => {
    tab = data.tab
  })

  function changeTab(newTab: string) {
    let params = $page.url.searchParams.toString()
    params = params.replace(/tab=.*(?:$|&)/g, "")
    replaceState(`?tab=${newTab}${params ? "&" + params : ""}`, {})
    tab = newTab
  }
</script>

<div class="container mx-auto px-4">
  <div role="tablist" class="tabs tabs-boxed mb-4 grid-cols-2 md:grid-cols-none">
    <button
      role="tab"
      class={`tab ${tab === "overview" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => changeTab("overview")}>Overview</button
    >
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

<div class="mx-auto flex flex-col flex-1 bg-base-200 w-full p-6 px-2 sm:px-4 lg:px-6 xl:px-8">
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
