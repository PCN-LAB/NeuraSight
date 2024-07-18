import ReactFlow, { Background, MarkerType, MiniMap, Controls, Panel, Node, Edge } from 'reactflow'
import FloatingEdge from '../_react-flow/easy-connect/floating-edge'
import CustomConnectionLine from '../_react-flow/easy-connect/custom-connection-line'
import { selector, useCanvasStore } from '../_react-flow/canvas-store'
import { nodeTypes } from '../_react-flow/custom-nodes'
import { useShallow } from 'zustand/react/shallow'
import Palette from './palette'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  transformEdges_Frontend,
  transformEdges_Backend,
  transformNodes_Frontend,
  transformNodes_Backend
} from '../_react-flow/utils'
import 'reactflow/dist/style.css'

const edgeTypes = {
  floating: FloatingEdge
}

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: 'black' },
  type: 'floating',

  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black'
  }
}

// When creating an edge
const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'gray',
  opacity: 0.5
}

const defaultViewport = { x: 0, y: 0, zoom: 1 }

export default function Canvas() {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect } =
    useCanvasStore(useShallow(selector))
  const [isLoading, setIsLoading] = useState(false)
  const { isInspectionMode } = useCanvasStore()

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={CustomConnectionLine}
        connectionLineStyle={connectionLineStyle}
        defaultViewport={defaultViewport}
        proOptions={{
          hideAttribution: true
        }}
      >
        <Panel position={'top-right'}>
          <Palette className="mt-16" />
        </Panel>

        {isInspectionMode && (
          <Panel position="top-center">
            <div className="flex gap-5 mr-[260px]">
              <Button
                className="bg-slate-100 hover:bg-slate-200"
                variant={'outline'}
                onClick={async () => {
                  setIsLoading(true)
                  const updatedGraph = await findNeighbours({ nodes, edges })
                  setNodes(updatedGraph.nodes) // Passing these as props breaks functionality
                  setEdges(updatedGraph.edges)
                  setIsLoading(false)
                }}
              >
                <Loader2
                  className={`mr-2 h-4 w-4 animate-spin ${isLoading ? 'block' : 'hidden'} `}
                />
                {isLoading ? 'Searching' : 'Find Neighbours'}
              </Button>

              <Button variant={'outline'}>Use As Template</Button>
            </div>
          </Panel>
        )}

        <Background />
        <MiniMap zoomable pannable />
        <Controls />
      </ReactFlow>
    </div>
  )
}

const findNeighbours = async ({ nodes, edges, }: { nodes: Node[]; edges: Edge[] }) => {
  // Call backend api
  const res = await window.api.findNeighbours({
    nodes: transformNodes_Backend(nodes),
    edges: transformEdges_Backend(edges)
  })

  const updatedMinimalGraph = res[0]

  const oldEdges = transformEdges_Frontend(edges)
  const newEdges = transformEdges_Frontend(updatedMinimalGraph.edges)

  const edgesWithNeighbours = newEdges.map((element) => {
    if (oldEdges.find((oldEdge) => oldEdge.id === element.id)) {
      return {
        ...element,
        style: { strokeWidth: 2, stroke: '#7c2d12', zIndex: 50, opacity: 0.4 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#7c2d12'
        }
      }
    } else {
      // new edges
      return {
        ...element,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#16a34a'
        },
        style: { strokeWidth: 2, stroke: '#16a34a' }
      }
    }
  })

  const updatedGraph = {
    nodes: transformNodes_Frontend(updatedMinimalGraph.nodes, 'eclipse'),
    edges: edgesWithNeighbours
  }

  return updatedGraph
}
