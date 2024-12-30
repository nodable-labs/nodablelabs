import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface AssistantCountChartProps {
  data: {
    name: string
    value: number
  }[]
}

export const assistantTypeLabels: Record<string, string> = {
  'appointment_callback': 'Appointment',
  'inbound_afterhours_existing': 'After Hours Inbound',
  'inbound_afterhours_new': 'After Hours New Customer',
  'inbound_existing': 'Inbound',
  'inbound_new': 'New Customer',
  'outbound_afterhours_existing': 'After Hours Outbound',
  'outbound_existing': 'Outbound',
  'triggered_outbound_existing': 'Requested Call from SMS'
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null

  const data = payload[0]
  return (
    <div className="glass-panel bg-white/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-lg">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">{data.payload.name}</span>
        <span className="text-sm font-medium">{data.value.toLocaleString()} calls</span>
      </div>
    </div>
  )
}

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, index: number) => (
        <text
          key={index}
          x={0}
          y={index * 12}
          dy={12}
          textAnchor="middle"
          fill="#64748B"
          fontSize={12}
        >
          {word}
        </text>
      ))}
    </g>
  );
};

export function AssistantCountChart({ data }: AssistantCountChartProps) {
  return (
    <Card className="glass-panel interactive cursor-pointer h-[400px]">
      <CardHeader>
        <CardTitle className="text-gray-900">Assistant Types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 h-[calc(100%-65px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 40, bottom: 0 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis 
              dataKey="name" 
              height={60}
              interval={0}
              tick={<CustomXAxisTick />}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => value.toLocaleString()}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#74E0BB"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}