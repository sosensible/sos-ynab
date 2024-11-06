// stores/useCalendarStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCalendar } from '@/composables/useCalendar'

interface CalendarSlot {
  start: Date
  end: Date
  isAvailable: boolean
}

export const useCalendarStore = defineStore('calendar', () => {
  const availableSlots = ref<CalendarSlot[]>([])
  const isLoading = ref(false)
  const calendar = useCalendar()

  async function fetchCalendar() {
    isLoading.value = true
    try {
      const events = await calendar.fetchAndParseCalendar()
      const todayEvents = events.filter(isToday)
      processAvailableSlots(todayEvents)
    } catch (error) {
      console.error('Failed to fetch calendar:', error)
    } finally {
      isLoading.value = false
    }
  }

  function isToday(event: { start: Date }): boolean {
    const today = new Date()
    return event.start.getDate() === today.getDate() &&
      event.start.getMonth() === today.getMonth() &&
      event.start.getFullYear() === today.getFullYear()
  }

  function processAvailableSlots(busyEvents: any[]) {
    const slots = generateTimeSlots()
    availableSlots.value = slots.map(slot => ({
      ...slot,
      isAvailable: !busyEvents.some(busy => 
        (busy.start <= slot.start && slot.start < busy.end) ||
        (busy.start < slot.end && slot.end <= busy.end)
      )
    }))
  }

  function generateTimeSlots(): CalendarSlot[] {
    const slots = []
    const now = new Date()
    now.setHours(9, 0, 0, 0)
    
    for (let i = 0; i < 8; i++) {
      const start = new Date(now)
      start.setHours(start.getHours() + i)
      const end = new Date(start)
      end.setHours(end.getHours() + 1)
      slots.push({ start, end, isAvailable: true })
    }
    return slots
  }

  return {
    availableSlots: computed(() => availableSlots.value),
    isLoading: computed(() => isLoading.value),
    fetchCalendar
  }
})