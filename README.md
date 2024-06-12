This the SvelteKit rewrite of [PluralKit's dashboard](https://github.com/PluralKit/PluralKit/tree/main/dashboard). It uses [svelte 5](https://svelte-5-preview.vercel.app/).

## Development
Developing the dashboard requires [node.js v20](https://nodejs.org/en) and [pnpm](https://pnpm.io/).

Create a .env file in the repository root with the following variables
- `PUBLIC_BASE_API_URL`: the default base API url (not ending in a `/`)
- `PUBLIC_API_COOLDOWN`: time in milliseconds between *some* consecutive API requests (to avoid getting ratelimited)
- `PUBLIC_REPOSITORY_URL`: url of the git repository (use https://github.com/PluralKit/dashboard or your fork)

## Building
Building can either be done using `pnpm build` or `docker build`.

Example docker build command
```
docker build -t pluralkit-dashboard \
  --build-arg="base_api_url=https://api.pluralkit.me" \
  --build-arg="api_cooldown=330" \
  --build-arg="repository_url=https://github.com/PluralKit/dashboard" \
  .
```