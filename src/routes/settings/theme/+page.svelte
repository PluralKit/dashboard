<script lang="ts">
  import { IconPaint } from "@tabler/icons-svelte"
  import type { ActionData } from "./$types"
  import type { PageData } from "../$types"
  import { enhance } from "$app/forms"

  export let form: ActionData
  export let data: PageData
</script>

<h2 class="text-3xl mb-4 font-bold" id="theme">Theme</h2>
<div class="flex flex-col md:flex-row gap-5">
  <form class="flex-1" method="post" action="?/theme" use:enhance>
    <label class="label" for="theme-select"><span class="label-text">Change theme</span></label>
    <div class="flex flex-col gap-5 mb-3">
      <div class="flex flex-row flex-wrap items-center">
        <select
          name="theme"
          bind:value={data.theme}
          class="form-control select select-bordered py-2"
          id="theme-select"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="cotton">Cotton (trans rights!)</option>
          <option value="acid">Acid</option>
          <option value="autumn">Autumn</option>
          <option value="coffee">Coffee</option>
        </select>
        <input type="submit" class="btn btn-primary ml-2" value="Submit" />
        {#if form?.success}
          <p class="text-success mb-3 mt-2 w-full">{form?.success}</p>
        {/if}
        {#if form?.error}
          <p class="text-error mb-3 mt-2 w-full">{form?.error}</p>
        {/if}
      </div>
      <div class="flex-1 p-3 rounded-xl" data-theme={data.theme}>
        <p class="mb-2">Theme preview - <b>{data.theme}</b></p>
        <div class="flex flex-row gap-3 flex-wrap">
          <div class="bg-primary w-12 h-12 rounded-lg"></div>
          <div class="bg-secondary w-12 h-12 rounded-lg"></div>
          <div class="bg-accent w-12 h-12 rounded-lg"></div>
          <div class="bg-neutral w-12 h-12 rounded-lg"></div>
          <div class="bg-base-300 w-12 h-12 rounded-lg"></div>
        </div>
      </div>
    </div>
  </form>
</div>
