import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'

// Markdown处理工具
export class MarkdownProcessor {
  private processor: any

  constructor() {
    this.processor = remark()
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkBreaks)
  }

  // 解析Markdown文本
  async parse(content: string) {
    try {
      const result = await this.processor.process(content)
      return result.toString()
    } catch (error) {
      console.error('Markdown解析错误:', error)
      return content
    }
  }

  // 提取Markdown标题
  extractHeadings(content: string) {
    const headings: Array<{ level: number; text: string; id: string }> = []
    const lines = content.split('\n')
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        
        headings.push({ level, text, id })
      }
    })
    
    return headings
  }

  // 统计Markdown内容
  getStats(content: string) {
    const lines = content.split('\n').length
    const words = content.replace(/[^\u4e00-\u9fa5\w]/g, ' ').split(/\s+/).filter(w => w.length > 0).length
    const characters = content.length
    const charactersNoSpaces = content.replace(/\s/g, '').length
    
    return {
      lines,
      words,
      characters,
      charactersNoSpaces,
    }
  }

  // 生成目录
  generateTOC(content: string) {
    const headings = this.extractHeadings(content)
    
    if (headings.length === 0) return ''
    
    let toc = '## 目录\n\n'
    headings.forEach(heading => {
      const indent = '  '.repeat(heading.level - 1)
      toc += `${indent}- [${heading.text}](#${heading.id})\n`
    })
    
    return toc + '\n'
  }
}

// 文件处理工具
export const fileUtils = {
  // 读取文件内容
  readFile: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = reject
      reader.readAsText(file, 'UTF-8')
    })
  },

  // 下载文件
  downloadFile: (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.md') ? filename : `${filename}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  // 验证文件类型
  validateMarkdownFile: (file: File): boolean => {
    const validTypes = [
      'text/markdown',
      'text/x-markdown',
      'text/plain',
      'application/octet-stream'
    ]
    const validExtensions = ['.md', '.markdown', '.txt']
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  },

  // 格式化文件大小
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// 导出默认实例
export const markdownProcessor = new MarkdownProcessor()