import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useOverviewStore } from '../store'
import { formatLargeNumber } from '@/lib/utils'

export function RecentSales() {
  const { overviewData } = useOverviewStore()

  if (!overviewData) return null

  return (
    <div className="space-y-8">
      {Object.entries(overviewData?.topAccountsAmount).map(([key, value], index) => (
        <div key={key} className="flex items-center">
          <Avatar className="size-10">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{index + 1}</AvatarFallback>
          </Avatar>
          <div className="ml-4 ">
            <p className="text-sm font-medium leading-none">{key}</p>
          </div>
          <div className="ml-auto font-medium">{formatLargeNumber(value as number)}</div>
        </div>
      ))}
    </div>
  )
}
