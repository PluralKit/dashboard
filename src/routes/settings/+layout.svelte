<script lang="ts">
  import SettingsSideBar from "$components/SettingsSideBar.svelte"
  import { slide } from "svelte/transition"

  let sidebarOpen: boolean = false
</script>

<div class="flex flex-row flex-1">
  {#if sidebarOpen}
    <button
      class="absolute top-0 left-0 bottom-0 right-0 w-screen md:hidden bg-black opacity-20"
      on:click={() => (sidebarOpen = !sidebarOpen)}
      aria-label="close sidebar"
    ></button>
    <div class="absolute top-0 left-0 bottom-0 md:hidden" transition:slide={{ axis: "x", duration: 350 }}>
      <SettingsSideBar />
    </div>
  {/if}
  <SettingsSideBar />
  <div class="px-6 flex-1">
    <!-- Page content here -->
    <button class="btn btn-neutral md:hidden" on:click={() => (sidebarOpen = !sidebarOpen)}> Open sidebar </button>
    <div class="divider md:hidden"></div>
    <slot />
  </div>
</div>
