import createAxios from 'axios'

export const axios = createAxios.create({
  baseURL: 'http://localhost:3001',
})

axios.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})
