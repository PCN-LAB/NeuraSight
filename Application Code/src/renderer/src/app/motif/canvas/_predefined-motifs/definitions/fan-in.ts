import fanInSvg from '@/assets/fan-in.svg'
import { MotifBase } from '..'

export const FAN_IN: MotifBase = {
  icon: fanInSvg,
  nodes: [
    {
      id: '1',
      data: null,
      position: { x: 474, y: 197 }
    },
    {
      id: '2',
      data: null,
      position: { x: 471, y: 307 }
    },
    {
      id: '3',
      data: null,
      position: { x: 472, y: 421 }
    },
    {
      id: '4',
      data: null,
      position: { x: 757, y: 303 }
    }
  ],
  edges: [
    { id: 'reactflow__edge-1-4', source: '1', target: '4' },
    { id: 'reactflow__edge-2-4', source: '2', target: '4' },
    { id: 'reactflow__edge-3-4', source: '3', target: '4' }
  ]
}
