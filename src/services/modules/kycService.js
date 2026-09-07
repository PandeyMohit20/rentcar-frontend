import httpClient from '@/services/api/httpClient'
import axiosInstance from '@/services/api/axiosInstance'

export const kycService = {
  getStatus: async () => (await httpClient.get('/kyc/status')).data,
  listDocuments: async () => (await httpClient.get('/kyc/documents')).data,
  uploadDocument: async (formData) =>
    (
      await httpClient.post('/kyc/documents', formData, {
        // Clear the shared JSON default; the browser supplies the multipart boundary.
        headers: { 'Content-Type': undefined },
      })
    ).data,
  deleteDocument: (id) => httpClient.delete('/kyc/documents/' + encodeURIComponent(id)),
  submitKyc: async () => (await httpClient.post('/kyc/submit', {})).data,
  async downloadDocument(id, type) {
    const response = await axiosInstance.get(
      '/kyc/documents/' + encodeURIComponent(id) + '/download',
      {
        responseType: 'blob',
        headers: { Accept: 'application/pdf, image/jpeg, image/png' },
      }
    )
    const extension = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' }[
      response.data.type
    ]
    // The backend download name is a storage key; never reuse or display it.
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = type + (extension ? '.' + extension : '')
    document.body.appendChild(link)
    try {
      link.click()
    } finally {
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  },
}
export default kycService
