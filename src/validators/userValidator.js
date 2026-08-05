import { z } from 'zod'

/**
 * Zod schemas for user profile forms.
 */
export const profileSchema = z.object({
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
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Please enter your current password'),
    password: z
      .string({ required_error: 'New password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number'),
    confirmPassword: z.string({ required_error: 'Please confirm your new password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default { profileSchema, changePasswordSchema }
