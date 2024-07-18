import { Button } from '@/components/ui/button'
import { transformEdgesArray } from '../_react-flow/utils'
import { useCanvasStore } from '../_react-flow/canvas-store'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { MotifResultDialog } from './results-dialog'
import { useAppStore } from '@/store/app-store'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import BanksFilterCard from './filter-cards/banks-filter-card'
import UserFilterCard from './filter-cards/user-filter-card'
import TimePeriodFilterCard from './filter-cards/time-filter-card'
import { useFiltersStore } from '../filters-store'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { getCurrentTimeString } from '@/lib/utils'

export default function Sidebar() {
  const { activeDataset, setIsTaskRunning } = useAppStore()
  const { edges, setMotifsFound, setMotifsAccountMapping } = useCanvasStore()
  const [loading, setLoading] = useState(false)
  const [openResultsDialog, setOpenResultsDialog] = useState(false)
  const savedFilters = useFiltersStore()
  const { toast } = useToast()

  const handleStartAnalysisBtn = async () => {
    setLoading(true)
    setIsTaskRunning('Finding Motifs')
    const transformedEdges = transformEdgesArray(edges)

    toast({
      title: 'Running Motif Analysis',
      description: `Task Started at ${getCurrentTimeString()}`,
      action: (
        <div className="flex gap-2">
          <Loader2 className="mr-2 size-6 animate-spin" />
        </div>
      )
    })

    const filters = {
      numberOfTransSeq: savedFilters.numTransSeq,
      numTransRandom: '',
      minTrans: savedFilters.minTrans,
      maxTrans: savedFilters.maxTrans,
      startDate: savedFilters.startDate,
      endDate: savedFilters.endDate,
      accounts: savedFilters.accounts
        .filter((item) => item !== '')
        .map((account) => ({ [account]: 'sender' })),
      banks: savedFilters.banks
        .filter((item) => item !== '')
        .map((account) => ({ [account]: 'sender' }))
    }

    // Calling python function
    const motifResults = await window.api.runMotifAnalysis(transformedEdges, filters)
    const motifsFound = motifResults[0]

    // Checking if error occured, cus python returns string
    if (typeof motifsFound === 'string') {
      console.log('Error:', motifsFound)
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong 😪',
        description: motifsFound
      })
    } else {
      setMotifsFound(motifsFound)
      setMotifsAccountMapping(motifResults[1])
      if (motifsFound.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! No Motifs were found 😪',
          description: 'Please try a different motif.'
        })
      } else {
        setOpenResultsDialog(true)
      }
    }
    setLoading(false)
    setIsTaskRunning(false)
  }

  return (
    <div className="flex flex-col py-5 gap-4">
      <div className="flex flex-col gap-2 px-5 w-full">
        <Button disabled={loading || !activeDataset} onClick={handleStartAnalysisBtn}>
          <div className="flex gap-2 items-center">
            <Loader2 className={`size-5 animate-spin ${loading ? 'block' : 'hidden'} `} />
            <div className="text-slate-100 ">
              {loading ? 'Running Analysis' : 'Start Analaysis'}
            </div>
          </div>
        </Button>

        <MotifResultDialog open={openResultsDialog} setOpen={setOpenResultsDialog} />

        <div>
          <div className="text-sm font-medium text-muted-foreground">Apply Filters</div>
        </div>
      </div>

      <ScrollArea className={'w-full px-4 select-none'}>
        <div className="flex flex-col gap-4 px-[1px]">
          <div className="flex flex-col gap-4 ">
            {dialogFilters.map((value, index) => (
              <FilterDialog
                key={index}
                triggerText={value.triggerText}
                dialogTitle={value.dialogTitle}
                dialogDescription={value.dialogDescription}
                card={value.card}
              />
            ))}

            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-slate-500">Minimum Transaction Amount</div>
                <Input
                  type="number"
                  placeholder="Minimum Amount"
                  value={savedFilters.minTrans ? savedFilters.minTrans : ''}
                  onChange={(e) => savedFilters.setMinTrans(e.target.value.toString())}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs text-slate-500">Maximum Transaction Amount</div>
                <Input
                  type="number"
                  placeholder="Maximum Amount"
                  value={savedFilters.maxTrans ? savedFilters.maxTrans : ''}
                  onChange={(e) => savedFilters.setMaxTrans(e.target.value.toString())}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-xs text-slate-500">Number Transaction Sequential</div>
                <Input
                  type="number"
                  placeholder="Sequential Transactions"
                  value={savedFilters.numTransSeq ? savedFilters.numTransSeq : ''}
                  onChange={(e) => savedFilters.setNumTransSeq(e.target.value.toString())}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

type FilterDialogProps = {
  triggerText: string
  dialogTitle: string
  dialogDescription: string
  card: JSX.Element
}

function FilterDialog({ triggerText, dialogDescription, dialogTitle, card }: FilterDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-normal text-slate-800">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        {card}
      </DialogContent>
    </Dialog>
  )
}

const dialogFilters = [
  {
    triggerText: 'Select Banks',
    dialogTitle: 'Select Banks',
    dialogDescription: 'Select the banks you want to filter by.',
    card: <BanksFilterCard />
  },
  {
    triggerText: 'Select Accounts',
    dialogTitle: 'Select Accounts',
    dialogDescription: 'Select the accounts you want to filter by.',
    card: <UserFilterCard />
  },
  {
    triggerText: 'Time Period',
    dialogTitle: 'Time Period',
    dialogDescription: 'Select the time period you want to filter by.',
    card: <TimePeriodFilterCard />
  }
]
