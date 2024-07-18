import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAppStore } from '@/store/app-store'
import { useState } from 'react'
import { Step1 } from './step-1'
import { Step2 } from './step-2'
import { Step3 } from './step-3'
import { Step4 } from './step-4'

export function IntroDialog() {
  const { showIntroDialog, setShowIntroDialog } = useAppStore()
  const [currStep, setCurrStep] = useState(0)

  return (
    <Dialog modal open={showIntroDialog} onOpenChange={setShowIntroDialog}>
      <DialogContent
        className="flex flex-col items-center py-16 justify-center min-w-[800px] min-h-[350px] bg-slate-950 border-none"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        {currStep === 0 && <Step1 setIndex={setCurrStep} />}
        {currStep === 1 && <Step2 setIndex={setCurrStep} />}
        {currStep === 2 && <Step3 setIndex={setCurrStep} />}
        {currStep === 3 && <Step4 setIndex={setCurrStep} />}
      </DialogContent>
    </Dialog>
  )
}
