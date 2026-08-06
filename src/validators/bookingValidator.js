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

export const driverDetailsSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string({ required_error: 'Phone is required' })
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number'),
  licenseNumber: z
    .string({ required_error: 'License number is required' })
    .trim()
    .min(5, 'Please enter a valid license number'),
})

export const additionalDriverSchema = z
  .object({
    includeAdditionalDriver: z.boolean().default(false),
    firstName: z.string().trim().optional().or(z.literal('')),
    lastName: z.string().trim().optional().or(z.literal('')),
    licenseNumber: z.string().trim().optional().or(z.literal('')),
  })
  .refine(
    (data) =>
      !data.includeAdditionalDriver || (data.firstName && data.lastName && data.licenseNumber),
    {
      message: 'Please complete additional driver details',
      path: ['firstName'],
    }
  )

export const emergencyContactSchema = z.object({
  contactName: z
    .string({ required_error: 'Contact name is required' })
    .trim()
    .min(2, 'Please enter the contact name'),
  contactPhone: z
    .string({ required_error: 'Contact phone is required' })
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number'),
  relation: z
    .string({ required_error: 'Relation is required' })
    .trim()
    .min(2, 'Please enter the relation'),
})

export const checkoutAgreementSchema = z.object({
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
  acceptCancellation: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the cancellation policy' }),
  }),
})

export default {
  bookingSchema,
  checkoutSchema,
  driverDetailsSchema,
  additionalDriverSchema,
  emergencyContactSchema,
  checkoutAgreementSchema,
}
