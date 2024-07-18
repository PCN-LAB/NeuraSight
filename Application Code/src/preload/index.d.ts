import { ElectronAPI } from '@electron-toolkit/preload'

type

declare global {
  interface Window {
    electron: ElectronAPI
    api: any
  }
}
