<script lang="ts">
  import { page } from "$app/state"
  import { IconAlertTriangle } from "@tabler/icons-svelte"
</script>

<div class="flex flex-col flex-1 w-full p-6 px-2 mx-auto bg-base-200 sm:px-4 lg:px-6 xl:px-8">
  <div class="mx-auto w-full max-w-3xl">
    <div class="alert bg-error/10 mb-2 w-full mx-auto px-5 py-3 mt-2">
      <IconAlertTriangle class="text-error" />
      <div>
        <div>
          <h2>{page.status}: {page.error?.message}</h2>
        </div>
      </div>
    </div>
    <div class="box bg-base-100">
      <div class="prose max-w-none">
        {#if page.status === 404}
          <p>
            Page not found. Either you've followed an incorrect link, or this feature is a work in
            progress.
          </p>
        {:else if page.status === 500}
          <p>
            Internal server error. This is most likely a bug. Please <a
              href="https://discord.gg/PczBt78">report it to the developers</a
            > and include the steps you took to get here.
          </p>
        {:else if page.status === 401}
          <p>You need to be logged in to access this area.</p>
        {:else if page.status === 403}
          <p>You are not allowed to access this area.</p>
        {:else if page.status === 400}
          <p>
            Bad request.
            {#if page.url.pathname.startsWith("/view")}
              Did you copy the URL in its entirety?
            {:else}
              If you're not sure how this happened, please ask <a href="https://discord.gg/PczBt78"
                >in the support server</a
              > and include the steps you took to get here.
            {/if}
          </p>
        {:else}
          <p>Well, that wasn't supposed to happen.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
