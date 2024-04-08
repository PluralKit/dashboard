<script lang="ts">
  import type { Member } from "$api/types"

  let {
    member,
    open = $bindable(false),
  }: {
    member: Member
    open?: boolean
  } = $props()
</script>

<div
  class="collapse bg-base-100 rounded-lg"
  style={member.color ? `border-color: #${member.color}; border-left-width: 6px;` : ""}
>
  <input type="checkbox" bind:checked={open} />
  <div class="collapse-title text-xl font-medium">
    {member.name} <span class="font-light">({member.id})</span>
  </div>
  <div class="collapse-content">
    <hr class="mb-2" />
    <p>hi!</p>
  </div>
</div>
