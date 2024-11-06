// server/api/contact/[id].ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const contactId = event.context.params.id
  
  if (!contactId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Contact ID is required'
    })
  }

  try {
    console.log('Calling GH API: unique contact')
    const response = await $fetch(`https://budgeting.today/wp-json/gh/v4/contacts/${contactId}`, {
      headers: {
        'Content-Type': 'application/json',
        'GH-Token': process.env.GH_TOKEN || 'd3932277b68a152f48fc23f93517bc52',
        'GH-Public-Key': process.env.GH_PUBLIC_KEY || '482277def32cc1b3bebb8a9bd3994dda'
      }
    })
    console.log('Called GH API: unique contact')
    
    return response
  } catch (error) {
    throw createError({
      statusCode: 500, 
      statusMessage: 'Error fetching contact',
      data: error
    })
  }
})