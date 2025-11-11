import { Hono } from 'hono'

const leads = new Hono()

leads.get('/', (c) => c.json({ message: 'Leads route working' }))
leads.post('/', async (c) => {
  const data = await c.req.json()
  return c.json({ received: data })
})

export default leads
