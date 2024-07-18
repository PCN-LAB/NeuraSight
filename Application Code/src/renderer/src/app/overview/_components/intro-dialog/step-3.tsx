import { Button } from '@/components/ui/button'

export const Step3 = ({ setIndex }: { setIndex: (index: number) => void }) => {
  return (
    <div className="animate-fade-in w-[75%] flex flex-col items-center gap-16">
      <p className="text-white text-3xl">
        Just one last thing before we get started, let&apos;s perform some{' '}
        <span className="underline underline-offset-[12px] font-semibold text-rose-500">
          preprocessing
        </span>
        {'  '}
        <span className="-ml-1">.</span>
      </p>

      <Button
        className="animate-fade-in w-32 justify-self-center bg-slate-100 text-slate-900 hover:bg-slate-400"
        onClick={async () => {
          setIndex(3)
        }}
      >
        Continue
      </Button>
    </div>
  )
}
