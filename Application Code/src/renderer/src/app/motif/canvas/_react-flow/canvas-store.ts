import { create } from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow'

export const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode
})

type CanvasStore = {
  nodes: Node[]
  edges: Edge[]
  motifsFound: any[]
  motifsAccountMapping: any[]
  isInspectionMode: boolean // when enabled, account numbers would be shown on the nodes (different node type will be used)

  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node) => void

  setMotifsFound: (results: any[]) => void
  setMotifsAccountMapping: (mapping: any[]) => void
  setMotifInspectionMode: (show: boolean) => void
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  nodes: [],
  edges: [],
  motifsFound: [],
  isInspectionMode: false,
  motifsAccountMapping: [],

  // Core reactflow functionality (https://reactflow.dev/learn/advanced-use/state-management)
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges)
    })
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes })
  },
  setEdges: (edges: Edge[]) => {
    set({ edges })
  },

  // Custom Reactflow functionality
  addNode: (node) => {
    set((state) => {
      return {
        nodes: [...state.nodes, node]
      }
    })
  },

  // Dealing with results
  setMotifsFound: (results) => {
    set(() => ({ motifsFound: results }))
  },
  setMotifsAccountMapping: (mapping) => {
    set(() => ({ motifsAccountMapping: mapping }))
  },
  setMotifInspectionMode: (show) => {
    set(() => ({ isInspectionMode: show }))
  }
}))
