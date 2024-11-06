// server/api/contacts.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const response = await $fetch('https://budgeting.today/wp-json/gh/v4/contacts?filters=W1t7InR5cGUiOiJzYXZlZF9zZWFyY2giLCJjb21wYXJlIjoiaW4iLCJzZWFyY2giOiJidWRnZXQtY29hY2hpbmctY2xpZW50cy02NzJhM2UzNDMxYmEyIn1dXQ', {
      headers: {
        'Content-Type': 'application/json',
        'GH-Token': process.env.GH_TOKEN || 'd3932277b68a152f48fc23f93517bc52',
        'GH-Public-Key': process.env.GH_PUBLIC_KEY || '482277def32cc1b3bebb8a9bd3994dda'
      }
    })
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching contacts',
      data: error
    })
  }
})