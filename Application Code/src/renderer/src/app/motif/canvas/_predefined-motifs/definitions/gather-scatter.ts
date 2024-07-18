import gatherScatterSvg from '@/assets/gather-scatter.svg'
import { MotifBase } from '..'

export const GATHER_SCATTER: MotifBase = {
  icon: gatherScatterSvg,
  nodes: [
    {
      id: '1',
      data: null,
      position: { x: 325, y: 241 }
    },
    {
      id: '2',
      data: null,
      position: { x: 291, y: 304 }
    },
    {
      id: '3',
      data: null,
      position: { x: 325, y: 368 }
    },
    {
      id: '4',
      data: null,
      position: { x: 472, y: 306 }
    },
    {
      id: '5',
      data: null,
      position: { x: 606, y: 240 }
    },
    {
      id: '6',
      data: null,
      position: { x: 620, y: 305 }
    },
    {
      id: '7',
      data: null,
      position: { x: 606, y: 368 }
    }
  ],
  edges: [
    { id: 'reactflow__edge-2-4', source: '2', target: '4' },
    { id: 'reactflow__edge-1-4', source: '1', target: '4' },
    { id: 'reactflow__edge-3-4', source: '3', target: '4' },
    { id: 'reactflow__edge-4-5', source: '4', target: '5' },
    { id: 'reactflow__edge-4-6', source: '4', target: '6' },
    { id: 'reactflow__edge-4-7', source: '4', target: '7' }
  ]
}
