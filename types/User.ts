export interface User {
  id: number
  email: string
  idx: string
  provider: string
  role: string
  description: string
  createdAt: Date
  updatedAt: Date
  token: string
}
