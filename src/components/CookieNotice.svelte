<script lang="ts">
  import { cookieState } from "$lib/common/cookies.svelte"
  import { IconExclamationCircle } from "@tabler/icons-svelte"

  let {
    class: className = "",
  }: {
    class?: string
  } = $props()

  let hidden = $state(false)

  function acceptCookies() {
    cookieState().accept()
    hidden = true
  }
</script>

<div role="alert" class={`alert ${className} ${hidden ? "hidden" : ""}`}>
  <IconExclamationCircle class="text-info" />
  <p>
    The dashboard uses cookies to provide some of <span
      class="tooltip tooltip-bottom border-b inline border-base-content/50 border-dashed"
      data-tip="such as logging in, and changing any display settings.">its core functionality</span
    >.
  </p>
  <div>
    <button on:click={() => acceptCookies()} class="btn btn-sm btn-primary">Got it!</button>
  </div>
</div>
