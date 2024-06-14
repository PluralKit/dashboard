<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import { dash } from "$lib/dash/dash.svelte"
  import { getDashLink } from "$lib/dash/utils"
  import { cookieState } from "$lib/common/cookies.svelte"
  import { IconFlask, IconInfoCircle } from "@tabler/icons-svelte"

  export let data: PageData
  export let form: ActionData

  let system = dash.user
</script>

<div class="hero bg-base-200">
  <div
    class="hero-content my-8 flex-col md:flex-row-reverse flex-wrap w-full max-w-5xl px-4 items-center md:items-stretch"
  >
    {#if !system}
      <div class="w-full max-w-md md:max-w-none mb-4">
        <div class="alert bg-base-100">
          <IconInfoCircle class="text-info" />
          <div>
            <h3 class="text-lg font-bold">Token not working?</h3>
            <p>
              This preview version of the dashboard uses <b>the beta bot</b> by default.
              <a href="/settings/general" class="link-primary">Visit the settings</a> to change it to
              use the regular bot.
            </p>
          </div>
        </div>
      </div>
    {/if}
    <div class="text-center flex flex-col flex-1">
      {#if system}
        {#if system.name}
          <h1 class="text-3xl font-bold">Welcome, {system.name}!</h1>
        {:else}
          <h1 class="text-3xl font-bold">Welcome!</h1>
        {/if}
      {:else}
        <h1 class="text-3xl font-bold">Welcome to the new dashboard!</h1>
      {/if}
      <div class="alert mt-4 bg-base-100 max-w-md md:max-w-none flex-1">
        <IconFlask class="text-info" />
        <p>
          This is a complete rewrite of PluralKit's current dashboard, and hosted only for testing
          purposes. This is a <b>work in progress</b>, many things aren't functional yet.
          <span class="text-error">Proceed with caution.</span>
        </p>
      </div>
    </div>
    {#if system}
      <div class="card flex-1 w-full max-w-md md:w-auto md:max-w-none shadow-2xl bg-base-100">
        <div class="card-body">
          <p class="pt-6">Enter the dashboard to edit your system, member and group information.</p>
          <a class="btn btn-primary" href={getDashLink(system.id || "", "")}>To the dash</a>
        </div>
      </div>
    {:else}
      <div class="card flex-1 w-full max-w-md md:w-auto md:max-w-none shadow-2xl bg-base-100">
        <form class="card-body" action="/?/login" method="post">
          {#if data.error}
            <span class="text-error">{data.error}</span>
          {/if}
          <div class="form-control">
            <label for="token-input" class="label">
              <span class="label-text">PluralKit API token</span>
            </label>
            <input
              type="password"
              placeholder="token"
              name="token"
              id="token-input"
              class="input input-bordered"
            />
            <label class="label" for="token-input">
              <span class="text-sm">You can get this by running pk;token</span>
              {#if form?.error}
                <br />
                <span class="text-sm text-error">
                  {form.error}
                </span>
              {/if}
            </label>
          </div>
          <div class="form-control mt-6">
            <input type="submit" class="btn btn-primary" value="Login" />
          </div>
        </form>
      </div>
    {/if}
  </div>
</div>
