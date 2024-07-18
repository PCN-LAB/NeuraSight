import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PredictedFraudsTable } from './frauds-table'
import StatisticsTab from './statistics-tab'

export default function RightPane() {
  return (
    <Tabs defaultValue="statistics" className="w-full ml-5">
      <TabsList className="my-2">
        <TabsTrigger value="statistics" className="px-5">
          Statistics
        </TabsTrigger>
        <TabsTrigger value="predicted-frauds" className="px-5">
          Predicted Frauds
        </TabsTrigger>
      </TabsList>

      <TabsContent value="statistics" className="flex flex-col gap-2">
        <StatisticsTab />
      </TabsContent>

      <TabsContent value="predicted-frauds" className="-mt-5">
        <PredictedFraudsTable />
      </TabsContent>
    </Tabs>
  )
}
