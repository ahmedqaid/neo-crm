import { Hono } from 'hono'
import { logger } from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'
import leadRoutes from './routes/leads'
import counselorRoutes from './routes/counselors'
import authRoutes from './routes/auth'

const app = new Hono()

app.use('*', logger)
app.notFound((c) => c.json({ error: 'Not Found' }, 404))
app.onError(errorHandler)

app.route('/leads', leadRoutes)
app.route('/counselors', counselorRoutes)
app.route('/auth', authRoutes)

export default app
