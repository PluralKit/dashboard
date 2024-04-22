<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import { dash } from "$lib/dash/dash.svelte"
  import { getDashLink } from "$lib/dash/utils"
  import CookieNotice from "$components/CookieNotice.svelte"
  import { cookieState } from "$lib/common/cookies.svelte"
  import { IconFlask } from "@tabler/icons-svelte"

  export let data: PageData
  export let form: ActionData

  let system = dash.user
</script>

{#if !cookieState().accepted}
  <CookieNotice class="mx-auto mb-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2" />
{/if}

<div class="hero bg-base-200">
  {#if system}
    <div class="hero-content my-8 flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        {#if system.name}
          <h1 class="text-3xl font-bold">Welcome, {system.name}!</h1>
        {:else}
          <h1 class="text-3xl font-bold">Welcome!</h1>
        {/if}
        <div class="alert my-4 bg-base-100 max-w-lg">
          <IconFlask class="text-info" />
          <p>
            This is a complete rewrite of PluralKit's current dashboard, and hosted only for testing
            purposes. This is a <b>work in progress</b>, many things aren't functional yet.
            <span class="text-error">Proceed with caution.</span>
          </p>
        </div>
      </div>
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <p class="pt-6">Enter the dashboard to edit your system, member and group information.</p>
          <a class="btn btn-primary" href={getDashLink(system.id || "", "")}>To the dash</a>
        </div>
      </div>
    </div>
  {:else}
    <div class="hero-content my-8 flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Welcome to the new dashboard!</h1>
        <div class="alert my-4 bg-base-100 max-w-lg">
          <IconFlask class="text-info" />
          <p>
            This is a complete rewrite of PluralKit's current dashboard, and hosted only for testing
            purposes. This is a <b>work in progress</b>, many things aren't functional yet.
            <span class="text-error">Proceed with caution.</span>
          </p>
        </div>
      </div>
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
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
              <span class="label-text-alt">You can get this by running pk;token</span>
              {#if form?.error}
                <br />
                <span class="label-text-alt text-error">
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
    </div>
  {/if}
</div>
