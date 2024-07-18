import { create } from 'zustand'

export type OverviewData = {
  numTransactions: number
  numUniqueAccounts: number
  numUniqueBanks: number
  mostUsedCurrency: string
  mostUsedFormat: string
  topAccountsTransactions: any
  topAccountsAmount: any
  numTransactionsDaily: any
}

type OverviewStore = {
  overviewData?: OverviewData
  setOverviewData: (overview?: OverviewData) => void
}

export const useOverviewStore = create<OverviewStore>((set) => ({
  setOverviewData: (overview) => set({ overviewData: overview })
}))
