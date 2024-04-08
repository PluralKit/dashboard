<script lang="ts">
  import GroupHome from "$components/dash/groups/GroupHome.svelte"
  import MemberHome from "$components/dash/members/MemberHome.svelte"
  import Overview from "$components/dash/overview/Overview.svelte"
  import SystemHome from "$components/dash/system/SystemHome.svelte"
  import { dash } from "$lib/dash/dash.svelte"
  import { getDashLink } from "$lib/dash/utils"
</script>

<div role="tablist" class="tabs tabs-boxed mb-3">
  <button
    role="tab"
    class={`tab ${dash.tab === "overview" ? "tab-active" : ""}`}
    onclick={() => (dash.tab = "overview")}>Overview</button
  >
  <button
    role="tab"
    class={`tab ${dash.tab === "system" ? "tab-active" : ""}`}
    onclick={() => (dash.tab = "system")}>System</button
  >
  <button
    role="tab"
    class={`tab ${dash.tab === "members" ? "tab-active" : ""}`}
    onclick={() => (dash.tab = "members")}>Members</button
  >
  <button
    role="tab"
    class={`tab ${dash.tab === "groups" ? "tab-active" : ""}`}
    onclick={() => (dash.tab = "groups")}>Groups</button
  >
</div>

{#if dash.tab === "overview"}
  <Overview />
{:else if dash.tab === "system"}
  <SystemHome />
{:else if dash.tab === "members"}
  <MemberHome />
{:else if dash.tab === "groups"}
  <GroupHome />
{:else}
  <p>How did you get here?</p>
{/if}
