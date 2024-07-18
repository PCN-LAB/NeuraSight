import { useAppStore } from '@/store/app-store'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { parseFilePath } from '@/lib/utils'

export const Step2 = ({ setIndex }: { setIndex: (index: number) => void }) => {
  const { activeDataset, setActiveDataset } = useAppStore()
  const [validDataset, setValidDataset] = useState(false)
  const [datasetExt, setDatasetExt] = useState('')

  const handleBrowseBtn = async () => {
    // @ts-ignore known bug
    const _path = await window.api.openFileDialog()
    const { fileName, extension } = parseFilePath(_path)
    setDatasetExt(extension)

    if (extension !== 'csv') {
      setValidDataset(false)
      return
    }

    setActiveDataset({ label: fileName, path: _path })
    setValidDataset(true)
  }

  return (
    <div className="animate-fade-in w-[75%] flex flex-col items-center gap-10">
      <p className="text-white text-3xl">
        Let&apos;s start by uploading your{'  '}
        <span className="underline underline-offset-[7px] text-3xl">dataset</span>
        first.
      </p>

      <p className="text-sm text-zinc-400 text-center">
        Please ensure that your dataset is in a compatible format (e.g., CSV, Excel) and contains
        the necessary transactional information.
      </p>

      <Button
        className="-mt-4 w-32 font-normal bg-emerald-800 text-white hover:bg-emerald-950"
        onClick={handleBrowseBtn}
      >
        Browse Dataset
      </Button>

      {!validDataset && datasetExt !== '' && (
        <div className="text-red-500">
          Please provide a valid dataset. We only support
          <span className="font-bold"> CSV </span>
          and
          <span className="font-bold"> XLXS </span>
          formats for now.
        </div>
      )}

      {validDataset && (
        <div className="animate-fade-in flex flex-col gap-1 items-center">
          <div className="text-yellow-50">
            <span className="text-rose-500">File:</span> {activeDataset!.label}
          </div>
          <div className=" text-yellow-50">
            <span className="text-rose-500">Path:</span> {activeDataset!.path}
          </div>
        </div>
      )}

      {validDataset && (
        <Button
          className="animate-fade-in w-32 justify-self-center bg-slate-100 text-slate-900 hover:bg-slate-400"
          onClick={async () => {
            setIndex(2)
          }}
        >
          Continue
        </Button>
      )}
    </div>
  )
}
