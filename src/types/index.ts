// 主题类型
export type Theme = 'light' | 'dark' | 'eye-care'

// Markdown文件类型
export interface MarkdownFile {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  size: number
}

// 编辑器配置类型
export interface EditorConfig {
  fontSize: number
  lineHeight: number
  tabSize: number
  wordWrap: boolean
  showLineNumbers: boolean
  theme: Theme
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 文件上传响应类型
export interface UploadResponse {
  id: string
  filename: string
  size: number
  url: string
}

// 标题结构类型~
export interface Heading {
  level: number
  text: string
  id: string
}

// 内容统计类型
export interface ContentStats {
  lines: number
  words: number
  characters: number
  charactersNoSpaces: number
}

// 应用状态类型
export interface AppState {
  // 主题相关
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // 编辑器相关
  content: string
  setContent: (content: string) => void
  
  // 文件相关
  currentFile: MarkdownFile | null
  setCurrentFile: (file: MarkdownFile | null) => void
  
  // UI状态
  isPreviewMode: boolean
  setPreviewMode: (mode: boolean) => void
  
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}