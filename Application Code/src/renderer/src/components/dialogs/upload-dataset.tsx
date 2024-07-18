import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseFilePath } from '@/lib/utils'
import { Dataset, useAppStore } from '@/store/app-store'
import { useState } from 'react'
import { RiFolderUploadLine } from 'react-icons/ri'

type UploadDatasetDialogProps = {
  setDatasetSwitcherState: (state: boolean) => void
}

export function UploadDatasetDialog({ setDatasetSwitcherState }: UploadDatasetDialogProps) {
  const { setActiveDataset } = useAppStore()
  const [open, setOpen] = useState(false)
  const [dataset, setDataset] = useState<Dataset>({ path: '', label: '' })
  const [isDatasetValid, setValidDataset] = useState(false)

  const handleBrowseBtn = async () => {
    try {
      // Call backend api to open file dialog
      const _path = await window.api.openFileDialog()
      const { fileName, extension } = parseFilePath(_path)
     // We need to save this here to show error message. See line 105 
      setDataset({
        label: fileName,
        path: _path
      })

      if (extension !== 'csv') {
        setValidDataset(false)
        return
      }

      // If dataset is valid
      setValidDataset(true)
      const inputElement = document.getElementById('dataset-name-input') as HTMLInputElement | null
      if (inputElement) {
        inputElement.value = fileName
      }

      // Focus on input field and set default name as file name
      document.getElementById('dataset-name-input')?.focus()
      setDataset({
        label: (document.getElementById('dataset-name-input') as HTMLInputElement).value!,
        path: _path
      })
    } catch (error) {
      return
    }
  }

  const handleSaveBtn = async () => {
    // Store in local storage to show in 'recently used' section of dropdown
    const pathsStr = localStorage.getItem('dataset-paths')
    const paths = pathsStr ? JSON.parse(pathsStr) : []
    paths.push(dataset)
    localStorage.setItem('dataset-paths', JSON.stringify(paths))

    setOpen(false) // Close upload dialog
    setDatasetSwitcherState(false) // Close the 'combobox'

    // Call backend api to update dataset path in main.ts so scripts use updated path
    await window.api.updateDatasetPath(dataset.path)

    setActiveDataset(dataset) // Update in global store
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className=" flex gap-4 bg-slate-700 w-full font-medium  text-white hover:bg-slate-800 hover:text-white  "
        >
          Upload Dataset
          <RiFolderUploadLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Upload Dataset</DialogTitle>
          <DialogDescription>
            Browse the dataset in your local computer and enter an optional name if required.
          </DialogDescription>
        </DialogHeader>
        <div className=" ">
          <Label htmlFor="name">Name</Label>

          {/* TODO Add input validation (Same name shouldnt exist, dataset may already by present etc) */}
          <Input id="dataset-name-input" placeholder="FY 2022-2024" type="text" className="mt-1" />
          <Button className="w-fit mt-4" onClick={handleBrowseBtn}>
            Browse
          </Button>

          {!isDatasetValid && dataset.path && (
            <div className="text-red-500 text-sm mt-2">
              Please provide a valid dataset. We only support
              <span className="font-bold"> CSV </span>
              and
              <span className="font-bold"> XLXS </span>
              formats for now.
            </div>
          )}

          {isDatasetValid && (
            <div className="mt-4 text-sm">
              <div className="">
                <span className="font-medium">File Name:</span>{' '}
                <span className="text-green-700">{dataset.label}</span>
              </div>
              <div className=" ">
                <span className="font-medium">Path:</span> <span className="">{dataset.path}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button disabled={!isDatasetValid} onClick={handleSaveBtn}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
