import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AuditCategory } from '@/lib/marketingAuditTypes';

interface AuditRadarChartProps {
  categories: AuditCategory[];
}

export const AuditRadarChart = ({ categories }: AuditRadarChartProps) => {
  const data = categories.map(cat => ({
    category: cat.name.replace(' y ', '\ny ').replace(' (CRO)', '\n(CRO)'),
    score: cat.score,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Puntuación"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
