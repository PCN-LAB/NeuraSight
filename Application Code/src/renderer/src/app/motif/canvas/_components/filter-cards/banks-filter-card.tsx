import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useFiltersStore } from '../../filters-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CiCircleRemove } from 'react-icons/ci'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AiOutlineBank } from 'react-icons/ai'

export default function BanksFilterCard() {
  const { banks, setBanks } = useFiltersStore()

  return (
    <Card className="w-[450px]">
      <CardHeader className="pb-3">
        <CardTitle className="font-normal text-xl">
          <div className="flex gap-2 items-center">
            <AiOutlineBank className="size-5" />
            Filter Banks
          </div>
        </CardTitle>
        <CardDescription>Banks you want to be included in the analysis.</CardDescription>
        <div className="text-slate-500 text-sm font-medium">
          To include all banks, don&apos;t specify any.
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ScrollArea className="h-[200px] w-[410px] ">
          <div className="flex flex-col gap-4">
            {banks.map((value, index) => (
              <div key={index} className="flex gap-5 px-[1px] py-[1px]">
                <Input
                  type="text"
                  placeholder="Bank ID"
                  className="w-[210px]"
                  defaultValue={value ? value : ''}
                  onChange={(e) => {
                    const value = e.target.value
                    const _banks = [...banks]
                    _banks[index] = value
                    setBanks(_banks)
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
                    const _banks = [...banks]
                    _banks.splice(index, 1)
                    setBanks(_banks)
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
          onClick={() => setBanks([...banks, ''])}
        >
          <div className="flex gap-2 align-center">
            <IoIosAddCircleOutline size={25} />
            <div className="">Add Bank</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}
