import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Shield, Link } from "lucide-react";

export const BenefitsGrid = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Reduce tiempo administrativo",
      description: "Automatiza procesos repetitivos y dedica más tiempo a tu negocio.",
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: CheckCircle,
      title: "Cumple con la normativa",
      description: "Registro de jornada legal, firma certificada y trazabilidad completa.",
      color: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: Shield,
      title: "Evita sanciones laborales",
      description: "Sistema homologado que minimiza riesgos legales y multas.",
      color: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      icon: Link,
      title: "Integración total",
      description: "Planificación y documentación en un mismo flujo de trabajo.",
      color: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Beneficios de la integración
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full hover:shadow-lg transition-shadow ${benefit.color}`}>
                  <CardContent className="p-8">
                    <div className="mb-4">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
