import { z } from 'zod'

export const createLeadSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name is required' }),
    country: z.string().min(2, { message: 'Country is required' }),
    email: z.email({ message: 'Email is invalid' }),
    phone: z.string().min(5, { message: 'Phone number is required' }),
    programType: z.string().min(2, { message: 'Program type is required' }),
    fieldOfStudy: z.string().optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
})

export const getLeadsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const updateLeadSchema = createLeadSchema.partial()

export const assignLeadSchema = z.object({
  counselorId: z.uuid({ message: "Invalid Counselor ID" })
})