// server/api/calendar.ts
export default defineEventHandler(async () => {
  // Direct env access only works in server-side code
  const calendarUrl = process.env.CALENDAR_URL
  
  if (!calendarUrl) {
    throw createError({
      statusCode: 500,
      message: 'Calendar URL not configured'
    })
  }

  const response = await fetch(calendarUrl)
  const data = await response.text()
  return data
})