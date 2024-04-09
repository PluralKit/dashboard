<script lang="ts">
  import SettingsSideBar from "$components/SettingsSideBar.svelte"
  import { slide } from "svelte/transition"
  import CookieNotice from "$components/CookieNotice.svelte"
  import { cookieState } from "$lib/common/cookies.svelte"

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
  <SettingsSideBar hide={true} />
  <div class="px-6 flex-1">
    <!-- Page content here -->
    <button class="btn btn-neutral md:hidden" on:click={() => (sidebarOpen = !sidebarOpen)}> Open sidebar </button>
    <div class="divider md:hidden"></div>
      {#if !cookieState().accepted}
      <div class="w-full flex flex-col">
        <CookieNotice class="mx-auto mt-3 w-full lg:w-3/4 xl:w-2/3" />
      </div>
      {/if}
    <slot />
  </div>
</div>
