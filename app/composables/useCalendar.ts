// composables/useCalendar.ts
import { ref } from 'vue'
import ical from 'ical.js'

export function useCalendar() {
  const availableSlots = ref([])
  const isLoading = ref(false)
  const busyTimes = ref([])

  function isToday(date: Date): boolean {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  async function fetchCalendar() {
    isLoading.value = true
    try {
      const response = await useFetch('/api/calendar')
      const icalData = response.data.value
      const jcalData = ical.parse(icalData)
      const comp = new ical.Component(jcalData)
      const events = comp.getAllSubcomponents('vevent')

      busyTimes.value = events
        .map(event => ({
          start: new Date(event.getFirstPropertyValue('dtstart')),
          end: new Date(event.getFirstPropertyValue('dtend')),
          summary: event.getFirstPropertyValue('summary') || 'Busy'
        }))
        .filter(event => isToday(event.start))

      const slots = generateTimeSlots()
      availableSlots.value = slots.map(slot => ({
        ...slot,
        isAvailable: !busyTimes.value.some(busy => 
          (busy.start <= slot.start && slot.start < busy.end) ||
          (busy.start < slot.end && slot.end <= busy.end)
        )
      }))
    } catch (error) {
      console.error('Failed to fetch calendar:', error)
    } finally {
      isLoading.value = false
    }
  }

  function generateTimeSlots() {
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
    availableSlots,
    busyTimes,
    isLoading,
    fetchCalendar
  }
}