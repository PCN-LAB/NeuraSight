import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore } from '@/store/app-store'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const Step4 = ({ setIndex }: { setIndex: (index: number) => void }) => {
  const { activeDataset, setShowIntroDialog } = useAppStore()
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
    <div className="animate-fade-in w-[75%] flex flex-col items-center gap-10">
      <p className="text-white text-xl">
        We found the following features in your dataset. Help us map these features to the
        corresponding transactional information.
      </p>

      <ScrollArea className="h-72 w-fit px-10 rounded-md border bg-white">
        <div className="flex flex-col gap-5 py-5 px-[1px]">
          <p className="text-sm text-lime-600">Features Found</p>
          {datasetFeatures.map((head, index) => (
            <div key={index} className="flex gap-10 items-center justify-between">
              <div key={index} className="w-fit text-nowrap">
                {head}
              </div>
              <Select>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {requiredFeatures.map((feature) => (
                      <SelectItem key={feature} value={feature} className="text-left">
                        {feature}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        className="animate-fade-in w-32 justify-self-center bg-slate-100 text-slate-900 hover:bg-slate-400"
        onClick={async () => {
          setShowIntroDialog(false)
        }}
      >
        Continue
      </Button>
    </div>
  )
}

const requiredFeatures = [
  'Timestamp',
  'Sender Account',
  'Receiver Account',
  'Amount Sent',
  'Sender Bank',
  'Receiver Bank',
  'Amount Received',
  'Transaction Type',
  'Payment Type',
  'Payment Format'
]
