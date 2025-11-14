import { createMiddleware } from "hono/factory"
import { createClient } from "@supabase/supabase-js"
import { type Bindings, type Variables } from "../types"

export const supabaseMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  )
  c.set('supabase', supabase)
  await next()
})