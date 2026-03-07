import { Bot, Newspaper, Languages, ScanLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIUsageStats } from '@/hooks/useAIUsageStats';
import { Skeleton } from '@/components/ui/skeleton';

export const AIUsageStatsWidget = () => {
  const { data: stats, isLoading } = useAIUsageStats();

  const cards = [
    {
      title: 'Artículos IA',
      value: stats?.articlesGenerated ?? 0,
      subtitle: `${stats?.articlesLast30Days ?? 0} últimos 30 días`,
      icon: Bot,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      title: 'Noticias IA',
      value: stats?.newsCreated ?? 0,
      subtitle: `${stats?.newsLast30Days ?? 0} últimos 30 días`,
      icon: Newspaper,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Traducciones',
      value: stats?.translationsCompleted ?? 0,
      subtitle: `${stats?.translationsLast30Days ?? 0} últimos 30 días`,
      icon: Languages,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Auditorías',
      value: stats?.auditsCompleted ?? 0,
      subtitle: `${stats?.auditsLast30Days ?? 0} últimos 30 días`,
      icon: ScanLine,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-slate-400" />
        <h2 className="text-base font-medium text-slate-900">Inteligencia Artificial</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-900">{card.value}</div>
              <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
