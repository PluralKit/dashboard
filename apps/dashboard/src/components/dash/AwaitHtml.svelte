<script lang="ts">
  import { Spinny } from "@pluralkit-web/ui"

  export let htmlPromise: Promise<string> = Promise.resolve("")
</script>

{#await htmlPromise}
  <Spinny /> loading...
{:then html}
  {@html html ?? ""}
{:catch error}
  (failed to parse: {error?.message ?? String(error)})
{/await}
