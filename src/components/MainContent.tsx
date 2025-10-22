import React, { useEffect, useCallback, useRef } from "react";
import { Edit3, Save, Eye, FileText, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { useAppStore } from "../stores/useAppStore";

const MainContent: React.FC = () => {
  const {
    currentDocument,
    isEditMode,
    setEditMode,
    editorContent,
    setEditorContent,
    updateDocument,
  } = useAppStore();

  // 自动保存相关状态
  const autoSaveTimerRef = useRef<number | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  // 当切换文档时，同步编辑器内容
  useEffect(() => {
    if (currentDocument && !isEditMode) {
      setEditorContent(currentDocument.content);
    }
  }, [currentDocument, isEditMode, setEditorContent]);

  // 自动保存函数（防抖）
  const autoSave = useCallback(() => {
    if (currentDocument && isEditMode && editorContent !== currentDocument.content) {
      setIsSaving(true);
      
      // 模拟保存延迟
      setTimeout(() => {
        updateDocument(currentDocument.id, { 
          content: editorContent,
          updatedAt: new Date().toISOString()
        });
        setIsSaving(false);
        setLastSaved(new Date());
      }, 300);
    }
  }, [currentDocument, isEditMode, editorContent, updateDocument]);

  // 编辑内容变化时触发自动保存
  useEffect(() => {
    if (isEditMode && currentDocument) {
      // 清除之前的定时器
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // 设置新的自动保存定时器（2秒防抖）
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 2000);
    }

    // 清理函数
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [editorContent, isEditMode, currentDocument, autoSave]);

  const handleEditToggle = () => {
    if (isEditMode) {
      // 保存模式：保存内容并切换到预览模式
      if (currentDocument) {
        updateDocument(currentDocument.id, { content: editorContent });
      }
      setEditMode(false);
    } else {
      // 编辑模式：切换到编辑模式
      setEditMode(true);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
  };

  // 下载功能
  const handleDownload = () => {
    if (!currentDocument) return;
    
    // 获取当前内容（如果在编辑模式，使用编辑器内容；否则使用文档内容）
    const content = isEditMode ? editorContent : currentDocument.content;
    
    // 创建 Blob 对象
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // 设置文件名
    const fileName = `${currentDocument.title}.md`;
    link.download = fileName;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 如果没有选中文档，显示欢迎界面
  if (!currentDocument) {
    return (
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="text-center max-w-md">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              欢迎使用 MD预览器
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm lg:text-base">
              <span className="hidden lg:inline">选择左侧的文档开始预览，或者</span>
              <span className="lg:hidden">点击右上角文档按钮选择文档，或者</span>
              上传新的 Markdown 文件
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-500">
              <p>✨ 支持实时编辑和预览</p>
              <p>🎨 多种主题模式切换</p>
              <p>📱 完美适配移动端</p>
              <p>🔧 支持 GitHub 风格 Markdown</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* 操作栏 */}
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <h1 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate ml-2 lg:ml-4">
              {currentDocument.title}.md
            </h1>
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
              {isEditMode ? "编辑模式" : "预览模式"}
            </span>
            {isEditMode && (
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                {isSaving ? (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span>保存中...</span>
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>已保存 {lastSaved.toLocaleTimeString()}</span>
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleEditToggle}
            className={`
              flex items-center space-x-1 lg:space-x-2 px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg font-medium transition-colors duration-200 flex-shrink-0 text-sm lg:text-base
              ${
                isEditMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }
            `}
          >
            {isEditMode ? (
              <>
                <Save className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">保存</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">编辑</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 lg:space-x-2 px-2 py-1.5 lg:px-4 lg:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 flex-shrink-0 text-sm lg:text-base"
            title="下载文档"
          >
            <Download className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">下载</span>
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        {isEditMode ? (
          /* 编辑模式 */
          <div className="h-full p-3 lg:p-4">
            <textarea
              value={editorContent}
              onChange={handleContentChange}
              className="w-full h-full p-3 lg:p-4 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm leading-relaxed"
              placeholder="在这里编写 Markdown 内容..."
              spellCheck={false}
            />
          </div>
        ) : (
          /* 预览模式 */
          <div className="h-full overflow-y-auto">
            <div className="max-w-none p-4 lg:p-6 xl:p-8">
              <article className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
                  rehypePlugins={[
                    rehypeHighlight,
                    rehypeRaw,
                    rehypeKatex,
                    rehypeSlug,
                  ]}
                  components={{
                    // 自定义代码块样式
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <pre className="hljs rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // 自定义表格样式
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          {children}
                        </table>
                      </div>
                    ),
                    // 自定义链接样式
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {children}
                      </a>
                    ),
                    // 自定义图片样式
                    img: ({ src, alt }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="max-w-full h-auto rounded-lg shadow-sm"
                        loading="lazy"
                      />
                    ),
                  }}
                >
                  {currentDocument.content}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="flex items-center justify-between px-3 lg:px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2 lg:space-x-4 overflow-hidden">
          <span className="whitespace-nowrap">字符: {currentDocument.content.length}</span>
          <span className="hidden sm:inline whitespace-nowrap">行数: {currentDocument.content.split("\n").length}</span>
          <span className="hidden md:inline whitespace-nowrap">
            字数:{" "}
            {
              currentDocument.content
                .replace(/[^\u4e00-\u9fa5\w]/g, " ")
                .split(/\s+/)
                .filter((w) => w.length > 0).length
            }
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {isEditMode ? (
            <span className="flex items-center">
              <Edit3 className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">编辑中</span>
            </span>
          ) : (
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">预览中</span>
            </span>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
