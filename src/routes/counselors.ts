import { Hono } from 'hono'

const counselors = new Hono()

counselors.get('/', (c) => c.json({ message: 'Counselors route working' }))

export default counselors
