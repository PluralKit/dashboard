<script lang="ts">
  import type { Group, Member } from "$api/types"
  import { IconAlertTriangle } from "@tabler/icons-svelte"

  let {
    duplicate,
    type,
  }: {
    duplicate: Member | Group
    type: string
  } = $props()
</script>

<div class="alert bg-warning/10 mb-2 w-full mx-auto px-5 py-3 mt-2">
  <IconAlertTriangle class="text-warning" />
  <div>
    <div>
      A {type} named <b>{duplicate.name}</b> already exists! Creating another {type} with this name might
      result in unexpected behavior.
    </div>
  </div>
</div>
