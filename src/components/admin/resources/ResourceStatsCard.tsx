import { FileText, Check, Star, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResourceStats } from "@/hooks/useAdminResources";
import { Skeleton } from "@/components/ui/skeleton";

export const ResourceStatsCard = () => {
  const { data: stats, isLoading } = useResourceStats();

  const statItems = [
    {
      title: "Total Recursos",
      value: stats?.total ?? 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Activos",
      value: stats?.active ?? 0,
      icon: Check,
      color: "text-green-500",
    },
    {
      title: "Destacados",
      value: stats?.featured ?? 0,
      icon: Star,
      color: "text-amber-500",
    },
    {
      title: "Descargas Totales",
      value: stats?.downloads ?? 0,
      icon: Download,
      color: "text-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
