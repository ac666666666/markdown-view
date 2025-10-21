import React, { useRef, useState } from "react";
import { Upload, Sun, Moon, Eye, FileText, ChevronDown, AlertCircle, CheckCircle } from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import type { Theme } from "../types";

const Header: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMobileDocuments, setShowMobileDocuments] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');
  const {
    theme,
    setTheme,
    isUploading,
    setUploading,
    addDocument,
    documents,
    currentDocument,
    setCurrentDocument,
  } = useAppStore();

  const handleThemeChange = () => {
    const themes: Theme[] = ["light", "dark", "eye-care"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      case "eye-care":
        return <Eye className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "亮色模式";
      case "dark":
        return "暗色模式";
      case "eye-care":
        return "护眼模式";
      default:
        return "亮色模式";
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 重置状态
    setUploadError('');
    setUploadProgress(0);
    setUploadStatus('uploading');

    // 验证文件类型
    const validExtensions = [".md", ".markdown", ".txt"];
    const isValidFile = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidFile) {
      setUploadStatus('error');
      setUploadError("请上传 .md、.markdown 或 .txt 格式的文件");
      return;
    }

    // 验证文件大小 (限制为 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setUploadStatus('error');
      setUploadError("文件大小不能超过 50MB");
      return;
    }

    setUploading(true);

    try {
      // 使用分块读取大文件
      const content = await readFileWithProgress(file, (progress) => {
        setUploadProgress(progress);
      });

      const newDocument = {
        id: Date.now().toString(),
        title: file.name.replace(/\.(md|markdown|txt)$/i, ""),
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        size: file.size,
      };

      addDocument(newDocument);
      setUploadStatus('success');
      
      // 3秒后重置状态
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);

      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("文件读取失败:", error);
      setUploadStatus('error');
      setUploadError(error instanceof Error ? error.message : "文件读取失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  // 分块读取文件并显示进度
  const readFileWithProgress = (file: File, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        onProgress(100);
        resolve(e.target?.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error("文件读取失败"));
      };
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      };
      
      reader.readAsText(file, "UTF-8");
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 处理拖拽上传
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // 创建一个模拟的事件对象
      const mockEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  // 检测移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <header 
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Logo区域 */}
      <div className="flex items-center ml-4">
        <img
          src="/src/assets/icon.webp"
          alt="MD预览器"
          className="w-8 h-8 rounded-md"
        />
      </div>

      {/* 右侧按钮组 */}
      <div className="flex items-center space-x-3">
        {/* 文件上传按钮 */}
        <div className="relative">
          <button
            onClick={handleUploadClick}
            disabled={isUploading || uploadStatus === 'uploading'}
            className={`
              flex items-center space-x-2 rounded-lg transition-all duration-200 font-medium touch-manipulation
              ${isMobile ? 'px-3 py-2.5 text-sm' : 'px-4 py-2'}
              ${uploadStatus === 'success' 
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white' 
                : uploadStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white'
              }
            `}
            title={uploadStatus === 'error' ? uploadError : "上传文件"}
          >
            {uploadStatus === 'uploading' ? (
              <Upload className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} animate-spin`} />
            ) : uploadStatus === 'success' ? (
              <CheckCircle className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
            ) : (
              <Upload className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
            )}
            <span className={`${isMobile ? 'text-xs' : ''} hidden sm:inline`}>
              {uploadStatus === 'uploading' 
                ? `上传中 ${uploadProgress}%` 
                : uploadStatus === 'success'
                ? "上传成功"
                : uploadStatus === 'error'
                ? "上传失败"
                : "上传文件"
              }
            </span>
          </button>
          
          {/* 进度条 */}
          {uploadStatus === 'uploading' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-200 rounded-b-lg overflow-hidden">
              <div 
                className="h-full bg-blue-400 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          
          {/* 错误提示 */}
          {uploadStatus === 'error' && uploadError && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm whitespace-nowrap z-50 shadow-lg">
              {uploadError}
            </div>
          )}
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          onChange={handleFileUpload}
          className="hidden"
          multiple={false}
          capture={false}
        />

        {/* 主题切换按钮 */}
        <button
          onClick={handleThemeChange}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 font-medium"
          title={getThemeLabel()}
        >
          {getThemeIcon()}
          <span className="hidden sm:inline">{getThemeLabel()}</span>
        </button>

        {/* 移动端文档选择器 */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setShowMobileDocuments(!showMobileDocuments)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            title="选择文档"
          >
            <FileText className="w-5 h-5" />
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMobileDocuments ? 'rotate-180' : ''}`} />
          </button>

          {/* 文档下拉菜单 */}
          {showMobileDocuments && (
            <>
              {/* 遮罩层 */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowMobileDocuments(false)}
              />
              
              {/* 下拉菜单 */}
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>暂无文档</p>
                    <p className="text-sm mt-1">点击上传按钮添加文档</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {documents.map((document) => (
                      <button
                        key={document.id}
                        onClick={() => {
                          setCurrentDocument(document);
                          setShowMobileDocuments(false);
                        }}
                        className={`
                          w-full text-left p-3 rounded-lg transition-colors duration-200 mb-1
                          hover:bg-gray-50 dark:hover:bg-gray-700
                          ${currentDocument?.id === document.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                            : ''
                          }
                        `}
                      >
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {document.title}.md
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(document.updatedAt).toLocaleDateString('zh-CN')}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
