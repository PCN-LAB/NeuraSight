import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { TransactionAmountChart } from './overview'
import { RecentSales } from './recent-sales'
import { Skeleton } from '@/components/ui/skeleton'
import { useOverviewStore } from '../store'
import { Loader2 } from 'lucide-react'

export default function OverviewTab({ isLoading }: { isLoading: boolean }) {
  const { overviewData } = useOverviewStore()

  const showLoadAnimation = isLoading || !overviewData

  return (
    <TabsContent value="overview" className="space-y-4 mt-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-[90px]">
          <CardHeader className=" flex flex-row items-center justify-between space-y-0 pb-2 -mt-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">
              {showLoadAnimation ? (
                <Skeleton className="h-8 w-[250px] bg-slate-100" />
              ) : (
                overviewData.numTransactions
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="h-[90px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-2">
            <CardTitle className="text-sm font-medium">Unique Accounts</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showLoadAnimation ? (
                <Skeleton className="h-8 w-[250px] bg-slate-100" />
              ) : (
                overviewData.numUniqueAccounts
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="h-[90px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-2">
            <CardTitle className="text-sm font-medium">Unique Banks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showLoadAnimation ? (
                <Skeleton className="h-8 w-[250px] bg-slate-100" />
              ) : (
                overviewData.numUniqueAccounts
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="h-[90px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 -mt-2">
            <CardTitle className="text-sm font-medium">Most Used Currency</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showLoadAnimation ? (
                <Skeleton className="h-8 w-[250px] bg-slate-100" />
              ) : (
                overviewData.mostUsedCurrency
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 h-[440px]">
          <CardHeader>
            <CardTitle>Most Transactions</CardTitle>
            <CardDescription>
              Top 10 accounts with the highest number of transactions in terms of count.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {showLoadAnimation ? (
              <Loader2 className={`animate-spin size-32 stroke-slate-200 mx-auto mt-28`} />
            ) : (
              <TransactionAmountChart />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 h-[440px]">
          <CardHeader>
            <CardTitle>Highest Transactions Amount</CardTitle>
            <CardDescription>
              Top 5 accounts with the highest number of transactions in terms of amount.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showLoadAnimation ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 ">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RecentSales />
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
