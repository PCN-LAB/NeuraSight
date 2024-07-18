import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useOverviewStore } from '../store'

function convertToArray(obj: object) {
  return Object.entries(obj).map(([name, total]) => ({ name, total }))
}

export function TransactionAmountChart() {
  const { overviewData } = useOverviewStore()

  if (!overviewData) return null

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={convertToArray(overviewData.topAccountsTransactions)}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
