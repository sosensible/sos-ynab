// composables/useCalendar.ts
import ical from 'ical.js'

interface CalendarEvent {
  start: Date
  end: Date
  summary: string
}

export function useCalendar() {
  async function fetchAndParseCalendar(): Promise<CalendarEvent[]> {
    const response = await useFetch('/api/calendar')
    const icalData = response.data.value
    
    const jcalData = ical.parse(icalData)
    const comp = new ical.Component(jcalData)
    const events = comp.getAllSubcomponents('vevent')
    
    return events.map(event => ({
      start: new Date(event.getFirstPropertyValue('dtstart')),
      end: new Date(event.getFirstPropertyValue('dtend')),
      summary: event.getFirstPropertyValue('summary') || 'Busy'
    }))
  }

  return {
    fetchAndParseCalendar
  }
}