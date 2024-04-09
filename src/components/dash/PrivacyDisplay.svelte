<script lang="ts">
  let {
    value = "unknown",
  }: {
    value?: string
  } = $props()
</script>

<span
  class={`${value === "unknown" ? "italic" : ""}${
    value === "private" ? "text-base-content/50" : ""
  }`}>{value}</span
>
