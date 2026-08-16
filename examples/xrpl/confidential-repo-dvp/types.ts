export type Wallet = {
  name: string
  id: string
  address: string
}

export type HolderBalance = {
  mmfPublic: number
  mmfConfidentialSpendable: number
  mmfConfidentialInbox: number
  bMMFConfidential: boolean
  rlusdPublic: number
  rlusdConfidentialSpendable: number
  rlusdConfidentialInbox: number
  bRLUSDConfidential: boolean
}

export type Balances = {
  sellerBalances: HolderBalance
  buyerBalances: HolderBalance
}
