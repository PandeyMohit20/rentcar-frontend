/**
 * User domain shape contracts (documentation only).
 */
export const UserShape = Object.freeze({
  id: 'string',
  firstName: 'string',
  lastName: 'string',
  email: 'string',
  phone: 'string',
  avatar: 'string',
  role: 'string',
  status: 'string',
  isEmailVerified: 'boolean',
  isPhoneVerified: 'boolean',
  createdAt: 'string',
})

export default UserShape
