import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { OverviewData, useOverviewStore } from './store'
import { Button } from '@/components/ui/button'
import TimeSeriesTab from './_components/time-series-tab'
import OverviewTab from './_components/overview-tab'
import { CalendarDateRangePicker } from './_components/date-range-picker'
import { IntroDialog } from './_components/intro-dialog/intro'

export default function OverviewPage() {
  const { activeDataset } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const { setOverviewData } = useOverviewStore()

  useEffect(() => {
    const getOverviewData = async () => {
      setIsLoading(true)
      // Call the backend to get the overview data
      const overviewData: OverviewData = await window.api.runOverview()
      setOverviewData(overviewData)
      setIsLoading(false)
    }

    if (activeDataset) getOverviewData()
  }, [activeDataset])

  return (
    <>
      <IntroDialog></IntroDialog>
      <div className="flex flex-col gap-4 px-8 mt-4 overflow-hidden">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold text-slate-800 underline underline-offset-4">
              NeuraSight
            </h2>
            <h3 className="text-muted-foreground">
              Welcome! Here&apos;s a quick overview of the data you&apos;ve uploaded.
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="gap-4 mt-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="time-series">Time Series</TabsTrigger>
          </TabsList>
          <OverviewTab isLoading={isLoading} />
          <TimeSeriesTab />
        </Tabs>
      </div>
    </>
  )
}
