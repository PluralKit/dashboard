<script lang="ts">
  import { IconMenu2, IconLogout, IconHome } from "@tabler/icons-svelte"
  import discord_icon from "@pluralkit-web/ui/assets/discord_icon.svg"

  let userMenu: HTMLDetailsElement
  let navbarMenu: HTMLDetailsElement

  let { links = [], user } = $props()
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start flex-1">
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

        {#each links as { href, label, icon: Icon }}
          <li>
            <a {href} onclick={() => (navbarMenu.open = false)}>
              {#if Icon}
                {Icon}
              {/if}
              {label}
            </a>
          </li>
        {/each}
      </ul>
    </details>
    <a href="/" class="hidden text-xl btn btn-ghost md:inline-flex">PluralKit</a>
  </div>
  <div class="hidden navbar-center md:flex">
    <ul class="px-1 menu menu-horizontal">
      {#each links as { href, label, icon: Icon }}
        <li>
          <a {href}>
            {#if Icon}
              <Icon />
            {/if}
            {label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="navbar-end w-auto">
    <!-- <a href="/settings#theme" class="mr-4 tooltip tooltip-bottom" data-tip="Change theme"
      ><IconPaint /></a
    > -->
    {#if user}
      <details class="dropdown dropdown-left" bind:this={userMenu}>
        <summary class="mr-2 list-none">
          <div class="avatar">
            <div class="w-12 rounded-full">
              {#if user.avatar_url}
                <img alt="your system avatar" src={user.avatar_url} />
              {:else}
                <img alt="Default system avatar" src={discord_icon} />
              {/if}
            </div>
          </div>
        </summary>
        <ul
          data-sveltekit-preload-data="tap"
          class="menu menu-sm menu-dropdown dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-36"
        >
          <!-- <li>
            <a href={`/dash/${user?.id}?tab=overview`} onclick={() => (userMenu.open = false)}
              ><IconAdjustments /> Overview</a
            >
          </li>
          <li>
            <a href={`/dash/${user?.id}?tab=system`} onclick={() => (userMenu.open = false)}
              ><IconAddressBook /> System</a
            >
          </li>
          <li>
            <a href={`/dash/${user?.id}?tab=members`} onclick={() => (userMenu.open = false)}
              ><IconUsers /> Members</a
            >
          </li>
          <li>
            <a href={`/dash/${user?.id}?tab=groups`} onclick={() => (userMenu.open = false)}
              ><IconBoxMultiple /> Groups</a
            >
          </li>
          <hr class="my-2" />
          <li>
            <a href="/settings/general" onclick={() => (userMenu.open = false)}
              ><IconSettings /> Settings</a
            >
          </li> -->
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
