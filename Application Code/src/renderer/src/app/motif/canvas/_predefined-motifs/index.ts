import { Node, Edge } from 'reactflow'
import { BI_PARTITE } from './definitions/bi-partite'
import { FAN_IN } from './definitions/fan-in'
import { FAN_OUT } from './definitions/fan-out'
import { GATHER_SCATTER } from './definitions/gather-scatter'
import { SCATTER_GATHER } from './definitions/scatter-gather'
import { SIMPLE_CYCLE } from './definitions/simple-cycle'

export type AllowedMotifs =
  | 'gather-scatter'
  | 'scatter-gather'
  | 'simple-cycle'
  | 'bipartite'
  | 'fan-in'
  | 'fan-out'
  | 'circle'
  | 'tree-structure'
  | 'mesh-network'
  | 'star-network'
  | 'random-walk'
  | 'custom'
  | 'none'

export interface Motif extends MotifBase {
  id: string
  name: string
  description: string
}

export interface MotifBase {
  icon: string
  nodes: Node[]
  edges: Edge[]
}

export const predefinedMotifs: Motif[] = [
  {
    id: 'gather-scatter',
    name: 'Gather Scatter',
    description: 'Transactional is done across multiple nodes and is aggregated from these nodes.',
    icon: GATHER_SCATTER.icon,
    nodes: GATHER_SCATTER.nodes,
    edges: GATHER_SCATTER.edges
  },
  {
    id: 'scatter-gather',
    name: 'Scatter Gather',
    description:
      'Money is dispersed across multiple nodes, then aggregated or gathered at a single node.',
    icon: SCATTER_GATHER.icon,
    nodes: SCATTER_GATHER.nodes,
    edges: SCATTER_GATHER.edges
  },
  {
    id: 'simple-cycle',
    name: 'Simple Cycle',
    description:
      'Sequence of transactions forms a closed loop, where funds are transferred among accounts in a circular manner.',
    icon: SIMPLE_CYCLE.icon,
    nodes: SIMPLE_CYCLE.nodes,
    edges: SIMPLE_CYCLE.edges
  },
  {
    id: 'fan-in',
    name: 'Fan In',
    description:
      'Various transactions from multiple accounts or entities are consolidated into a central transaction',
    icon: FAN_IN.icon,
    nodes: FAN_IN.nodes,
    edges: FAN_IN.edges
  },
  {
    id: 'fan-out',
    name: 'Fan Out',
    description:
      'A central transaction initiates a cascade of interconnected transactions to multiple accounts or entities',
    icon: FAN_OUT.icon,
    nodes: FAN_OUT.nodes,
    edges: FAN_OUT.edges
  },
  {
    id: 'bipartite',
    name: 'Bipartite',
    description:
      'Two distinct sets of entities involved in transactions with edges denoting transactions between them.',
    icon: BI_PARTITE.icon,
    nodes: BI_PARTITE.nodes,
    edges: BI_PARTITE.edges
  },
  {
    id: 'tree-structure',
    name: 'Tree Structure',
    description:
      'Transactions follow a hierarchical tree-like structure, with a root node and branches connecting to child nodes.',
    icon: BI_PARTITE.icon,
    nodes: BI_PARTITE.nodes,
    edges: BI_PARTITE.edges
  },
  {
    id: 'mesh-network',
    name: 'Mesh Network',
    description:
      'Transactions occur in a decentralized mesh network where each node can connect to multiple other nodes directly.',
    icon: BI_PARTITE.icon,
    nodes: BI_PARTITE.nodes,
    edges: BI_PARTITE.edges
  },
  {
    id: 'star-network',
    name: 'Star Network',
    description:
      'Transactions are orchestrated through a central node, which connects to multiple peripheral nodes.',
    icon: BI_PARTITE.icon,
    nodes: BI_PARTITE.nodes,
    edges: BI_PARTITE.edges
  },
  {
    id: 'random-walk',
    name: 'Random Walk',
    description:
      'Transactions move randomly across nodes in the network, without following a predefined pattern or structure.',
    icon: BI_PARTITE.icon,
    nodes: BI_PARTITE.nodes,
    edges: BI_PARTITE.edges
  }
]
