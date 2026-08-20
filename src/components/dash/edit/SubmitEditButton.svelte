<script lang="ts">
  import { type ApiError } from "$api"
  import { browser } from "$app/environment"
  import { IconDeviceFloppy } from "@tabler/icons-svelte"
  let {
    submitEdit,
    err = $bindable(),
    loading = $bindable(),
    disabled,
  }: {
    submitEdit: (token: string) => Promise<void>
    err: string[]
    loading: boolean
    disabled?: boolean
  } = $props()
</script>

<button
  onclick={async () => {
    if (!browser || disabled) return
    const token = localStorage.getItem("pk-token") || ""
    if (!token) return

    loading = true

    try {
      await submitEdit(token)
    } catch (e) {
      const error = e as ApiError
      console.error(error.data)
      err.push(error.message || "")
    }
    
    loading = false
  }}
  class="btn btn-sm btn-success join-item"
  {disabled}
>
  <IconDeviceFloppy /> Save
</button>
