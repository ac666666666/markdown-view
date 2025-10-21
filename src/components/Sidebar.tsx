import React from 'react'
import { FileText, Trash2 } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import type { MarkdownFile } from '../types'

const Sidebar: React.FC = () => {
  const {
    documents,
    currentDocument,
    setCurrentDocument,
    deleteDocument
  } = useAppStore()

  const handleDocumentClick = (document: MarkdownFile) => {
    setCurrentDocument(document)
  }

  const handleDeleteDocument = (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation()
    if (confirm('确定要删除这个文档吗？')) {
      deleteDocument(documentId)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return '今天'
    } else if (diffDays === 2) {
      return '昨天'
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  return (
    <aside className="h-full w-full">
      {/* 侧边栏头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          文档列表
        </h2>
      </div>

        {/* 文档统计 */}
        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          共 {documents.length} 个文档
        </div>

        {/* 文档列表 */}
        <div className="flex-1 overflow-y-auto">
          {documents.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无文档</p>
              <p className="text-sm mt-1">点击上传按钮添加文档</p>
            </div>
          ) : (
            <div className="p-4 pl-6">
              {documents.map((document) => (
                <div
                  key={document.id}
                  onClick={() => handleDocumentClick(document)}
                  className={`
                    group relative p-4 mb-3 rounded-lg cursor-pointer transition-all duration-200
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    ${currentDocument?.id === document.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'border border-transparent'
                    }
                  `}
                >
                  {/* 文档信息 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        font-medium truncate
                        ${currentDocument?.id === document.id 
                          ? 'text-blue-900 dark:text-blue-100' 
                          : 'text-gray-900 dark:text-white'
                        }
                      `}>
                        {document.title}.md
                      </h3>
                      
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>{formatDate(document.updatedAt)}</span>
                          {document.size > 0 && (
                            <span>{formatFileSize(document.size)}</span>
                          )}
                        </div>
                        
                        {/* 内容预览 */}
                        <p className="line-clamp-2 text-xs leading-relaxed">
                          {document.content.slice(0, 100).replace(/[#*`]/g, '')}...
                        </p>
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={(e) => handleDeleteDocument(e, document.id)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-all duration-200"
                      title="删除文档"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 选中指示器 */}
                  {currentDocument?.id === document.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      {/* 侧边栏底部信息 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>MD预览器 v1.0</p>
        <p>支持 .md、.markdown、.txt 格式</p>
      </div>
    </aside>
  )
}

export default Sidebar