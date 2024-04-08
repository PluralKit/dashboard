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
  } from "@tabler/icons-svelte"
  import { dash } from "$lib/dash/dash.svelte"

  let user = dash.user
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <button class="btn btn-ghost md:hidden">
        <IconMenu2 />
      </button>
      <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
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
    <a href="/settings#theme" class="mr-4 tooltip tooltip-left" data-tip="Change theme"><IconPaint /></a>
    {#if user}
      <div class="dropdown dropdown-left">
        <button class="mr-2">
          {#if user.avatar_url}
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img alt="your system avatar" src={user.avatar_url} />
              </div>
            </div>
          {:else}
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img alt="An icon of myriad" src="/myriad_write.png" />
              </div>
            </div>
          {/if}
        </button>
        <ul class="menu menu-sm menu-dropdown dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-36">
          <li><a href={`/dash/${user?.id}`}><IconAdjustments /> Overview</a></li>
          <li><a href={`/dash/${user?.id}/system`}><IconAddressBook /> System</a></li>
          <li><a href={`/dash/${user?.id}/members`}><IconUsers /> Members</a></li>
          <li><a href={`/dash/${user?.id}/groups`}><IconBoxMultiple /> Groups</a></li>
          <div class="divider divider-neutral my-1"></div>
          <li>
            <form method="post" action="/?/logout">
              <IconLogout /> <input class="text-error w-min" type="submit" value="Logout" />
            </form>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>
