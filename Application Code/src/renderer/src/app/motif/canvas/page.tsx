import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Canvas from './_components/canvas'
import DatasetTable from '../_components/dataset-table'
import Sidebar from './_components/sidebar'

export default function DrawCanvas() {
  return (
    <main>
      <ResizablePanelGroup direction="vertical" className="min-h-[92vh]">
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full">
            <div className="w-[15%] border-r border-slate-100 ">
              <Sidebar />
            </div>
            <div className="w-[85%]">
              <Canvas />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} className="min-h-[10vh] max-h-[55vh] -mb-[1px]">
          <DatasetTable />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
