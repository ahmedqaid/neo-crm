import { Hono } from 'hono'
import { type Bindings, type Variables } from './types'
import { supabaseMiddleware } from './middlewares/supabase.middleware'
import leadRoutes from './routes/lead.routes.js'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

app.use('*', supabaseMiddleware)

app.route('/leads', leadRoutes)

app.get('/', (c) => {
  return c.text('Neogoals API is running!')
})

export default app