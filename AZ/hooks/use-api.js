"use client"

import { useState, useCallback } from "react"

/**
 * Custom hook for making API calls with loading and error states
 */
export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Execute an API call with loading and error handling
   */
  const execute = useCallback(async (apiCall, ...args) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiCall(...args)
      return result
    } catch (err) {
      setError(err.message || "An error occurred")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { execute, isLoading, error }
}
