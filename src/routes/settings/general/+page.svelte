<script lang="ts">
  import type { ActionData } from "./$types"
  import { enhance } from "$app/forms"
  import { PUBLIC_BASE_API_URL } from "$env/static/public"
  import { IconAlertTriangle } from "@tabler/icons-svelte"

  export let form: ActionData
  export let data

  let apiUrl = form?.apiBaseUrl || data.apiBaseUrl || PUBLIC_BASE_API_URL
</script>

<h2 class="text-3xl mb-4 font-bold" id="api-url">General settings</h2>
<div class="flex flex-col md:flex-row gap-5">
  <form class="flex-1 max-w-xl" method="post" action="?/apiUrl">
    {#if apiUrl === "https://api.pluralkit.me"}
      <div class="alert">
        <IconAlertTriangle class="text-warning" />
        <span>
          The beta dashboard is unstable, using it may result in data loss.<br />
          If you do want to use it with the main bot, proceed with caution and make sure to export regularly.
        </span>
      </div>
    {/if}
    <label class="label" for="api-url-select">Change which bot's data is used</label>
    <div class="flex flex-col gap-5 mb-3">
      <div class="flex flex-row flex-wrap items-center">
        <select
          name="api-url"
          bind:value={apiUrl}
          class="flex-1 select select-bordered select-sm"
          id="api-url-select"
        >
          <option value="https://api.pluralkit.me">Production bot</option>
          <option value="https://api.beta.pluralkit.me">Beta bot</option>
        </select>
        <input type="submit" class="btn btn-primary ml-2 btn-sm" value="Submit" />
        {#if form?.success}
          <p class="text-success mb-3 mt-2 w-full">{form?.success}</p>
        {/if}
        {#if form?.error}
          <p class="text-error mb-3 mt-2 w-full">{form?.error}</p>
        {/if}
      </div>
    </div>
  </form>
</div>
