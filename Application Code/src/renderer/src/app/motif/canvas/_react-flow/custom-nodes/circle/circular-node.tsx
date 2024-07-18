import { Handle, Position, useStore } from 'reactflow'
import './styles.css'

const connectionNodeIdSelector = (state) => state.connectionNodeId

export default function CustomNode({ id }) {
  const connectionNodeId = useStore(connectionNodeIdSelector)

  const isConnecting = !!connectionNodeId
  const isTarget = connectionNodeId && connectionNodeId !== id
  const label = isTarget ? 'Drop' : id

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
          backgroundColor: isTarget ? '#cbd5e1' : 'white',
        }}
      >
        {!isConnecting && (
          <Handle className="customHandle" position={Position.Right} type="source" />
        )}

        <Handle
          className="customHandle"
          position={Position.Left}
          type="target"
          isConnectableStart={false}
        />
        {label}
      </div>
    </div>
  )
}
