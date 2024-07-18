import { create } from 'zustand'

type ConfusionMatrix = {
  TP: number
  FP: number
  FN: number
  TN: number
}

export type Models = 'GIN' | 'PNA' | 'GAT' | 'RGCN'

export type GNNAttributes = 'EP' | 'RMP' | 'EICD' | 'PNE'

type GNNStore = {
  attributes: GNNAttributes[]
  model: Models
  isLoading?: boolean
  accuracy?: number
  precision?: number
  recall?: number
  f1Score?: number
  confusionMatrix: ConfusionMatrix
  totalTransactions: number
  fradulentTransactions: number

  setModel: (model: Models) => void
  setAttributes: (attributes: GNNAttributes[]) => void
  setIsLoading: (isLoading?: boolean) => void
  setAccuracy: (accuracy?: number) => void
  setPrecision: (precision?: number) => void
  setRecall: (recall?: number) => void
  setF1Score: (f1Score?: number) => void
  setConfusionMatrix: (confusionMatrix: ConfusionMatrix) => void
  setTotalTransactions: (totalTransactions: number) => void
  setFradulentTransactions: (fradulentTransactions: number) => void
}

export const useGNNStore = create<GNNStore>((set) => ({
  isLoading: false,
  accuracy: 0,
  precision: 0,
  recall: 0,
  f1Score: 0,
  confusionMatrix: { TP: 0, FP: 0, FN: 0, TN: 0 },
  model: 'GIN',
  attributes: ['EP'],
  totalTransactions: 0,
  fradulentTransactions: 0,

  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
  setAccuracy: (accuracy) => set({ accuracy: accuracy }),
  setPrecision: (precision) => set({ precision: precision }),
  setRecall: (recall) => set({ recall: recall }),
  setF1Score: (f1Score) => set({ f1Score: f1Score }),
  setConfusionMatrix: (confusionMatrix) => set({ confusionMatrix: confusionMatrix }),
  setModel: (model) => set({ model: model }),
  setAttributes: (attributes) => set({ attributes: attributes }),
  setTotalTransactions: (totalTransactions) => set({ totalTransactions: totalTransactions }),
  setFradulentTransactions: (fradulentTransactions) => set({ fradulentTransactions: fradulentTransactions })
}))
