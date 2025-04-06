<script lang="ts">
  let {
    url,
    imageType,
    itemName = "",
  }: {
    url: string
    imageType: string
    itemName?: string
  } = $props()

  let element: HTMLDialogElement
</script>

<button class="w-full btn btn-neutral btn-sm" onclick={() => element.showModal()}
  >View {imageType}</button
>
<dialog bind:this={element} class="modal">
  <form method="dialog" class="w-full h-full">
    <button class="grid items-center justify-center w-full h-full max-h-screen p-4 max-w-screen">
      <div class="flex flex-col h-full max-w-3xl">
        <img
          class="w-auto h-auto max-h-full m-auto rounded-xl"
          src={url}
          alt={`${itemName}'s ${imageType}`}
        />
      </div>
    </button>
  </form>
</dialog>
