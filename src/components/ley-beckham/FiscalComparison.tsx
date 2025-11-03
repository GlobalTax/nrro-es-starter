import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

export const FiscalComparison = () => {
  const comparisons = [
    {
      income: "60.000 €",
      irpfGeneral: "14.910 €",
      irpfRate: "24,85%",
      beckham: "14.400 €",
      beckhamRate: "24%",
      savings: "510 €",
      savingsPercent: "3,4%"
    },
    {
      income: "100.000 €",
      irpfGeneral: "32.010 €",
      irpfRate: "32,01%",
      beckham: "24.000 €",
      beckhamRate: "24%",
      savings: "8.010 €",
      savingsPercent: "25%"
    },
    {
      income: "150.000 €",
      irpfGeneral: "54.760 €",
      irpfRate: "36,51%",
      beckham: "36.000 €",
      beckhamRate: "24%",
      savings: "18.760 €",
      savingsPercent: "34,3%"
    },
    {
      income: "200.000 €",
      irpfGeneral: "77.510 €",
      irpfRate: "38,76%",
      beckham: "48.000 €",
      beckhamRate: "24%",
      savings: "29.510 €",
      savingsPercent: "38,1%"
    },
    {
      income: "300.000 €",
      irpfGeneral: "123.010 €",
      irpfRate: "41,00%",
      beckham: "72.000 €",
      beckhamRate: "24%",
      savings: "51.010 €",
      savingsPercent: "41,5%"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            Ahorro Fiscal
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            Comparativa: IRPF General vs. Ley Beckham
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Descubre cuánto puedes ahorrar según tu nivel de ingresos
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-normal">Ingresos Anuales</TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span>IRPF General</span>
                        <TrendingUp className="w-4 h-4 text-destructive" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span>Ley Beckham</span>
                        <TrendingDown className="w-4 h-4 text-primary" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-normal">Ahorro Anual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisons.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-normal">{row.income}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col gap-1">
                          <span className="font-normal text-destructive">{row.irpfGeneral}</span>
                          <Badge variant="outline" className="text-xs">
                            {row.irpfRate}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col gap-1">
                          <span className="font-normal text-primary">{row.beckham}</span>
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            {row.beckhamRate}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col gap-1">
                          <span className="font-normal text-lg text-primary">{row.savings}</span>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            -{row.savingsPercent}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="bg-neutral-50 border border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-normal mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                  IRPF General (Régimen Ordinario)
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tipos progresivos del 19% al 47%</li>
                  <li>• Tributación sobre renta mundial</li>
                  <li>• Obligaciones declarativas complejas</li>
                  <li>• Impuesto sobre el Patrimonio aplicable</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-neutral-50 border border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-normal mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  Ley Beckham (Régimen Especial)
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tipo fijo del 24% hasta 600.000€</li>
                  <li>• Solo rentas de fuente española</li>
                  <li>• Simplificación administrativa</li>
                  <li>• Exención de Impuesto sobre el Patrimonio</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">
            * Cálculos aproximados para rentas del trabajo en 2024. No incluyen deducciones autonómicas ni otras variables individuales.
            Consulta tu caso específico con nuestros expertos.
          </p>
        </div>
      </div>
    </section>
  );
};
