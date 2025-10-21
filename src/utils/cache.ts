import type { MarkdownFile, Theme } from '../types'

// 缓存键名常量
export const CACHE_KEYS = {
  DOCUMENTS: 'md-app-documents',
  CURRENT_DOCUMENT: 'md-app-current-document',
  THEME: 'md-app-theme',
  EDIT_MODE: 'md-app-edit-mode',
  EDITOR_CONTENT: 'md-app-editor-content',
  SIDEBAR_OPEN: 'md-app-sidebar-open',
  LAST_VISIT: 'md-app-last-visit'
} as const

// 应用状态接口
export interface AppCache {
  documents: MarkdownFile[]
  currentDocument: MarkdownFile | null
  theme: Theme
  isEditMode: boolean
  editorContent: string
  isSidebarOpen: boolean
  lastVisit: string
}

// 缓存工具类
export class CacheManager {
  private static instance: CacheManager
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  // 保存单个值到缓存
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Failed to save ${key} to cache:`, error)
    }
  }

  // 从缓存获取单个值
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.warn(`Failed to load ${key} from cache:`, error)
      return defaultValue || null
    }
  }

  // 删除缓存项
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from cache:`, error)
    }
  }

  // 清空所有应用缓存
  clear(): void {
    Object.values(CACHE_KEYS).forEach(key => {
      this.remove(key)
    })
  }

  // 保存完整的应用状态
  saveAppState(state: Partial<AppCache>): void {
    if (state.documents) this.set(CACHE_KEYS.DOCUMENTS, state.documents)
    if (state.currentDocument !== undefined) this.set(CACHE_KEYS.CURRENT_DOCUMENT, state.currentDocument)
    if (state.theme) this.set(CACHE_KEYS.THEME, state.theme)
    if (state.isEditMode !== undefined) this.set(CACHE_KEYS.EDIT_MODE, state.isEditMode)
    if (state.editorContent !== undefined) this.set(CACHE_KEYS.EDITOR_CONTENT, state.editorContent)
    if (state.isSidebarOpen !== undefined) this.set(CACHE_KEYS.SIDEBAR_OPEN, state.isSidebarOpen)
    
    // 更新最后访问时间
    this.set(CACHE_KEYS.LAST_VISIT, new Date().toISOString())
  }

  // 恢复完整的应用状态
  restoreAppState(): Partial<AppCache> {
    return {
      documents: this.get<MarkdownFile[]>(CACHE_KEYS.DOCUMENTS, []) || [],
      currentDocument: this.get<MarkdownFile | null>(CACHE_KEYS.CURRENT_DOCUMENT, null),
      theme: this.get<Theme>(CACHE_KEYS.THEME, 'light') || 'light',
      isEditMode: this.get<boolean>(CACHE_KEYS.EDIT_MODE, false) || false,
      editorContent: this.get<string>(CACHE_KEYS.EDITOR_CONTENT, '') || '',
      isSidebarOpen: this.get<boolean>(CACHE_KEYS.SIDEBAR_OPEN, true) ?? true,
      lastVisit: this.get<string>(CACHE_KEYS.LAST_VISIT, new Date().toISOString()) || new Date().toISOString()
    }
  }

  // 检查是否有缓存数据
  hasCache(): boolean {
    return localStorage.getItem(CACHE_KEYS.DOCUMENTS) !== null
  }

  // 获取缓存大小（估算）
  getCacheSize(): number {
    let size = 0
    Object.values(CACHE_KEYS).forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        size += item.length
      }
    })
    return size
  }

  // 自动清理过期缓存（可选功能）
  cleanExpiredCache(maxAge: number = 30 * 24 * 60 * 60 * 1000): void { // 默认30天
    const lastVisit = this.get<string>(CACHE_KEYS.LAST_VISIT)
    if (lastVisit) {
      const lastVisitTime = new Date(lastVisit).getTime()
      const now = new Date().getTime()
      if (now - lastVisitTime > maxAge) {
        console.log('Cleaning expired cache...')
        this.clear()
      }
    }
  }
}

// 导出单例实例
export const cacheManager = CacheManager.getInstance()