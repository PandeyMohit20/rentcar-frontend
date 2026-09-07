import httpClient from '@/services/api/httpClient'

function addressDto(values) {
  const dto = {}
  for (const field of [
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'country',
    'postalCode',
    'addressType',
  ]) {
    if (values[field] !== undefined) dto[field] = values[field].trim()
  }
  if (values.isDefault !== undefined) dto.isDefault = values.isDefault === true
  return dto
}
export const addressService = {
  listAddresses: async () => (await httpClient.get('/addresses')).data.addresses,
  createAddress: async (values) =>
    (await httpClient.post('/addresses', addressDto(values))).data.address,
  updateAddress: async (id, values) =>
    (await httpClient.patch('/addresses/' + encodeURIComponent(id), addressDto(values))).data
      .address,
  deleteAddress: (id) => httpClient.delete('/addresses/' + encodeURIComponent(id)),
}
export default addressService
