import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  title?: string;
}

export default function Chart({ data, xKey, yKey, title }: ChartProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      {title && (
        <div className="mb-3 text-xs font-medium text-stone-600">{title}</div>
      )}
      <div className="h-60">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#f5f5f4" />
            <XAxis dataKey={xKey} stroke="#a8a29e" fontSize={11} />
            <YAxis stroke="#a8a29e" fontSize={11} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#44403c"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
