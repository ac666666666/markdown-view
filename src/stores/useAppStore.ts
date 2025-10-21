import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import type { Theme, MarkdownFile } from '../types'
import { cacheManager } from '../utils/cache'

interface AppState {
  // 主题相关
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // 文档相关
  documents: MarkdownFile[]
  currentDocument: MarkdownFile | null
  setDocuments: (documents: MarkdownFile[]) => void
  setCurrentDocument: (document: MarkdownFile | null) => void
  addDocument: (document: MarkdownFile) => void
  updateDocument: (id: string, updates: Partial<MarkdownFile>) => void
  deleteDocument: (id: string) => void
  
  // 编辑器相关
  isEditMode: boolean
  setEditMode: (mode: boolean) => void
  editorContent: string
  setEditorContent: (content: string) => void
  
  // UI状态
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // 文件上传相关
  isUploading: boolean
  setUploading: (uploading: boolean) => void
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      // 主题相关
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        // 更新HTML class
        const root = document.documentElement
        root.classList.remove('light', 'dark', 'eye-care')
        if (theme === 'dark') {
          root.classList.add('dark')
        } else if (theme === 'eye-care') {
          root.classList.add('eye-care')
        }
      },
      
      // 文档相关
      documents: [
        {
          id: '1',
          title: '示例文档',
          content: `# MD预览器

这是一个轻量级的Markdown预览器，专为简约体验设计。

## 功能特性

- ✅ 支持上传Markdown文件
- ✅ 左侧文档管理器显示多个文件
- ✅ 实时编辑Markdown内容
- 🔄 支持亮色和暗色主题
- 📱 完全适配移动端体验
- 🎯 针对微信浏览器优化，无需安装任何插件

## 使用指南

点击上传文件，将您的.md文件拖拽或选择上传到系统中。

文件将显示在左侧文档管理器中，点击文档名称即可在右侧预览内容。

点击右上角的编辑按钮可以进入编辑模式，修改完成后点击保存即可。

点击右上角的主题切换按钮可以切换显示模式。

欢迎使用！`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          size: 0
        }
      ],
      currentDocument: null,
      setDocuments: (documents) => set({ documents }),
      setCurrentDocument: (document) => {
        set({ 
          currentDocument: document,
          editorContent: document?.content || '',
          isEditMode: false
        })
      },
      addDocument: (document) => {
        const { documents } = get()
        set({ documents: [...documents, document] })
      },
      updateDocument: (id, updates) => {
        const { documents } = get()
        const updatedDocuments = documents.map(doc => 
          doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
        )
        set({ documents: updatedDocuments })
        
        // 如果更新的是当前文档，也更新currentDocument
        const { currentDocument } = get()
        if (currentDocument?.id === id) {
          set({ currentDocument: { ...currentDocument, ...updates } })
        }
      },
      deleteDocument: (id) => {
        const { documents, currentDocument } = get()
        const filteredDocuments = documents.filter(doc => doc.id !== id)
        set({ 
          documents: filteredDocuments,
          currentDocument: currentDocument?.id === id ? null : currentDocument
        })
      },
      
      // 编辑器相关
      isEditMode: false,
      setEditMode: (mode) => set({ isEditMode: mode }),
      editorContent: '',
      setEditorContent: (content) => set({ editorContent: content }),
      
      // UI状态
      isSidebarOpen: true,
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      // 文件上传相关
      isUploading: false,
      setUploading: (uploading) => set({ isUploading: uploading })
    }),
    {
      name: 'markdown-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        documents: state.documents,
        currentDocument: state.currentDocument,
        isEditMode: state.isEditMode,
        editorContent: state.editorContent,
        isSidebarOpen: state.isSidebarOpen
      }),
      // 自定义存储引擎，添加错误处理
      storage: {
        getItem: (name) => {
          try {
            const item = localStorage.getItem(name)
            return item ? JSON.parse(item) : null
          } catch (error) {
            console.warn('Failed to load from localStorage:', error)
            return null
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value))
          } catch (error) {
            console.warn('Failed to save to localStorage:', error)
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name)
          } catch (error) {
            console.warn('Failed to remove from localStorage:', error)
          }
        }
      },
      // 版本控制，用于数据迁移
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // 从版本0迁移到版本1的逻辑
          return {
            ...(persistedState as Record<string, unknown>),
            currentDocument: null,
            isEditMode: false,
            editorContent: ''
          }
        }
        return persistedState
      }
    }
  )
 )
)

// 添加状态变化监听器，实现自动缓存
useAppStore.subscribe(
  (state) => ({
    documents: state.documents,
    currentDocument: state.currentDocument,
    theme: state.theme,
    isEditMode: state.isEditMode,
    editorContent: state.editorContent,
    isSidebarOpen: state.isSidebarOpen
  }),
  (state) => {
    // 自动保存状态到缓存
    cacheManager.saveAppState(state)
  },
  {
    // 防抖，避免频繁保存
    fireImmediately: false
  }
)

// 应用启动时恢复状态
const restoreAppState = () => {
  if (cacheManager.hasCache()) {
    const cachedState = cacheManager.restoreAppState()
    const store = useAppStore.getState()
    
    // 恢复文档列表
    if (cachedState.documents && cachedState.documents.length > 0) {
      store.setDocuments(cachedState.documents)
    }
    
    // 恢复当前文档
    if (cachedState.currentDocument) {
      store.setCurrentDocument(cachedState.currentDocument)
    }
    
    // 恢复主题
    if (cachedState.theme) {
      store.setTheme(cachedState.theme)
    }
    
    // 恢复编辑模式
    if (cachedState.isEditMode !== undefined) {
      store.setEditMode(cachedState.isEditMode)
    }
    
    // 恢复编辑内容
    if (cachedState.editorContent) {
      store.setEditorContent(cachedState.editorContent)
    }
    
    // 恢复侧边栏状态
    if (cachedState.isSidebarOpen !== undefined) {
      store.setSidebarOpen(cachedState.isSidebarOpen)
    }
    
    console.log('App state restored from cache')
  }
}

// 导出恢复函数
export { restoreAppState }