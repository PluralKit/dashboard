import { browser } from "$app/environment";

export function cookieState() {
  let acceptedCookies = $state(browser && localStorage.getItem("pk-cookies") ? true : false)
  return { 
    get accepted() {
      return acceptedCookies
    },
    accept: () => {
      localStorage.setItem("pk-cookies", "accepted!")
      acceptedCookies = true
    }
  }
}