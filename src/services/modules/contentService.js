import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Content / static page API service (FAQ, blog, legal, etc).
 */
export const contentService = {
  async getFaqs() {
    return httpClient.get(API_ENDPOINTS.CONTENT.FAQ)
  },

  async getBlogPosts() {
    return httpClient.get(API_ENDPOINTS.CONTENT.BLOG)
  },

  async getBlogDetails(slug) {
    return httpClient.get(API_ENDPOINTS.CONTENT.BLOG_DETAILS(slug))
  },

  async getLocations() {
    return httpClient.get(API_ENDPOINTS.CONTENT.LOCATIONS)
  },

  async getAboutContent() {
    return httpClient.get(API_ENDPOINTS.CONTENT.ABOUT)
  },

  async getLegalContent() {
    return httpClient.get(API_ENDPOINTS.CONTENT.LEGAL)
  },
}

export default contentService
