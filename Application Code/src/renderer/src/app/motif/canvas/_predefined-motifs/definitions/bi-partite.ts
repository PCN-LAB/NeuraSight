import bipartiteSvg from '@/assets/bipartite.svg'
import { MotifBase } from '..'

export const BI_PARTITE: MotifBase = {
  icon: bipartiteSvg,
  nodes: [
    {
      id: '1',
      data: null,
      position: { x: 514, y: 265 }
    },
    {
      id: '2',
      data: null,
      position: { x: 515, y: 384 }
    },
    {
      id: '3',
      data: null,
      position: { x: 762, y: 192 }
    },
    {
      id: '4',
      data: null,
      position: { x: 764, y: 320 }
    },
    {
      id: '5',
      data: null,
      position: { x: 762, y: 446 }
    }
  ],
  edges: [
    { id: 'reactflow__edge-2-5', source: '2', target: '5' },
    { id: 'reactflow__edge-2-4', source: '2', target: '4' },
    { id: 'reactflow__edge-2-3', source: '2', target: '3' },
    { id: 'reactflow__edge-1-3', source: '1', target: '3' },
    { id: 'reactflow__edge-1-4', source: '1', target: '4' },
    { id: 'reactflow__edge-1-5', source: '1', target: '5' }
  ]
}
