'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect } from 'react'

export const columns: ColumnDef<unknown>[] = [
  {
    accessorKey: 'Timestamp',
    header: () => <div className="">Timestamp</div>,
    cell: ({ row }) => <div className="">{row.getValue('Timestamp')}</div>
  },
  {
    accessorKey: 'From Bank',
    header: () => <div className="">Sender Bank</div>,
    cell: ({ row }) => <div className="">{row.getValue('From Bank')}</div>
  },
  {
    accessorKey: 'Account',
    header: () => <div className="">Sender Account</div>,
    cell: ({ row }) => <div className="text-rose-500">{row.getValue('Account')}</div>
  },
  {
    accessorKey: 'To Bank',
    header: () => <div className="">Receiver Bank</div>,
    cell: ({ row }) => <div className="">{row.getValue('To Bank')}</div>
  },
  {
    accessorKey: 'Receiver Account',
    header: () => <div className="">Receiver Account</div>,
    cell: ({ row }) => <div className="text-rose-500">{row.getValue('Receiver Account')}</div>
  },
  {
    accessorKey: 'Amount Received',
    header: () => <div className="">Amount Received</div>,
    cell: ({ row }) => <div className="">{row.getValue('Amount Received')}</div>
  },
  {
    accessorKey: 'Receiving Currency',
    header: () => <div className="">Receving Currency</div>,
    cell: ({ row }) => <div className="">{row.getValue('Receiving Currency')}</div>
  },
  {
    accessorKey: 'Amount Paid',
    header: () => <div className="">Amount Paid</div>,
    cell: ({ row }) => <div className="">{row.getValue('Amount Paid')}</div>
  },
  {
    accessorKey: 'Payment Currency',
    header: () => <div className="">Payment Currency</div>,
    cell: ({ row }) => <div className="">{row.getValue('Payment Currency')}</div>
  },
  {
    accessorKey: 'Payment Format',
    header: () => <div className="">Payment Format</div>,
    cell: ({ row }) => <div className="">{row.getValue('Payment Format')}</div>
  }
]

export function PredictedFraudsTable() {
  const [datasetPath, setDatasetPath] = React.useState<string>(
    'D:\\FYP\\FYP Scripts (Testing)\\fraud_output.csv'
  )
  const [data, setData] = React.useState<unknown[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  })

  useEffect(() => {
    // if (!activeDataset) return
    const readCsv = async () => {
      const _datasetRows: [] = await window.api.readCsv(datasetPath)
      console.log('Fraudulent Data: ', _datasetRows)
      setData(_datasetRows)
    }
    readCsv()
  }, [datasetPath])

  if (!data)
    return (
      <div className="w-full  justify-center py-[2%] flex items-centers">
        <div className="border border-dotted px-20 py-5 rounded-md font-semibold">
          Your dataset appears here.
        </div>
      </div>
    )

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by Sender Accounts..."
          value={(table.getColumn('Account')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('Account')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <ScrollArea className="h-[470px]">
          <Table>
            <TableHeader className="bg-slate-900 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-white font-normal">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
