// server/api/calendar.ts
export default defineEventHandler(async () => {
  const calendarUrl = 'https://calendar.google.com/calendar/ical/c_304760a7ea57e4264275aa9825efcaea17b01c5171990b43010deb0c538c0667%40group.calendar.google.com/private-85a26ae55339df44054e1dc7e99d2853/basic.ics'
  const response = await fetch(calendarUrl)
  const data = await response.text()
  return data
})