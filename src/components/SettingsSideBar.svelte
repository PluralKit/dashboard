<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import {
    IconPaint,
    IconLayout,
    IconEyeHeart,
    IconAmbulance,
    IconSettings,
    IconTool,
  } from "@tabler/icons-svelte"

  let { hide = false } = $props()
  let system = dash.user
</script>

<ul
  class={`menu p-4 w-64 lg:w-80 min-h-full bg-base-200 text-base-content ${
    hide ? "hidden md:block" : ""
  }`}
>
  <!-- Sidebar content here -->
  <li><h1 class="text-3xl font-bold mb-4 pointer-events-none">Settings</h1></li>
  <li><a href="/settings/general"><IconSettings /> General</a></li>
  <li><a href="/settings/config"><IconTool /> Config</a></li>
  <li><a href="/settings/theme"><IconPaint /> Theme</a></li>
  <li><a href="/settings/layout"><IconLayout /> Layout</a></li>
  <li><a href="/settings/accessibility"><IconEyeHeart /> Accessibility</a></li>
  {#if system}
    <li>
      <a href="/settings/recovery"><span class="text-error"><IconAmbulance /></span> Recovery</a>
    </li>
  {/if}
</ul>
