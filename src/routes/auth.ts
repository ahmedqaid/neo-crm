import { Hono } from 'hono'

const auth = new Hono()

auth.post('/login', async (c) => c.json({ message: 'Auth route working' }))

export default auth
