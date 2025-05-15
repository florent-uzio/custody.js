export interface Domain {
  id: string
  name: string
  // ... other domain properties
}

export interface GetDomainsParams {
  limit?: number
  offset?: number
}
