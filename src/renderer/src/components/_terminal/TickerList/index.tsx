import ContentWrapper from '@/components/ContentWrapper'
import KBShortcutLabel from '@/components/KBShortcutLabel'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { KB_SHORTCUT_TICKER_LIST } from '@/lib/consts/UI'
import useKBShortcut from '@/lib/hooks/useKBShortcuts'
import useTickers from '@/lib/hooks/useTickers'
import useTickerVolumes from '@/lib/hooks/useTickerVolumes'
import { useVault } from '@/lib/vault'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { TickerListColumns } from './TickerListColumns'
import { TickerListTable } from './TickerListTable'

const TickerList = (): JSX.Element => {
  const ticker = useVault.use.terminal().ticker
  const { open, setOpen } = useKBShortcut(KB_SHORTCUT_TICKER_LIST)

  const { data: tickerData, isLoading: tickerDataStatus } = useTickers()
  const { data: volumeData, isLoading: volumeDataStatus } = useTickerVolumes()

  if (tickerDataStatus || volumeDataStatus || !tickerData || !volumeData)
    return (
      <div className="h-full place-content-center place-items-center text-center">
        <Spinner />
      </div>
    )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergedData: any[] = []

  for (let i = 0; i < tickerData.length; i++) {
    mergedData.push({
      ...tickerData[i],
      ...volumeData.find((item: { symbol: string }) => item.symbol === tickerData[i].symbol)
    })
  }

  const filteredData = mergedData.filter((ticker) => ticker.state === 'Open')

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="space-x-2">
          <span>{ticker ? `Ticker: ${ticker}` : 'Select a ticker...'}</span>
          <KBShortcutLabel char={KB_SHORTCUT_TICKER_LIST} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[900px] select-none bg-background">
        <ContentWrapper>
          <TickerListTable columns={TickerListColumns} data={filteredData} />
        </ContentWrapper>
      </PopoverContent>
    </Popover>
  )
}

export default TickerList