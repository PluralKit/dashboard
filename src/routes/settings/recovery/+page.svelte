<script lang="ts">
  import { browser } from "$app/environment"
  import CopyField from "$components/dash/CopyField.svelte"
  import { IconAlertTriangle } from "@tabler/icons-svelte"

  let { data } = $props()

  let show = $state(false)

  function toggle() {
    show = !show
  }
</script>

<h2 class="text-3xl my-4 font-bold" id="display">System Recovery</h2>
<p class="my-4">
  If you've lost access to your discord account, you can retrieve your token here.
</p>
<p class="my-4">
  Head to the <code>#bot-support</code> channel in <a href="https://discord.gg/PczBt78">the support server</a>.<br/>
  State that you need help with system recovery and that you have your token, then wait for a staff member to get to you.
</p>
<p class="my-4">
  <IconAlertTriangle class="text-error inline" /> <b>Do NOT post your token in public</b>.<br/>
  Also, please do not ping staff or DM a staff member directly. We'll get to you, promise!
</p>

{#if data.token}
    <div class="flex flex-row flex-wrap gap-4">
    <button onclick={toggle} class="btn btn-error w-fit">Reveal Token</button>
    {#if show}
    <div class="box flex flex-row gap-3 break-all">
      <CopyField value={data.token} field="token" visible ></CopyField>
      <span class="break-words">{data.token}</span>
    </div>
    {/if}
    </div>
{/if}