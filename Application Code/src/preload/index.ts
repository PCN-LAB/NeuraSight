import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  readCsv: (path: string) => ipcRenderer.invoke('native:readCsv', path),
  updateDatasetPath: (path: string) => ipcRenderer.invoke('native:updateDatasetPath', path),
  runMotifAnalysis: (edges: [], filters) => ipcRenderer.invoke('motif:start', edges, filters),
  runTimeSeriesForecasting: (filters) => ipcRenderer.invoke('timeseries:forecasting', filters),
  findNeighbours: (graph) => ipcRenderer.invoke('motif:find-neighbours', graph),
  runOverview: () => ipcRenderer.invoke('overview:start')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
