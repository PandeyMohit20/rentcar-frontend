import httpClient from '@/services/api/httpClient'

// Profile attributes and account identity are separate backend resources.
export const profileService = {
  getProfile: async () => (await httpClient.get('/profiles/me')).data.profile,
  updateProfile: async ({ dateOfBirth, gender, bio }) =>
    (
      await httpClient.patch('/profiles/me', {
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        bio: bio.trim() || null,
      })
    ).data.profile,
  getAccount: async () => (await httpClient.get('/users/me')).data.user,
  updateAccount: async ({ name, email, phone }) =>
    (
      await httpClient.patch('/users/me', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
      })
    ).data.user,
}
export default profileService
