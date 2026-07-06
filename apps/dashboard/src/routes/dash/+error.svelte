<script lang="ts">
  import { page } from "$app/stores"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
</script>

<div class="mx-auto flex flex-col flex-1 bg-base-200 w-full p-6 px-2 sm:px-4 lg:px-6 xl:px-8">
  <div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
    <IconAlertTriangle class="text-error" />
    <span>
      {#if $page.status === 401}
        You need to be logged in to access this page. You can
        <a class="link-primary" href="/">log in on the homepage</a>.
      {:else}
        Error fetching dash: {$page.error?.message}
      {/if}
    </span>
  </div>
</div>
