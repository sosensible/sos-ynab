import { defineStore } from "pinia"
import type { User, UserResponse } from "../data/ynab"
import { useYnabStore } from "./ynabStore"

const usePrivateYnabUserStore = defineStore("privateYnabUser", () => {
  const ynabStore = useYnabStore()
  const api =  ref<typeof ynabStore.api | null>(null)
  const accessToken = ref<string | null>(null)

  const setAccessToken = (token: string) => {
    accessToken.value = token
  }

  const getAPI = () => {
    if (accessToken.value) {
      if (!api.value) {
        api.value = ynabStore.api.withAccessToken(accessToken.value)
      }
      return api.value
    } else {
      throw new Error("Access token is required to get API")
    }
  }

  return { getAPI, setAccessToken }
})

export const useYnabUserStore = defineStore("ynabUser", () => {
  const user = ref<User | null>(null)
  const _userStore = usePrivateYnabUserStore()
  const ynabStore = useYnabStore()

  const setAccessToken = (token: string) => {
    _userStore.setAccessToken(token)
  }

  const setUser = async () => {
    const response: UserResponse = await _userStore.api.user.getUser()
    user.value = response.data.user
    return response.data.user
  }

  const getUser = () => {
    return user.value
  }

  return { getUser, setAccessToken, setUser }
})