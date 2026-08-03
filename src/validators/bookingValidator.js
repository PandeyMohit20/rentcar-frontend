import { z } from 'zod'

/**
 * Zod schemas for booking-related forms.
 */
export const bookingSchema = z
  .object({
    carId: z.string({ required_error: 'Car is required' }),
    pickupDate: z.string({ required_error: 'Pickup date is required' }),
    dropDate: z.string({ required_error: 'Drop date is required' }),
    pickupLocation: z
      .string({ required_error: 'Pickup location is required' })
      .trim()
      .min(3, 'Please enter a valid pickup location'),
    dropLocation: z
      .string({ required_error: 'Drop location is required' })
      .trim()
      .min(3, 'Please enter a valid drop location'),
  })
  .refine((data) => new Date(data.dropDate) > new Date(data.pickupDate), {
    message: 'Drop date must be after pickup date',
    path: ['dropDate'],
  })

export const checkoutSchema = z.object({
  paymentMethod: z.string({ required_error: 'Please select a payment method' }),
  couponCode: z
    .string()
    .trim()
    .toUpperCase()
    .max(20, 'Coupon code is too long')
    .optional()
    .or(z.literal('')),
  billingName: z.string({ required_error: 'Billing name is required' }).trim().min(2),
  billingEmail: z
    .string({ required_error: 'Billing email is required' })
    .trim()
    .email('Please enter a valid email address'),
  billingPhone: z
    .string({ required_error: 'Billing phone is required' })
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number'),
})

export default { bookingSchema, checkoutSchema }
