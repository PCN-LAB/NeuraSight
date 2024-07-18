import scatterGaterSvg from '@/assets/scatter-gather.svg'
import { MotifBase } from '..'

export const SCATTER_GATHER: MotifBase = {
  icon: scatterGaterSvg,
  nodes: [
    {
      id: '1',
      data: null,
      position: { x: 414, y: 266 }
    },
    {
      id: '2',
      data: null,
      position: { x: 648, y: 127 }
    },
    {
      id: '3',
      data: null,
      position: { x: 647, y: 259 }
    },
    {
      id: '4',
      data: null,
      position: { x: 649, y: 395 }
    },
    {
      id: '5',
      data: null,
      position: { x: 877, y: 263 }
    }
  ],
  edges: [
    { id: 'reactflow__edge-1-2', source: '1', target: '2' },
    { id: 'reactflow__edge-1-3', source: '1', target: '3' },
    { id: 'reactflow__edge-1-4', source: '1', target: '4' },
    { id: 'reactflow__edge-2-5', source: '2', target: '5' },
    { id: 'reactflow__edge-3-5', source: '3', target: '5' },
    { id: 'reactflow__edge-4-5', source: '4', target: '5' }
  ]
}
