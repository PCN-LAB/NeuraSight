import { Card } from '@/components/ui/card'
import { useGNNStore } from '../store'

export default function StatisticsTab() {
  const { f1Score, precision, recall, accuracy, totalTransactions, fradulentTransactions } =
    useGNNStore()

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 ">
      {/* F1 Score */}
      <div>
        <Card className="w-[500px] h-[130px] py-4 px-8">
          <div className="flex flex-col gap-2">
            <div className="-mb-2 text-2xl font-semibold text-slate-700">
              {f1Score === 0 ? `N/A` : `${f1Score}%`}
            </div>
            <div className="flex flex-col opacity-80 gap-1">
              <div className="text-xl">F1 Score</div>
              <div className="text-md leading-4 text-slate-500 ">
                F1 Score is the harmonic mean of precision and recall.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Precision */}
      <div>
        <Card className="w-[500px] h-[130px] py-4 px-8 ">
          <div className="flex flex-col gap-2">
            <div className="-mb-2 text-2xl font-semibold text-slate-700">
              {precision === 0 ? `N/A` : `${precision}%`}
            </div>
            <div className="flex flex-col opacity-80 gap-1">
              <div className="text-xl">Precision</div>
              <div className="text-md leading-4 text-slate-500 ">
                {' '}
                Precision is the ratio of correctly predicted positive observations to the total{' '}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recall */}
      <div>
        <Card className="w-[500px] h-[130px] py-4 px-8">
          <div className="flex flex-col gap-2">
            <div className="-mb-2 text-2xl font-semibold text-slate-700">
              {recall === 0 ? `N/A` : `${recall}%`}
            </div>
            <div className="flex flex-col opacity-80 gap-1">
              <div className="text-xl">Recall</div>
              <div className="text-md leading-4 text-slate-500 ">
                {' '}
                Recall is the ratio of correctly predicted positive observations to the all
                observations in actual class.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Accuracy */}
      <div>
        <Card className="w-[500px] h-[130px] py-4 px-8">
          <div className="flex flex-col gap-2">
            <div className="-mb-2 text-2xl font-semibold text-slate-700">
              {accuracy === 0 ? `N/A` : `${accuracy}%`}
            </div>
            <div className="flex flex-col opacity-80 gap-1">
              <div className="text-xl">Accuracy</div>
              <div className="text-md leading-4 text-slate-500 ">
                {' '}
                Accuracy is the ratio of correctly predicted observations to the total observations.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Total Transactions */}
      <div>
        <Card className="w-[500px] h-[130px] py-4 px-8">
          <div className="flex flex-col gap-2">
            <div className="-mb-2 text-2xl font-semibold text-slate-700">
              {totalTransactions === 0 ? `N/A` : `${totalTransactions}`}
            </div>
            <div className="flex flex-col opacity-80 gap-1">
              <div className="text-xl">Total Transactions</div>
              <div className="text-md leading-4 text-slate-500 ">
                {' '}
                Total Transactions present in the dataset which was provided.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Fraudulent Transactions */}
      <div>
        <Card className="w-[500px] h-[130px] py-4 px-8">
          <div className="flex flex-col gap-2">
            <div className="-mb-2 text-2xl font-semibold text-slate-700">
              {fradulentTransactions === 0 ? `N/A` : `${fradulentTransactions}`}
            </div>
            <div className="flex flex-col opacity-80 gap-1">
              <div className="text-xl">Possible Frauds</div>
              <div className="text-md leading-4 text-slate-500 ">
                {' '}
                Possible Frauds are the transactions that are predicted as frauds by the model.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
