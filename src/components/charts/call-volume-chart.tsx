import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { format, differenceInDays, startOfWeek, endOfWeek, addDays, addWeeks } from "date-fns"
import type { CallVolumeDataPoint } from "@/lib/data-utils"
import { DateRange } from 'react-day-picker';
interface CallVolumeChartProps {
  data: CallVolumeDataPoint[]
  dateRange: DateRange | undefined
}

const volumeColors = {
  "Inbound": "#74E0BB",
  "Outbound": "#293AF9"
}

const HeaderLegend = () => {
  return (
    <div className="flex justify-center gap-6">
      {Object.entries(volumeColors).map(([name, color]) => (
        <div key={name} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-600">{name}</span>
        </div>
      ))}
    </div>
  )
}

export function CallVolumeChart({ data, dateRange }: CallVolumeChartProps) {

  if (!data?.length) {
    return (
      <Card className="glass-panel interactive cursor-pointer">
        <CardHeader>
          <CardTitle className="text-gray-900">Call Volume</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[160px]">
          <p className="text-gray-500">No data available for selected date range</p>
        </CardContent>
      </Card>
    )
  }

  const getTimeFormatter = () => {
    if (!dateRange?.from || !dateRange?.to) return (time: string) => format(new Date(time), 'MMM dd')
    
    const diffDays = differenceInDays(dateRange.to, dateRange.from)
    
    return (time: string) => {
      try {
        const date = new Date(time)
        if (diffDays <= 2) {
          return format(date, 'HH:mm')
        } else if (diffDays <= 14) {
          return format(date, 'MMM dd')
        } else {
          return format(date, 'MMM dd')
        }
      } catch (e) {
        console.warn('Error formatting date:', time)
        return time
      }
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    let dateDisplay
    try {
      const dataPoint = payload[0].payload
      const startDate = new Date(dataPoint.timestamp)
      const diffDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0

      if (diffDays <= 2) {
        dateDisplay = format(startDate, 'MMM dd, HH:mm')
      } else if (diffDays <= 14) {
        dateDisplay = format(startDate, 'MMM dd')
      } else {
        const endDate = dataPoint.weekEnd ? new Date(dataPoint.weekEnd) : startDate
        dateDisplay = `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')}`
      }
    } catch (e) {
      console.error('Error in CustomTooltip:', e)
      return null
    }

    return (
      <div className="glass-panel bg-white/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-lg">
        <p className="text-sm font-medium mb-2">{dateDisplay}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: volumeColors[entry.name as keyof typeof volumeColors] }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-medium">{entry.value} calls</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-6">
        {payload.map((entry: any) => (
          <div key={entry.value} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="glass-panel interactive cursor-pointer h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900">Call Volume</CardTitle>
        <HeaderLegend />
      </CardHeader>
      <CardContent className="flex-1 h-[calc(100%-65px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#74E0BB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#74E0BB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#293AF9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#293AF9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timestamp"
              tickFormatter={getTimeFormatter()}
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              height={45}
              interval="preserveEnd"
              minTickGap={30}
              tickMargin={8}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel bg-white/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-lg">
                      <p className="text-sm font-medium mb-2">{data.formattedDate}, {data.formattedHour}</p>
                      <div className="space-y-1.5">
                        <p className="text-sm">Inbound: {data.Inbound} calls</p>
                        <p className="text-sm">Outbound: {data.Outbound} calls</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="Inbound"
              stroke="#74E0BB"
              fill="url(#inboundGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Outbound"
              stroke="#293AF9"
              fill="url(#outboundGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}