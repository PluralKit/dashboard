<script lang="ts">
  import GroupHome from "$components/dash/groups/GroupHome.svelte"
  import MemberHome from "$components/dash/members/MemberHome.svelte"
  import Overview from "$components/dash/overview/Overview.svelte"
  import SystemHome from "$components/dash/system/SystemHome.svelte"
  import { dash } from "$lib/dash/dash.svelte"
  import { getDashLink } from "$lib/dash/utils"
</script>

<div class="container mx-auto px-4">
  <div role="tablist" class="tabs tabs-boxed mb-4 grid-cols-2 md:grid-cols-none">
    <button
      role="tab"
      class={`tab ${dash.tab === "overview" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => (dash.tab = "overview")}>Overview</button
    >
    <button
      role="tab"
      class={`tab ${dash.tab === "system" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => (dash.tab = "system")}>System</button
    >
    <button
      role="tab"
      class={`tab ${dash.tab === "members" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => (dash.tab = "members")}>Members</button
    >
    <button
      role="tab"
      class={`tab ${dash.tab === "groups" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => (dash.tab = "groups")}>Groups</button
    >
    <button
      role="tab"
      class={`tab ${dash.tab === "switches" ? "tab-active" : ""} row-auto md:row-start-1`}
      onclick={() => (dash.tab = "switches")}>Switches</button
    >
  </div>
</div>

<div class="mx-auto flex flex-col flex-1 bg-base-200 w-full p-6 px-4 sm:px-6 xl:px-8">
  {#if dash.tab === "overview"}
    <Overview />
  {:else if dash.tab === "system"}
    <SystemHome />
  {:else if dash.tab === "members"}
    <MemberHome />
  {:else if dash.tab === "groups"}
    <GroupHome />
  {:else if dash.tab === "switches"}
    <p>switch history oooo</p>
  {:else}
    <p>How did you get here?</p>
  {/if}
</div>
