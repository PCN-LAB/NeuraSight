import { create } from 'zustand'

export type Dataset = {
  label: string
  path: string
}

export type TaskNotification = {
  title: string
  msgType: string // Success, Failed, Warning
  msg: string
  time: string
}

// export type BackendTasks =
//   | 'open-file-dialog'
//   | 'read-csv'
//   | 'py-overview'
//   | 'py-overview-runForecasting'
//   | 'py-motif-runAnalysis'
//   | 'py-motif-getNeighbours'

type AppStore = {
  activeTab: number
  activeDataset?: Dataset
  showIntroDialog: boolean
  notifications: TaskNotification[]
  isTaskRunning: string | boolean

  setActiveDataset: (dataset?: Dataset) => void
  setActiveTab: (tab: number) => void
  setShowIntroDialog: (show: boolean) => void

  addNotification: (notification: TaskNotification) => void
  clearNotifications: () => void
  setIsTaskRunning: (isRunning: string | boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 0,
  showIntroDialog: true,
  notifications: [],
  isTaskRunning: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveDataset: (dataset) => set({ activeDataset: dataset }),
  setShowIntroDialog: (show) => set({ showIntroDialog: show }),
  setNotifications: (notifications) => set({ notifications: notifications }),

  // Handling notifications
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  clearNotifications: () => set(() => ({ notifications: [] })),
  setIsTaskRunning: (isRunning) => set({ isTaskRunning: isRunning })
}))

// WIP: Create better api to handle backend tasks and show toast notifications 
// startBackendTask('runMotifAnalysis', [edges, filters])

// .then(() => {
//   set((state) => ({
//     notifications: [
//       ...state.notifications,
//       {
//         title: 'Task Completed',
//         msgType: 'Success',
//         msg: 'Task has been completed successfully',
//         time: new Date().toLocaleTimeString()
//       }
//     ]
//   }))
// })
// .catch(() => {
//   set((state) => ({
//     notifications: [
//       ...state.notifications,
//       {
//         title: 'Task Failed',
//         msgType: 'Failed',
//         msg: 'Task has failed to complete',
//         time: new Date().toLocaleTimeString()
//       }
//     ]
//   }))
// })

// type BackendTaskOptions =
//   | { name: 'open-file-dialog'; args?: undefined }
//   | { name: 'py-overview'; args?: undefined }
//   | {
//       name: 'read-csv'
//       args: { path: string }
//     }
//   | {
//       name: 'py-overview-runForecasting'
//       args: { filters: object }
//     }
//   | {
//       name: 'py-motif-runAnalysis'
//       args: { edges: []; filters: object }
//     }
//   | {
//       name: 'py-motif-getNeighbours'
//       args: { graph: object }
//     }
