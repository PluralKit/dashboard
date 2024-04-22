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

<button class="btn btn-neutral btn-sm w-full" onclick={() => element.showModal()}
  >View {imageType}</button
>
<dialog tabindex="-1" bind:this={element} class="modal">
  <form method="dialog" class="w-full h-full">
    <button
      tabindex="-1"
      class="w-full h-full grid justify-center items-center p-4 max-h-screen max-w-screen"
    >
      <div class="max-w-3xl h-full flex flex-col">
        <img
          class="rounded-xl m-auto w-auto h-auto max-h-full"
          src={url}
          alt={`${itemName}'s ${imageType}`}
        />
      </div>
    </button>
  </form>
</dialog>
