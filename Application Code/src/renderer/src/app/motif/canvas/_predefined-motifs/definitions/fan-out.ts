import fanOutSvg from '@/assets/fan-out.svg'
import { MotifBase } from '..'

export const FAN_OUT: MotifBase = {
  icon: fanOutSvg,
  nodes: [
    {
      id: '1',
      data: null,
      position: { x: 478, y: 295 }
    },
    {
      id: '2',
      data: null,
      position: { x: 715, y: 171 }
    },
    {
      id: '3',
      data: null,
      position: { x: 712, y: 286 }
    },
    {
      id: '4',
      data: null,
      position: { x: 712, y: 401 }
    }
  ],
  edges: [
    { id: 'reactflow__edge-1-2', source: '1', target: '2' },
    { id: 'reactflow__edge-1-3', source: '1', target: '3' },
    { id: 'reactflow__edge-1-4', source: '1', target: '4' }
  ]
}
