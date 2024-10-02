<script lang="ts">
  import { dash } from "$lib/dash/dash.svelte"
  import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons-svelte"
  import type { LayoutData } from "./$types"
  import { page } from "$app/stores"

  export let data: LayoutData

  dash.member.member = data.member
  dash.member.groups.init(data.groups)
  dash.member.privacyMode = data.privacyMode

  let params = $page.url.searchParams
  params.append("tab", "members")
</script>

<div class="container mx-auto px-4">
  <div class="flex flex-row mb-4 justify-center">
    <a
      class="btn btn-ghost w-fit"
      href={`/dash/${dash.member.member?.system}${params.toString().length > 0 ? `?${params.toString()}` : ""}`}
    >
      <IconArrowLeft /> Back to system
    </a>
  </div>
</div>

<div class="mx-auto flex flex-col flex-1 bg-base-200 w-full p-6 px-2 sm:px-4 lg:px-6 xl:px-8">
  {#if data.errors.length > 0}
    {#each data.errors as error}
      <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
        <IconAlertTriangle class="text-error" /> Error fetching member: {error}
      </div>
    {/each}
  {/if}
  <slot />
</div>
