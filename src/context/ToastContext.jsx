import { createContext, useContext, useState, useCallback } from "react"

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])

    // auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // convenience methods
  const success = useCallback((msg) => addToast(msg, "success"), [addToast])
  const error = useCallback((msg) => addToast(msg, "error"), [addToast])
  const info = useCallback((msg) => addToast(msg, "info"), [addToast])

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast container — renders all active toasts
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

// Individual toast
const Toast = ({ toast, onRemove }) => {
  const styles = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    info: "bg-blue-50 border-blue-400 text-blue-800"
  }

  const dots = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md text-sm font-medium min-w-64 max-w-sm ${styles[toast.type]}`}>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dots[toast.type]}`} />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-60 hover:opacity-100 transition duration-200 ml-2"
      >
        ✕
      </button>
    </div>
  )
}

export const useToast = () => useContext(ToastContext)