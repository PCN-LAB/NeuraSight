import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { useFiltersStore } from '../../filters-store'
import { IoTimeOutline } from 'react-icons/io5'

export default function TimePeriodFilterCard() {
  const { setStartDate, setEndDate } = useFiltersStore()

  return (
    <Card className="w-[25%]">
      <CardHeader className="pb-3">
        <CardTitle className="font-normal text-xl">
          <div className="flex gap-2 items-center">
            <IoTimeOutline className="size-5" />
            Time Period
          </div>
        </CardTitle>
        <CardDescription>Choose what you want to be notified about.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-normal text-slate-500">Start Date</div>
            <Input type="date" onChange={(e) => setStartDate(formatDate(e.target.value))} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm font-normal text-slate-500">End Date</div>
            <Input type="date" onChange={(e) => setEndDate(formatDate(e.target.value))} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
