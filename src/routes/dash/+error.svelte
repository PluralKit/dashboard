<script>
  import { page } from "$app/stores"
</script>

<main class="prose">
  <h1>{$page.status}: {$page.error?.message}</h1>
  {#if $page.status === 401}
    <p>You need to be logged in to access this page. You can <a href="/">log in on the homepage</a>.</p>
  {/if}
</main>
