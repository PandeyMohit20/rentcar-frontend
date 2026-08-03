import { z } from 'zod'

/**
 * Zod schemas for car search and filters.
 */
export const carSearchSchema = z.object({
  location: z.string().trim().optional().or(z.literal('')),
  pickupDate: z.string().optional().or(z.literal('')),
  dropDate: z.string().optional().or(z.literal('')),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  fuelType: z.string().optional().or(z.literal('')),
  transmission: z.string().optional().or(z.literal('')),
  seatingCapacity: z.coerce.number().int().positive().optional(),
})

export const carReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Please select a rating').max(5, 'Rating cannot exceed 5'),
  title: z.string().trim().min(4, 'Title must be at least 4 characters').max(100),
  comment: z.string().trim().min(10, 'Review must be at least 10 characters').max(1000),
})

export default { carSearchSchema, carReviewSchema }
