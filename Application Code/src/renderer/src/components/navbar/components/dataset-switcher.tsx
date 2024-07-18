import { PreProcessDatasetDialog } from '@/components/dialogs/preprocess-dataset'
import { UploadDatasetDialog } from '@/components/dialogs/upload-dataset'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dataset, useAppStore } from '@/store/app-store'
import { CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

const getRecentlyUsedDatasets = () => {
  const recentlyUsedStr = localStorage.getItem('dataset-paths')
  const recentlyUsed = recentlyUsedStr ? JSON.parse(recentlyUsedStr) : []
  if (!recentlyUsed) return []
  return recentlyUsed
}

export default function DatasetSwitcher() {
  const [open, setOpen] = useState(false)
  const [openPreProcessDialog, setOpenPreProcessDialog] = useState(false)
  const { activeDataset, setActiveDataset } = useAppStore()

  if (getRecentlyUsedDatasets().length === 0 && !activeDataset)
    return (
      <div className="w-52">
        <UploadDatasetDialog setDatasetSwitcherState={setOpen} />
      </div>
    )

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild className="flex gap-3">
        <Button
          variant="outline"
          className="w-fit px-3 max-w-[240px] bg-slate-600 text-white tracking-wider hover:bg-slate-800 hover:text-white"
        >
          {activeDataset?.label || 'Select Dataset'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 ml-4">
        {activeDataset && (
          <>
            <DropdownMenuLabel>Active</DropdownMenuLabel>
            <DropdownMenuItem className="flex justify-between py-1 -mt-1">
              {activeDataset.label}
              <CheckIcon className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </>
        )}

        {getRecentlyUsedDatasets().length > 0 && (
          <>
            <DropdownMenuLabel className="mt-1">
              <div className="flex justify-between align-baseline">
                <div>Recently Used</div>
                <Button
                  variant={'link'}
                  className="text-xs text-muted-foreground size-0"
                  onClick={async () => {
                    localStorage.removeItem('dataset-paths')
                    setActiveDataset(undefined)
                    setOpen(false)
                    await window.api.updateDatasetPath('')
                  }}
                >
                  Clear
                </Button>
              </div>
            </DropdownMenuLabel>
            {getRecentlyUsedDatasets().map((dataset: Dataset) => (
              <DropdownMenuItem
                key={dataset.path}
                className="py-1 -mt-1"
                disabled={activeDataset?.label === dataset.label}
                onClick={async () => {
                  setActiveDataset(dataset)
                  setOpen(false)
                  await window.api.updateDatasetPath(dataset.path)
                }}
              >
                {dataset.label}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {getRecentlyUsedDatasets().length > 0 && <DropdownMenuSeparator />}

        <UploadDatasetDialog setDatasetSwitcherState={setOpen} />
        {getRecentlyUsedDatasets().length > 0 && <DropdownMenuSeparator />}
        <PreProcessDatasetDialog setDatasetSwitcherState={setOpenPreProcessDialog} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
