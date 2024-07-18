import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Dispatch, SetStateAction, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useCanvasStore } from '../_react-flow/canvas-store'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  transformEdgesWithAccountNumbers,
  transformNodesWithAccountNumbers
} from '../_react-flow/utils'

type MotifResultDialogProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function MotifResultDialog({ open, setOpen }: MotifResultDialogProps) {
  const {
    motifsFound,
    motifsAccountMapping,
    setMotifInspectionMode,
    nodes,
    setNodes,
    edges,
    setEdges
  } = useCanvasStore()
  const [currMotifIndex, setCurrMotifIndex] = useState(0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!motifsFound || motifsFound.length === 0}>
          Analysis Results
        </Button>
      </DialogTrigger>

      <DialogContent className=" min-w-[1400px]">
        <DialogHeader>
          <DialogTitle>Motif Analysis Results</DialogTitle>
          <DialogDescription>
            The following transactions were a part of the motif described.
          </DialogDescription>
          <div className="text-sm text-slate-600">
            Total motifs found: <span className="text-lg font-semibold">{motifsFound.length}</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2 items-center">
          <Tabs defaultValue="0">
            <TabsList className="flex gap-1 flex-wrap">
              {Array.from({ length: motifsFound.length }, (_, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toLocaleString()}
                  onClick={() => setCurrMotifIndex(index)}
                >
                  {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="h-[500px] overflow-auto mt-4">
              {motifsFound.map((motif, index) => {
                // setCurrMotifIndex(index)
                return (
                  <TabsContent key={index} value={index.toLocaleString()}>
                    <Table className="">
                      <TableHeader>
                        <TableRow className="bg-slate-200">
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Origin Bank</TableHead>
                          <TableHead>Sender Account</TableHead>
                          <TableHead>Dest. Bank</TableHead>
                          <TableHead>Receiver Account</TableHead>
                          <TableHead>Amount Received</TableHead>
                          <TableHead>Receiving Currency</TableHead>
                          <TableHead>Amount Paid</TableHead>
                          <TableHead>Payment Currency</TableHead>
                          <TableHead>Payment Format</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {motif.map((rowData, index) => (
                          <TableRow key={index}>
                            {Object.entries(rowData).map(([key, value]) => (
                              <TableCell key={key}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                )
              })}
            </div>
          </Tabs>
          <Button
            className="w-44"
            onClick={() => {
              const transformedNodes = transformNodesWithAccountNumbers(
                currMotifIndex,
                nodes,
                motifsAccountMapping,
                'eclipse'
              )
              const transformedEdges = transformEdgesWithAccountNumbers(
                currMotifIndex,
                edges,
                motifsAccountMapping
              )

              setNodes(transformedNodes)
              setEdges(transformedEdges)
              setMotifInspectionMode(true)
              setOpen(false)
            }}
          >
            Visualize in Editor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
