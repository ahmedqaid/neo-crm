import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createLeadSchema, getLeadsSchema, updateLeadSchema, assignLeadSchema } from '../validators/lead.validator.js'
import { type Bindings, type Variables } from '../types/index.js'

const leads = new Hono<{ Bindings: Bindings, Variables: Variables }>()

leads.post('/', zValidator('json', createLeadSchema), async (c) => {
  const validData = c.req.valid('json')
  const supabase = c.var.supabase
  try {
    const now = new Date().toISOString()
    const { error } = await supabase.from('Lead').insert({ ...validData, id: crypto.randomUUID(), createdAt: now, updatedAt: now }).select().single()
    if (error) {
      if (error.code === '23505') { return c.json({ error: 'A lead with this email already exists' }, 409) }
      return c.json({ error: 'Failed to create lead', details: error.message }, 500)
    }
    return c.json({ message: "Lead Created Successfully", status: 201, })
  } catch (error: any) {
    return c.json({ error: 'Internal server error', details: error.message }, 500)
  }
})

leads.get('/', zValidator('query', getLeadsSchema), async (c) => {
  const supabase = c.var.supabase
  const { page, limit, sortBy, sortOrder } = c.req.valid('query')
  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    const { data, error, count } = await supabase.from('Lead').select('*', { count: 'exact' }).order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to)
    if (error) { return c.json({ error: 'Failed to fetch leads', details: error.message }, 500) }
    const totalPages = Math.ceil((count ?? 0) / limit)
    
    return c.json({
      data,
      meta: {
        totalRecords: count ?? 0,
        currentPage: page,
        totalPages,
        perPage: limit
      }
    })
  } catch (error: any) {
    return c.json({ error: 'Internal server error', details: error.message }, 500)
  }
})

leads.get('/:id', async (c) => {
  const supabase = c.var.supabase
  const id = c.req.param('id')
  try {
    const { data, error } = await supabase.from('Lead').select('*').eq('id', id).single()
    if (error && error.code === 'PGRST116') { return c.json({ error: 'Lead not found' }, 404) }
    if (error) { return c.json({ error: 'Failed to fetch lead', details: error.message }, 500) }
    if (!data) { return c.json({ error: 'Lead not found' }, 404) }

    return c.json(data)
  } catch (error: any) {
    return c.json({ error: 'Internal server error', details: error.message }, 500)
  }
})

leads.put('/:id', zValidator('json', updateLeadSchema), async (c) => {
  const supabase = c.var.supabase
  const id = c.req.param('id')
  const validData = c.req.valid('json')

  try {
    const { error } = await supabase.from('Lead').update({ ...validData, updatedAt: new Date().toISOString() }).eq('id', id).select().single()
    if (error && error.code === 'PGRST116') { return c.json({ error: 'Lead not found' }, 404) }
    if (error) { return c.json({ error: 'Failed to update lead', details: error.message }, 500) }
    
    return c.json({ message: "Updated successfully", status: 200, })
  } catch (error: any) {
    return c.json({ error: 'Internal server error', details: error.message }, 500)
  }
})

export default leads