import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useFiltersStore } from '../../filters-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CiCircleRemove } from 'react-icons/ci'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { FaRegUser } from 'react-icons/fa'

export default function UserFilterCard() {
  const { accounts, setAccounts } = useFiltersStore()

  return (
    <Card className="w-[450px]">
      <CardHeader className="pb-3">
        <CardTitle className="font-normal text-xl">
          <div className="flex gap-2 items-center">
            <FaRegUser className='size-4' />
            Filter Users
          </div>
        </CardTitle>
        <CardDescription>Banks you want to be included in the analysis.</CardDescription>
        <div className="text-slate-500 text-sm font-medium">
          To include all accounts, don&apos;t specify any.
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ScrollArea className="h-[200px] w-[410px] ">
          <div className="flex flex-col gap-4 ">
            {accounts.map((value, index) => (
              <div key={index} className="flex gap-5 px-[1px] py-[1px]">
                <Input
                  type="text"
                  placeholder="Account ID"
                  className="w-[210px]"
                  defaultValue={value ? value : ''}
                  onChange={(e) => {
                    const value = e.target.value
                    const _accounts = [...accounts]
                    _accounts[index] = value
                    setAccounts(_accounts)
                  }}
                />

                <Select defaultValue="sender">
                  <SelectTrigger className=" w-[100px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sender">Sender</SelectItem>
                    <SelectItem value="receiver">Receiver</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={'ghost'}
                  size={'icon'}
                  onClick={() => {
                    const _accounts = [...accounts]
                    _accounts.splice(index, 1)
                    setAccounts(_accounts)
                  }}
                >
                  <CiCircleRemove size={25} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button
          variant={'secondary'}
          className="self-center mt-2"
          onClick={() => setAccounts([...accounts, ''])}
        >
          <div className="flex gap-2 align-center">
            <IoIosAddCircleOutline size={25} />
            <div className="">Add Accounts</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}
