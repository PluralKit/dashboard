<script lang="ts">
  import {
    IconMenu2,
    IconBook,
    IconBrandDiscord,
    IconShare3,
    IconUsers,
    IconBoxMultiple,
    IconAdjustments,
    IconPaint,
    IconLogout,
    IconAddressBook,
    IconHome,
    IconSettings,
  } from "@tabler/icons-svelte"
  import { dash } from "$lib/dash/dash.svelte"

  let userMenu: HTMLDetailsElement
  let navbarMenu: HTMLDetailsElement
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <details class="dropdown" bind:this={navbarMenu}>
      <summary class="btn btn-ghost md:hidden">
        <IconMenu2 />
      </summary>
      <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <a href="/" onclick={() => (navbarMenu.open = false)}>
            <IconHome /> Homepage
          </a>
        </li>
        <li>
          <a
            href="https://discord.com/oauth2/authorize?client_id=466378653216014359&scope=bot%20applications.commands&permissions=536995904"
            onclick={() => (navbarMenu.open = false)}
          >
            <IconShare3 /> Invite bot
          </a>
        </li>
        <li>
          <a href="https://pluralkit.me/" onclick={() => (navbarMenu.open = false)}
            ><IconBook /> Documentation</a
          >
        </li>
        <li>
          <a href="https://discord.gg/PczBt78" onclick={() => (navbarMenu.open = false)}
            ><IconBrandDiscord /> Support server</a
          >
        </li>
      </ul>
    </details>
    <a href="/" class="btn btn-ghost text-xl">PluralKit</a>
  </div>
  <div class="navbar-center hidden md:flex">
    <ul class="menu menu-horizontal px-1">
      <li>
        <a
          href="https://discord.com/oauth2/authorize?client_id=466378653216014359&scope=bot%20applications.commands&permissions=536995904"
        >
          <IconShare3 /> Invite bot
        </a>
      </li>
      <li><a href="https://pluralkit.me/"><IconBook /> Documentation</a></li>
      <li><a href="https://discord.gg/PczBt78"><IconBrandDiscord /> Support server</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <a href="/settings#theme" class="mr-4 tooltip tooltip-left" data-tip="Change theme"
      ><IconPaint /></a
    >
    {#if dash.user}
      <details class="dropdown dropdown-left" bind:this={userMenu}>
        <summary class="mr-2 list-none">
          {#if dash.user.avatar_url}
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img alt="your system avatar" src={dash.user.avatar_url} />
              </div>
            </div>
          {:else}
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img alt="An icon of myriad" src="/myriad_write.png" />
              </div>
            </div>
          {/if}
        </summary>
        <ul
          data-sveltekit-preload-data="tap"
          class="menu menu-sm menu-dropdown dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-36"
        >
          <li>
            <a href={`/dash/${dash.user?.id}?tab=overview`} onclick={() => (userMenu.open = false)}
              ><IconAdjustments /> Overview</a
            >
          </li>
          <li>
            <a href={`/dash/${dash.user?.id}?tab=system`} onclick={() => (userMenu.open = false)}
              ><IconAddressBook /> System</a
            >
          </li>
          <li>
            <a href={`/dash/${dash.user?.id}?tab=members`} onclick={() => (userMenu.open = false)}
              ><IconUsers /> Members</a
            >
          </li>
          <li>
            <a href={`/dash/${dash.user?.id}?tab=groups`} onclick={() => (userMenu.open = false)}
              ><IconBoxMultiple /> Groups</a
            >
          </li>
          <hr class="my-2" />
          <li>
            <a href="/settings/general" onclick={() => (userMenu.open = false)}
              ><IconSettings /> Settings</a
            >
          </li>
          <li>
            <form method="post" action="/?/logout">
              <IconLogout />
              <input
                onclick={() => (userMenu.open = false)}
                class="text-error w-min"
                type="submit"
                value="Logout"
              />
            </form>
          </li>
        </ul>
      </details>
    {/if}
  </div>
</div>
