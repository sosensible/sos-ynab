// stores/useCalendarStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCalendar } from '@/composables/useCalendar'

interface CalendarEvent {
  start: Date
  end: Date
  summary: string
}

interface CalendarSlot {
  start: Date
  end: Date
  isAvailable: boolean
  isBusy: boolean
}

export const useCalendarStore = defineStore('calendar', () => {
  const availableSlots = ref<CalendarSlot[]>([])
  const cachedEvents = ref<CalendarEvent[]>([])
  const selectedSlot = ref<CalendarSlot | null>(null)
  const isLoading = ref(false)
  const calendar = useCalendar()
  const currentDate = ref(new Date())

  const canGoBack = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const current = new Date(currentDate.value)
    current.setHours(0, 0, 0, 0)
    return current > today
  })

  const currentDayEvents = computed(() => 
    filterEventsForDate(currentDate.value)
  )

  async function fetchCalendar() {
    if (cachedEvents.value.length) {
      processAvailableSlots(filterEventsForDate(currentDate.value))
      return
    }
    await refreshCalendar()
  }

  async function refreshCalendar() {
    isLoading.value = true
    try {
      cachedEvents.value = await calendar.fetchAndParseCalendar()
      processAvailableSlots(filterEventsForDate(currentDate.value))
    } catch (error) {
      console.error('Failed to fetch calendar:', error)
    } finally {
      isLoading.value = false
    }
  }

  function filterEventsForDate(date: Date): CalendarEvent[] {
    return cachedEvents.value.filter(event => {
      const eventStart = new Date(event.start)
      return isSameDay(eventStart, date)
    })
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
  }

  function processAvailableSlots(busyEvents: CalendarEvent[]) {
    const slots = generateTimeSlots()
    availableSlots.value = slots.map(slot => {
      const isBusy = busyEvents.some(busy => 
        (busy.start <= slot.start && slot.start < busy.end) ||
        (busy.start < slot.end && slot.end <= busy.end)
      )
      
      return {
        ...slot,
        isBusy,
        isAvailable: !isBusy && isSlotInFuture(slot.start)
      }
    })
  }

  function isSlotInFuture(slotTime: Date): boolean {
    const now = new Date()
    return slotTime > now
  }

  function generateTimeSlots(): CalendarSlot[] {
    const slots = []
    const date = new Date(currentDate.value)
    date.setHours(9, 0, 0, 0)
    
    for (let i = 0; i < 8; i++) {
      const start = new Date(date)
      start.setHours(start.getHours() + i)
      const end = new Date(start)
      end.setHours(end.getHours() + 1)
      slots.push({ start, end, isAvailable: true, isBusy: false })
    }
    return slots
  }

  function nextDay() {
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + 1))
    processAvailableSlots(filterEventsForDate(currentDate.value))
  }

  function previousDay() {
    if (canGoBack.value) {
      currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() - 1))
      processAvailableSlots(filterEventsForDate(currentDate.value))
    }
  }

  function selectSlot(slot: CalendarSlot) {
    console.log('Selected slot:', slot)
    if (slot.isAvailable && !slot.isBusy) {
      selectedSlot.value = slot
    }
  }

  return {
    availableSlots: computed(() => availableSlots.value),
    isLoading: computed(() => isLoading.value),
    currentDate: computed(() => currentDate.value),
    selectedSlot: computed(() => selectedSlot.value),
    cachedEvents,
    fetchCalendar,
    refreshCalendar,
    canGoBack,
    nextDay,
    previousDay,
    selectSlot,
    currentDayEvents
  }
})