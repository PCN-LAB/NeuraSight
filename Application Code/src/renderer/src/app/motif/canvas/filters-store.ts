import { create } from 'zustand'

export type Plot = {
  'class-distribution'?: object
  'anomalies-by-payment-format'?: object
  'anomalies-against-time'?: object
  'top-fradulent-accounts'?: object
}

type FiltersStore = {
  prevHourly: object
  predictedHourly: object
  prevDaily: object
  predictedDaily: object

  startDate: string
  endDate: string
  accounts: string[]
  banks: string[]
  plots: Plot

  // Adding these for motif filters
  numTransSeq: string
  minTrans: string
  maxTrans: string

  setStartDate: (startDate: string) => void
  setEndDate: (endDate: string) => void
  setAccounts: (accounts: string[]) => void
  setBanks: (banks: string[]) => void
  setPlots: (plots: Plot) => void

  // Adding these for motif filters
  setNumTransSeq: (numTransSeq: string) => void
  setMinTrans: (minTrans: string) => void
  setMaxTrans: (maxTrans: string) => void

  setPrevHourly: (prevHourly: object) => void
  setPredictedHourly: (predictedHourly: object) => void
  setPrevDaily: (prevDaily: object) => void
  setPredictedDaily: (predictedDaily: object) => void
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  startDate: '',
  endDate: '',
  accounts: ['', '', ''],
  banks: ['', '', ''],
  plots: {
    'class-distribution': {},
    'anomalies-by-payment-format': {},
    'anomalies-against-time': {},
    'top-fradulent-accounts': {}
  },

  prevHourly: {},
  predictedHourly: {},
  prevDaily: {},
  predictedDaily: {},

  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setAccounts: (accounts) => set({ accounts }),
  setBanks: (banks) => set({ banks }),
  setPlots: (plots) => set({ plots }),

  // Adding these for motif filters
  maxTrans: '',
  minTrans: '',
  numTransSeq: '1000',
  setMinTrans: (minTrans) => set({ minTrans }),
  setMaxTrans: (maxTrans) => set({ maxTrans }),
  setNumTransSeq: (numTransSeq) => set({ numTransSeq }),

  setPrevHourly: (prevHourly) => set({ prevHourly }),
  setPredictedHourly: (predictedHourly) => set({ predictedHourly }),
  setPrevDaily: (prevDaily) => set({ prevDaily }),
  setPredictedDaily: (predictedDaily) => set({ predictedDaily })
}))
