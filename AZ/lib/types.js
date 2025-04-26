/**
 * Type definitions for the application
 */

// Address type matching the backend model
export type Address = {
  country: string
  state: string
  streetAddress: string
}

// Service/Certificate type matching the backend model
export type Service = {
  id?: number
  name: string
  s_N: string // Serial Number
  method: string
  startDate: string
  endDate: string
  location: Address
}

// DTO for creating/updating a service
export type ServiceDto = {
  name: string
  s_N: string
  method: string
  startDate: string
  endDate: string
  location: Address
}
