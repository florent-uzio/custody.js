export type Wallet = {
  name: string
  id: string
  address: string
}

export type HolderBalance = {
  mmfPublic: number
  mmfConfidentialSpendable: number
  mmfConfidentialInbox: number
  isMmfConfidential: boolean
  rlusdPublic: number
  rlusdConfidentialSpendable: number
  rlusdConfidentialInbox: number
  isRlusdConfidential: boolean
}

export type Balances = {
  sellerBalances: HolderBalance
  buyerBalances: HolderBalance
}
