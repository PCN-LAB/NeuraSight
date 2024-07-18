import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export const Step1 = ({ setIndex }: { setIndex: (index: number) => void }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="flex flex-col items-center gap-4 animate-fade-in ">
        <span className="text-[16px] font-light text-zinc-400">Welcome to</span>
        <div className="-mt-3">
          <span className="text-4xl font-bold text-white">Neura</span>
          <span className="text-4xl font-normal text-white">Sight</span>
        </div>
        <div className="text-md font-light text-zinc-300">
          Empowering Banks to always stay ahead of frauds
        </div>
      </div>

      <Button
        className="animate-fade-in mt-5 w-32 justify-self-center bg-slate-100 text-slate-900 hover:bg-slate-400"
        onClick={() => setIndex(1)}
      >
        Continue
      </Button>

      {/* TODO Add functionality to hide the intro screen next time (save preference in local storage) */}
      <div className="animate-fade-in flex items-center space-x-2 text-white mt-10">
        <Checkbox id="terms" className="border-white" />
        <label
          htmlFor="terms"
          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Don&apos;t show intro screen next time.
        </label>
      </div>
    </div>
  )
}
