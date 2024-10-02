<script lang="ts">
  let {
    size = "xs",
  }: {
    size?: "xs" | "sm" | "md"
  } = $props()
</script>

<span class={`loading loading-spinner loading-${size} text-muted`}></span>
