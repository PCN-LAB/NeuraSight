import simpleCycleSvg from '@/assets/simple-cycle.svg'
import { MotifBase } from '..'

export const SIMPLE_CYCLE: MotifBase = {
  icon: simpleCycleSvg,
  nodes: [
    {
      id: '1',
      data: null,
      position: { x: 636, y: 160 }
    },
    {
      id: '2',
      data: null,
      position: { x: 796, y: 272 }
    },
    {
      id: '3',
      data: null,
      position: { x: 637, y: 399 }
    },
    {
      id: '4',
      data: null,
      position: { x: 483, y: 278 }
    }
  ],
  edges: [
    { id: 'reactflow__edge-1-2', source: '1', target: '2' },
    { id: 'reactflow__edge-2-3', source: '2', target: '3' },
    { id: 'reactflow__edge-3-4', source: '3', target: '4' },
    { id: 'reactflow__edge-4-1', source: '4', target: '1' }
  ]
}
