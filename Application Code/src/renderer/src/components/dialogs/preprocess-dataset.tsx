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
import { useAppStore } from '@/store/app-store'
import { useEffect, useState } from 'react'
import { RiFolderUploadLine } from 'react-icons/ri'
import { Table, TableBody, TableCell, TableHead, TableHeader } from '../ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

type PreProcessDatasetDialogProps = {
  setDatasetSwitcherState: (state: boolean) => void
}

export function PreProcessDatasetDialog({ setDatasetSwitcherState }: PreProcessDatasetDialogProps) {
  const { activeDataset } = useAppStore()
  const [open, setOpen] = useState(false)
  const [datasetFeatures, setDatasetFeatures] = useState<string[]>([])

  useEffect(() => {
    if (!activeDataset) return

    const readCsv = async () => {
      try {
        const _datasetRows: [] = await window.api.readCsv(activeDataset?.path)

        const features: string[] = []
        Object.keys(_datasetRows[0]).map((feature) => {
          features.push(feature)
        })

        // TODO Remove this before pushing to prod
        features.pop() // Remove the last column which is the target column
        setDatasetFeatures(features)
      } catch (error) {
        console.error('Error reading CSV:', error)
      }
    }

    readCsv()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={!activeDataset}
          className=" flex gap-4 bg-slate-600 w-full font-medium  text-white hover:bg-slate-800 hover:text-white  "
        >
          PreProcess
          <RiFolderUploadLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>PreProcess Dataset</DialogTitle>
          <DialogDescription>
            Preprocess your dataset so that it can be used for analysis..
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 ">
          <div className="">We have detected the following features from your dataset.</div>
          <Table className="w-full">
            <TableHeader className="bg-slate-200 w-[600px]">
              {datasetFeatures.map((head, index) => (
                <TableHead key={index}>{head}</TableHead>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: datasetFeatures.length }).map((_, index) => (
                <TableCell key={index}>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {allowedFeatures.map((feature) => (
                          <SelectItem key={feature} value={feature} className="text-left -ml-3">
                            {feature}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            // disabled={!datasetPath}
            // onClick={() => {
            //   const newDataset = {
            //     label: (document.getElementById('name') as HTMLInputElement)?.value,
            //     path: datasetPath
            //   }

            //   // Update in global store
            //   // setActiveDataset(newDataset)

            //   // Store in local storage to show in 'recently used' section of dropdown
            //   const pathsStr = localStorage.getItem('dataset-paths')
            //   const paths = pathsStr ? JSON.parse(pathsStr) : []
            //   paths.push(newDataset)
            //   localStorage.setItem('dataset-paths', JSON.stringify(paths))

            //   setOpen(false)
            //   setDatasetSwitcherState(false) // Close the 'combobox'
            // }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const allowedFeatures = [
  'Timestamp',
  'Sender Account',
  'Receiver Account',
  'Amount',
  'Transaction Type',
  'Payment Type',
  'Payment Format'
]
