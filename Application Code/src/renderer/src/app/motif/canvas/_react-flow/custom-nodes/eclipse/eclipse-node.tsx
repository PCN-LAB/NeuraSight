import { Handle, Position, useStore } from 'reactflow'
import './styles.css'

const connectionNodeIdSelector = (state) => state.connectionNodeId

export default function EclipseNode({ id }) {
  const connectionNodeId = useStore(connectionNodeIdSelector)

  const isConnecting = !!connectionNodeId
  const isTarget = connectionNodeId && connectionNodeId !== id
  const label = isTarget ? 'D' : id

  return (
    <div className="eclipseDragging">
      <div
        className="eclipseBody"
        style={{
          borderStyle: isTarget ? 'dotted' : 'solid',
          backgroundColor: isTarget ? '#e8e9f3' : 'white'
        }}
      >
        {!isConnecting && (
          <Handle className="eclipseHandle" position={Position.Right} type="source" />
        )}

        <Handle
          className="eclipseHandle"
          position={Position.Left}
          type="target"
          isConnectableStart={false}
        />
        {label}
      </div>
    </div>
  )
}
