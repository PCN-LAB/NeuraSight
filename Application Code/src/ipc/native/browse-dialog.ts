import { dialog } from 'electron'
import { setDatasetPath } from '../../main'

export default async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    setDatasetPath(filePaths[0])
    return filePaths[0]
  }
  return false
}
