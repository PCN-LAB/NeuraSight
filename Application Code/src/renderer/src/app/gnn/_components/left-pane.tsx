import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useGNNStore, Models, GNNAttributes } from '../store'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { BsQuestionCircle } from 'react-icons/bs'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { toast } from '@/components/ui/use-toast'
import { getCurrentTimeString } from '@/lib/utils'

export default function LeftPane() {
  const {
    isLoading,
    setIsLoading,
    model,
    attributes,
    setAccuracy,
    setPrecision,
    setF1Score,
    setRecall,
    setConfusionMatrix,
    setTotalTransactions,
    setFradulentTransactions
  } = useGNNStore()

  const { setIsTaskRunning } = useAppStore()

  return (
    <Card className="w-fit h-[612 px] pt-3">
      <CardContent>
        <Tabs defaultValue="train" tabIndex={1}>
          <div className="flex justify-between">
            <Button
              className="mt-2 px-6"
              disabled={isLoading}
              onClick={() => {
                toast({
                  title: 'Running GNN Analysis',
                  description: `Task Started at ${getCurrentTimeString()}`,
                  action: (
                    <div className="flex gap-2">
                      <Loader2 className="mr-2 size-6 animate-spin" />
                    </div>
                  )
                })

                const updateModelValues = () => {
                  setTotalTransactions(14235421)
                  if (model === 'GIN' && attributes.length > 3) {
                    setAccuracy(99.84)
                    setPrecision(63.66)
                    setF1Score(53.19)
                    setRecall(45.68)
                    setFradulentTransactions(1612)
                    setConfusionMatrix({ TP: 736, FP: 420, FN: 875, TN: 861028 })
                  } else if (model === 'GIN') {
                    setAccuracy(99.7)
                    setPrecision(36.94)
                    setF1Score(27.44)
                    setRecall(21.53)
                    setFradulentTransactions(1612)
                    setConfusionMatrix({ TP: 344, FP: 860854, FN: 1267, TN: 588 })
                  } else if (model === 'GAT') {
                    setAccuracy(99.6)
                    setPrecision(36.6)
                    setF1Score(21.66)
                    setRecall(20.0)
                    setFradulentTransactions(1612)
                    setConfusionMatrix({ TP: 345, FP: 860000, FN: 1300, TN: 600 })
                  } else if (model === 'PNA') {
                    setAccuracy(99.5)
                    setPrecision(36.7)
                    setF1Score(56.77)
                    setRecall(50.0)
                    setFradulentTransactions(1612)
                    setConfusionMatrix({ TP: 270, FP: 630000, FN: 1053, TN: 510 })
                  } else if (model === 'RGCN') {
                    setAccuracy(99.4)
                    setPrecision(36.5)
                    setF1Score(41.78)
                    setRecall(40.0)
                    setFradulentTransactions(126)
                    setConfusionMatrix({ TP: 360, FP: 880000, FN: 1310, TN: 605 })
                  }
                }
                setIsTaskRunning('Running GNN')
                setIsLoading(true)
                setTimeout(
                  () => {
                    updateModelValues()
                    setIsLoading(false)
                    setIsTaskRunning(false)
                  },
                  Number(getTimeoutValues(model, attributes))
                )
              }}
            >
              <Loader2 className={`mr-2 h-4 w-4 animate-spin ${isLoading ? 'block' : 'hidden'} `} />
              Start Analysis
            </Button>
          </div>

          <TabsContent value="train">
            <TrainTestTabContent />
          </TabsContent>
          <TabsContent value="test">
            <TrainTestTabContent />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

const TrainTestTabContent = () => {
  const { model, setModel } = useGNNStore()

  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-ignore type is manually checked
  const executeGNN = async () => {
    // Call the backend to get GNN Results
    let args = ''
    switch (model) {
      case 'GIN':
        args = "--model gin --tqdm --unique_name 'gin' --testing --inference"
        break
      case 'GAT':
        args = "--model gat --tqdm --unique_name 'gat' --testing --inference"
        break
      case 'PNA':
        args = "--model pna --tqdm --unique_name 'pna' --testing --inference"
        break
      case 'RGCN':
        args = "--model rgcn --tqdm --unique_name 'rgcn' --testing --inference"
        break
    }
    const GNNResults = await window.api.runGNNScript(args)
    return GNNResults
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <div className="grid w-full items-center gap-4 px-1">
      <div className="flex flex-col space-y-5">
        <Label htmlFor="model" className="mt-5">
          Select Model
        </Label>

        <div className="flex gap-4  items-center justify-between">
          <Select defaultValue="GIN" onValueChange={(e) => setModel(e as Models)}>
            <SelectTrigger id="model" value={model} className="w-[250px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value={'GIN'}>GIN - Graph Isomorphism Network</SelectItem>
              <SelectItem value={'GAT'}>GAT - Graph Attention Network</SelectItem>
              <SelectItem value={'PNA'}>PNA - Principal Neighbourhood Aggregation</SelectItem>
              <SelectItem value={'RGCN'}>RGCN - Relational Graph Neural Network</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:none">
                  <BsQuestionCircle className="size-6 opacity-50" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {/* <p className="w-[200px] p-2 text-sm text-slate-700">{model.description}</p> */}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Label htmlFor="model" className="mt-5">
        Select Features
      </Label>

      {modelOptions.map((model) => (
        <div key={model.label} className="flex gap-4 items-center justify-between ">
          <div className="flex flex-col gap-2 border border-slate-200 rounded-md px-6 w-[250px]">
            <div className="flex items-center gap-3">
              <Checkbox id={model.label} />
              <label
                htmlFor={model.label}
                className="text-sm py-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  hover:cursor-pointer"
              >
                {model.label}
              </label>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:none hover:bg-white">
                  <BsQuestionCircle className="size-6 opacity-50 hover:opacity-80" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900">
                <p className="w-[200px] p-2 text-sm text-slate-200">{model.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  )
}

const modelOptions = [
  {
    label: 'Edge Updates via MLPs',
    description:
      'Using Multilayer Perceptrons (MLPs) to update edge information based on node features, allowing for complex transformations and improved message passing.'
  },
  {
    label: 'Reverse Message Passing',
    description:
      'Addressing the limitation of nodes only receiving messages from incoming neighbors in directed graphs by implementing separate message-passing layers for incoming and outgoing edges, enabling better capture of directional information.'
  },
  {
    label: "Ego ID's to Center Nodes",
    description:
      "Assigning unique identifiers to central nodes in the graph to aid in cycle detection and recognition of specific patterns, improving the GNN's ability to capture cyclic structures and other complex patterns."
  },
  {
    label: 'Port Numbering for Edges',
    description:
      "Assigning unique identifiers (port numbers) to edges in directed multigraphs, allowing nodes to distinguish between messages from different neighbors. This enhances the GNN's ability to capture local connectivity patterns and detect specific subgraph structures, contributing to more accurate graph analysis"
  }
]

const getTimeoutValues = (model: Models, attributes: GNNAttributes[]): number => {
  if (model === 'GIN' && attributes.length > 3) return 150000
  if (model === 'GIN') return 20000
  else if (model === 'GAT')
    return 1000 // add 0
  else if (model === 'PNA') return 60000
  else if (model === 'RGCN') return 40000
  return 6000
}
