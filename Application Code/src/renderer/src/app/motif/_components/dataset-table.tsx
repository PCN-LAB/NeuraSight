import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useAppStore } from '@/store/app-store'
import { useEffect, useState } from 'react'

export default function DatasetTable() {
  const { activeDataset } = useAppStore()
  const [datasetRows, setDatasetRows] = useState<[]>()

  useEffect(() => {
    if (!activeDataset) return

    const readCsv = async () => {
      const _datasetRows: [] = await window.api.readCsv(activeDataset?.path)
      setDatasetRows(_datasetRows)
    }
    readCsv()
  }, [activeDataset])

  if (!datasetRows)
    return (
      <div className="w-full  justify-center py-[2%]   flex items-centers">
        <div className="border border-dotted px-20 py-5 rounded-md font-semibold">
          Your dataset appears here.
        </div>
      </div>
    )

  return (
    <Table className="w-full">
      <TableHeader className="bg-slate-200">
        <TableRow>
          {Object.keys(datasetRows[0]).map((head, index) => (
            <TableHead key={index}>{head}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {datasetRows.map((rowData, index) => (
          <TableRow key={index}>
            {Object.entries(rowData).map(([key, value]) => (
              <TableCell key={key}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
