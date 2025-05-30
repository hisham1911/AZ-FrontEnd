"use client"

import { createContext, useContext, useState } from "react"

const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, duration }])

    if (duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  const dismiss = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
