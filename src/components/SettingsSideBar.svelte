<script lang="ts">
  import type { System } from "$api/types"
  import { IconPaint, IconLayout, IconEyeHeart, IconAmbulance } from "@tabler/icons-svelte"
  import { getContext } from "svelte"

  const system: System = getContext<System>("system") || null
</script>

<ul class="menu p-4 w-64 lg:w-80 min-h-full bg-base-200 text-base-content">
  <!-- Sidebar content here -->
  <li><h1 class="text-3xl font-bold mb-4 pointer-events-none">Settings</h1></li>
  <li><a href="/settings/theme"><IconPaint /> Theme</a></li>
  <li><a href="/settings/layout"><IconLayout /> Layout</a></li>
  <li><a href="/settings/accessibility"><IconEyeHeart /> Accessibility</a></li>
  {#if system}
    <li>
      <a href="/settings/recovery"><span class="text-error"><IconAmbulance /></span> Recovery</a>
    </li>
  {/if}
</ul>
