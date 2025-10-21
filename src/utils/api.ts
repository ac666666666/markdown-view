import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com/api' 
    : 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// API接口定义
export const markdownAPI = {
  // 上传Markdown文件
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/markdown/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 保存Markdown内容
  saveMarkdown: (content: string, title?: string) => {
    return api.post('/markdown/save', { content, title })
  },

  // 获取Markdown文件列表
  getMarkdownList: () => {
    return api.get('/markdown/list')
  },

  // 获取单个Markdown文件
  getMarkdown: (id: string) => {
    return api.get(`/markdown/${id}`)
  },

  // 删除Markdown文件
  deleteMarkdown: (id: string) => {
    return api.delete(`/markdown/${id}`)
  },
}

export default api