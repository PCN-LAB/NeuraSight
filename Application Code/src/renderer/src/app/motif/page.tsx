import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AllowedMotifs, predefinedMotifs } from './canvas/_predefined-motifs'
import { useCanvasStore } from './canvas/_react-flow/canvas-store'
import { getReactFlowGraphFromMinimalParams } from './canvas/_react-flow/utils'
import { Link } from 'react-router-dom'

export default function MotifPage() {
  const [motif, setMotif] = useState<AllowedMotifs>('gather-scatter')
  const { setNodes: setGNodes, setEdges: setGEdges } = useCanvasStore()

  const handleEditTemplateBtn = () => {
    setGEdges(getReactFlowGraphFromMinimalParams({ id: motif, nodeType: 'circle' }).edges)
    setGNodes(getReactFlowGraphFromMinimalParams({ id: motif, nodeType: 'circle' }).nodes)
  }

  const handleCustomTemplateBtn = () => {
    setGEdges([])
    setGNodes([])
  }

  return (
    <div className=" h-[92vh]">
      <div className="flex flex-col px-8 pt-4 overflow-hidden">
        <div className="flex flex-col gap-2 mb-16">
          <h2 className="text-3xl font-semibold text-slate-800 underline underline-offset-4">
            Motif Analysis
          </h2>
          <h3 className="text-muted-foreground">
            Modify or use existing motifs provided by NeruaSight team
          </h3>
        </div>

        {/* Column 1 (Motif Names) */}
        <div className="grid grid-cols-[65%_auto]">
          <div className="flex flex-col">
            <p className="text-slate-400 mb-4 font-semibold">
              Templates provided by NeuraSight team
            </p>
            <RadioGroup className="flex flex-wrap gap-5 h-fit" defaultValue={motif}>
              {predefinedMotifs.map((m) => (
                <div key={m.id} className="w-[200px]">
                  <RadioGroupItem
                    value={m.id}
                    id={m.id}
                    className="peer sr-only "
                    // @ts-ignore type is manually checked by me :)
                    onClick={(e) => setMotif(e.target.value)}
                  />
                  <Label
                    htmlFor={m.id}
                    className=" transition ease-in-out flex flex-col font-medium gap-2 items-center rounded-md border-2 border-slate-300 bg-slate-50 p-4 hover:bg-slate-200  hover:text-accent-foreground peer-data-[state=checked]:border-slate-400 [&:has([data-state=checked])]:border-primary  peer-data-[state=checked]:bg-slate-100 hover:cursor-pointer"
                  >
                    <p className="text-md text-slate-600 select-none">{m.name}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <p className="text-slate-400  mt-10 font-semibold">Motifs saved by user</p>
            <p>
              No saved motifs found. You can save motifs from the editor and re-use them later from
              here.
            </p>

            <div className="flex  gap-5 mt-36">
              <Button
                asChild
                className="mt-5 w-44"
                disabled={!motif}
                onClick={handleEditTemplateBtn}
              >
                <Link to={'/motif/canvas'}>Edit Template</Link>
              </Button>

              <Button
                asChild
                variant={'secondary'}
                className="mt-5 w-44 bg-slate-500 text-white hover:bg-slate-700"
                onClick={handleCustomTemplateBtn}
              >
                <Link to={'/motif/canvas'}>Start from Scratch</Link>
              </Button>
            </div>
          </div>

          {/* Column 2 (Motif Image) */}
          <div className="">
            <div className="flex h-72 p-8 items items-center justify-center border border-dashed  border-slate-400 rounded-3xl shadow-sm select-none">
              <img
                src={predefinedMotifs.find((m) => m.id === motif)?.icon}
                alt={'Pattern Visulization'}
                className="rounded-full object-cover h-full "
              />
            </div>

            <div className="mt-5 text-slate-600 text-center">
              {predefinedMotifs.find((m) => m.id === motif)?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
