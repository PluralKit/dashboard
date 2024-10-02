// See https://kit.svelte.dev/docs/types#app

import type { ApiClient } from "$api"

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      api: ApiClient
    }
    // interface PageData {}
    // interface Platform {}
  }

  interface Window {
    api: ApiClient
  }
}

export {}
