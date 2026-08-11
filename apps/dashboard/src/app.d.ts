// See https://kit.svelte.dev/docs/types#app

import type { ApiClient } from "$api"

declare const __COMMIT_HASH__: string

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      api: ApiClient
      apiBaseUrl?: string
    }
    // interface PageData {}
    // interface Platform {}
  }

  interface Window {
    api: ApiClient
  }
}

export {}
