import { motion } from "framer-motion";

export const SynergyTable = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const rows = [
    {
      fase: "Planificación",
      orquest: "✅",
      kairoshr: "–",
      resultado: "Turnos óptimos basados en IA"
    },
    {
      fase: "Control de presencia",
      orquest: "⚠️ Básico",
      kairoshr: "✅ Legal",
      resultado: "Cumplimiento garantizado"
    },
    {
      fase: "Firma digital",
      orquest: "⚠️ Simple",
      kairoshr: "✅ Certificada",
      resultado: "Seguridad jurídica total"
    },
    {
      fase: "Nóminas y asesoría",
      orquest: "–",
      kairoshr: "✅",
      resultado: "Cierre laboral automatizado"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16"
          {...fadeInUp}
        >
          Cómo se complementan
        </motion.h2>
        
        <motion.div 
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-soft rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Fase</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Orquest</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">KairosHR</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Resultado</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {rows.map((row, index) => (
                    <motion.tr
                      key={row.fase}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={index % 2 === 0 ? "" : "bg-muted/30"}
                    >
                      <td className="px-6 py-4 font-semibold">{row.fase}</td>
                      <td className="px-6 py-4 text-center text-lg">{row.orquest}</td>
                      <td className="px-6 py-4 text-center text-lg">{row.kairoshr}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.resultado}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
