import axios from 'axios'
import tokenStorage from '@/utils/token'
const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 3000
})

// 请求拦截
http.interceptors.request.use((config) => {
  const token = tokenStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截
http.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export { http }