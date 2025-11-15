import { Building2, Users, Award, Clock } from 'lucide-react';

export const TrustBar = () => {
  const stats = [
    {
      icon: Building2,
      value: '500+',
      label: 'Companies Registered',
    },
    {
      icon: Clock,
      value: '25',
      label: 'Years Experience',
    },
    {
      icon: Users,
      value: '50+',
      label: 'Countries Served',
    },
    {
      icon: Award,
      value: '99%',
      label: 'Success Rate',
    },
  ];

  return (
    <div className="border-y border-border bg-muted/30 py-8">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
