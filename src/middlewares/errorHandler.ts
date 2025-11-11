import { Context } from 'hono'

export const errorHandler = (err: Error, c: Context) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
}
