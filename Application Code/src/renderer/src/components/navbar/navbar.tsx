import DatasetSwitcher from './components/dataset-switcher'
import { useNavigate } from 'react-router-dom'
import { PiBinoculars } from 'react-icons/pi'
import { PiGraph } from 'react-icons/pi'
import { PiShareNetworkLight } from 'react-icons/pi'
import { Button } from '../ui/button'
import { TaskNotification, useAppStore } from '@/store/app-store'

export default function Navbar() {
  const { activeTab, setActiveTab } = useAppStore()
  const navigate = useNavigate()

  return (
    <nav className="flex h-[8vh] items-center px-5 border-b gap-4">
      <div className="mx-2 flex items-center space-x-6">
        {navLinks.map((link, index) => (
          <Button
            variant={'ghost'}
            key={link.name}
            className={`flex gap-2 align-center border px-5 py-2 rounded-lg hover:bg-gray-800 hover:text-neutral-50
              ${activeTab === index ? 'bg-gray-800' : 'white'} ${activeTab === index ? 'text-neutral-50' : 'text-neutral-900'}`}
            onClick={() => {
              setActiveTab(index)
              navigate(link.href)
            }}
          >
            {link.icon}
            {link.name}
          </Button>
        ))}
      </div>

      <div className="ml-auto flex items-center space-x-4">
        <TasksTracker />
        <DatasetSwitcher />
      </div>
    </nav>
  )
}

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FcOk } from 'react-icons/fc'
import { FcInfo } from 'react-icons/fc'
import { FcHighPriority } from 'react-icons/fc'
import { Separator } from '../ui/separator'
import { Loader2 } from 'lucide-react'

export function TasksTracker() {
  const { isTaskRunning } = useAppStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="">
          <div className="flex gap-2 items-center">
            <Loader2 className={`size-5 animate-spin ${isTaskRunning ? 'block' : 'hidden'} `} />
            <div className="text-slate-700 ">{isTaskRunning ? isTaskRunning : 'No Tasks Running'}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 py-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between -mb-2">
            <div className="font-semibold text-md text-slate-950 ">Tasks History</div>
            {/* <Button variant={'link'} className="size-3 text-sm text-slate-600">Clean</Button> */}
          </div>
          {notifications.map((notification, index) => {
            return (
              <div key={index}>
                <Notification {...notification} />
                {index !== notifications.length - 1 && <Separator className="my-1" />}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const Notification = ({ time, title, msg, msgType }: TaskNotification) => {
  const iconMap = {
    Success: <FcOk className="self-center size-6" />,
    Failed: <FcHighPriority className="self-center size-6" />,
    Warning: <FcInfo className="self-center size-7" />
  }

  return (
    <div className="flex gap-4 py-1">
      {iconMap[msgType]}
      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between">
          <div className="font-medium text-sm text-slate-700">{title}</div>
          <div className="text-xs text-gray-500">{time}</div>
        </div>
        <span className="text-xs">{msg}</span>
      </div>
    </div>
  )
}

const notifications: TaskNotification[] = [
  {
    title: 'GNN Analysis',
    time: 'Just now',
    msgType: 'Success',
    msg: 'Completed Successfully'
  },
  {
    title: 'Motif Detection',
    time: '2 minutes ago',
    msgType: 'Success',
    msg: 'Completed Successfully'
  },
  
]

const navLinks = [
  { name: 'NeuraSight', icon: <PiBinoculars className="size-5 mt-1" />, href: '/' },
  {
    name: 'Motif Detection',
    icon: <PiShareNetworkLight className="size-5 mt-1" />,
    href: '/motif'
  },
  {
    name: 'Graph Neural Network',
    icon: <PiGraph className="size-5 mt-1" />,
    href: '/gnn'
  }
]
