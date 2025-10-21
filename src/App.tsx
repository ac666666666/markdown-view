import React, { useEffect } from 'react'
import { useAppStore } from './stores/useAppStore'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import './App.css'

function App() {
  const { theme, isSidebarOpen, setTheme } = useAppStore()

  // 应用主题到document
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'eye-care')
    root.classList.add(theme)
    
    // 设置主题色彩变量
    if (theme === 'eye-care') {
      root.style.setProperty('--bg-primary', '#f7f5f3')
      root.style.setProperty('--bg-secondary', '#f0ede8')
      root.style.setProperty('--text-primary', '#5d4e37')
      root.style.setProperty('--text-secondary', '#8b7355')
    } else {
      root.style.removeProperty('--bg-primary')
      root.style.removeProperty('--bg-secondary')
      root.style.removeProperty('--text-primary')
      root.style.removeProperty('--text-secondary')
    }
  }, [theme])

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'light' || theme === 'dark') {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, setTheme])

  return (
    <div className={`min-h-screen flex flex-col ${theme} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Header */}
      <Header />
      
      {/* 主体布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 只在桌面端显示 */}
        <div className="hidden lg:block lg:w-80 xl:w-84 lg:ml-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>

        {/* 右侧主内容区 */}
        <div className="flex-1 flex flex-col min-w-0">
          <MainContent />
        </div>
      </div>
    </div>
  )
}

export default App
