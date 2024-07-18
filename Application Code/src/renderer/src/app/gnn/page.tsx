import LeftPane from './_components/left-pane'
import RightPane from './_components/right-pane'

export default function GNNPage() {
  return (
    <div className="flex flex-col gap-4 px-8 mt-4 overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold text-slate-800 underline underline-offset-4">
          Graph Neural Network Analysis
        </h2>
        <h3 className="text-muted-foreground">
          Graph Neural Network (GNN) analysis for detecting anomalies in financial transactions
        </h3>
      </div>

      <div className="mt-5 flex">
        <LeftPane />
        <RightPane />
      </div>
    </div>
  )
}
