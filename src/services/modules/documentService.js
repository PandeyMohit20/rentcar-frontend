/**
 * Documents API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const documentService = {
  async listDocuments() {
    return Promise.resolve({ data: { documents: [] } })
  },

  async uploadDocument(payload) {
    return Promise.resolve({ data: { id: `DOC-${Date.now()}`, ...payload } })
  },

  async deleteDocument(id) {
    return Promise.resolve({ data: { id, deleted: true } })
  },
}

export default documentService
