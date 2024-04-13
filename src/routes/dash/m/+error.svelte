<script lang="ts">
  import { page } from "$app/stores"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
</script>

<div class="alert bg-error/10 mb-4 w-full mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2">
  <IconAlertTriangle class="text-error" /> Error fetching member: {$page.error?.message}
</div>