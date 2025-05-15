export interface User {
  id: string
  username: string
  // ... other user properties
}

export interface GetUsersParams {
  role?: string
  active?: boolean
}
