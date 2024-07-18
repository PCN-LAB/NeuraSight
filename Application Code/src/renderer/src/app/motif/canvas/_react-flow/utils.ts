import { Node, Edge, MarkerType, XYPosition } from 'reactflow'
import { AllowedMotifs, predefinedMotifs } from '../_predefined-motifs'

// [IMPORTANT] RF(reactflow) nodes and edges have lots of information which we dont want to pass to backend
// so we need to transform them to a minimal format which can be used by the backend and vice versa
// Minimal format is just an array of objects with only the required information

// Used when communicating with backend
export type MinimalEdge = {
  source: string
  target: string
}

export type MinimalNode = {
  id: string | number
  position: XYPosition
}

// (Frontend → Backend)
// This function transform the edges array from reactflow to a format that can be used by the motif analysis script
export function transformEdgesArray(edges: Edge[]): [string, string][] {
  return edges.map(({ source, target }) => [source, target])
}

export function transformNodes_Backend(nodes: Node[]): MinimalNode[] {
  return nodes.map(({ id, position }) => ({ id, position }))
}

export function transformEdges_Backend(edges: Edge[]): MinimalEdge[] {
  return edges.map(({ source, target }) => ({ source, target }))
}

export type predefinedMotifsAttribute = {
  icon?: string
  nodes: MinimalNode[]
  edges: MinimalEdge[]
}

type PlainGraphOptions = {
  id: AllowedMotifs
  nodeType: string // TODO add type safety
  nodes?: MinimalNode[] // Not required if predefined motif is being used
  edges?: MinimalEdge[]
}

// (Backend → Frontend)
// Following functions are used to convert crude nodes and edges to reactflow compatible nodes and edges
export function transformEdges_Frontend(edges: MinimalEdge[]) {
  return edges.map(
    (edge) =>
      ({
        style: {
          strokeWidth: 2,
          stroke: 'gray'
        },
        type: 'floating',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'gray'
        },
        source: edge.source,
        sourceHandle: null,
        target: edge.target,
        targetHandle: null,
        id: `reactflow__edge-${edge.source}-${edge.target}`
      }) as Edge
  )
}

export function transformNodes_Frontend(nodes: MinimalNode[], nodeType: string) {
  return nodes.map(
    (node) =>
      ({
        id: node.id,
        type: nodeType,
        position: {
          x: node.position.x,
          y: node.position.y
        },
        data: {
          label: 'Node'
        }
      }) as Node
  )
}

export const getReactFlowGraphFromMinimalParams = ({ id, nodeType }: PlainGraphOptions) => {
  const selectedMotif = predefinedMotifs.find((motif) => motif.id === id)
  if (selectedMotif) {
    return {
      nodes: transformNodes_Frontend(selectedMotif.nodes, nodeType),
      edges: transformEdges_Frontend(selectedMotif.edges)
    }
  }

  return { nodes: [], edges: [] }
}

interface MappingReference {
  [key: string]: number
}

export const transformNodesWithAccountNumbers = (
  index: number,
  nodesArr: Node[],
  mappingReferenceArr: MappingReference[],
  nodeType: string
): Node[] => {
  const mapping = mappingReferenceArr[index]
  const invertedMapping: { [key: number]: string } = {}
  for (const key in mapping) {
    const value = mapping[key]
    invertedMapping[value] = key
  }

  return nodesArr.map((node) => ({
    ...node,
    id: invertedMapping[node.id],
    type: nodeType
  }))
}

export const transformEdgesWithAccountNumbers = (
  index: number,
  edgesArr: Edge[],
  mappingReferenceArr: MappingReference[]
): Edge[] => {
  const mapping = mappingReferenceArr[index]
  const invertedMapping: { [key: number]: string } = {}
  for (const key in mapping) {
    const value = mapping[key]
    invertedMapping[value] = key
  }

  return edgesArr.map((edge) => ({
    ...edge,
    id: `reactflow__edge-${invertedMapping[edge.source]}-${invertedMapping[edge.target]}`,
    source: invertedMapping[edge.source],
    target: invertedMapping[edge.target]
  }))
}
