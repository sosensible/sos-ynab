import { useMenuStore } from '~/store/menuStore'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const menuStore = useMenuStore()

    menuStore.addMenu({ id: 5, name: 'YNAB', link: '/ynab', children: [
      { id: 1, name: 'About', link: '/ynab/about' }
    ]})
  })
})
