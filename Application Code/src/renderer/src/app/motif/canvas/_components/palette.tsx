import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IoIosAdd } from 'react-icons/io'
import { IoSettingsOutline } from 'react-icons/io5'
import { IoMdRemove } from 'react-icons/io'
import { PiSelectionBackgroundLight } from 'react-icons/pi'
import { selector, useCanvasStore } from '../_react-flow/canvas-store'
import { useShallow } from 'zustand/react/shallow'
import { AiOutlineSave } from 'react-icons/ai'
import { useRef } from 'react'

type PaletteProps = {
  className?: string //React.HTMLAttributes<HTMLDivElement>
  redCoordinate?: { x: number; y: number }
}

export default function Palette({ className }: PaletteProps) {
  const newNodeY = useRef(0)
  const { addNode, nodes } = useCanvasStore(useShallow(selector))

  return (
    <div
      className={cn('z-10 w-[50px] py-2 bg-white border border-slate-300 rounded-full', className)}
    >
      <div className="flex flex-col gap-4 items-center justify-items-center">
        <Button
          variant="ghost"
          size="icon"
          className="hover:rounded-full"
          onClick={() => {
            addNode({
              id: String(nodes.length + 1),
              type: 'circle',
              position: { x: 0, y: newNodeY.current },
              data: { label: 'Node' }
            })
            newNodeY.current += 70 // So that new node doesnt overlap if multiple added at same time
          }}
        >
          <IoIosAdd className="size-6" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:rounded-full">
          <IoMdRemove className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:rounded-full">
          <PiSelectionBackgroundLight className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:rounded-full">
          <AiOutlineSave className="size-4" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:rounded-full">
          <IoSettingsOutline className="size-5" />
        </Button>
      </div>
    </div>
  )
}
