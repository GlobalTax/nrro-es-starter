

## Plan: Textos legales completos Ley 2/2023

### Objetivo
Ampliar la seccion "Informacion Legal Importante" (lineas 455-489) del archivo `src/pages/WhistleblowerChannel.tsx` con textos legales completos segun la Ley 2/2023, incluyendo plazos, derechos del denunciante y obligaciones del canal.

### Cambios

**Archivo:** `src/pages/WhistleblowerChannel.tsx`

Se reemplaza la Card de "Informacion Legal Importante" actual (que solo tiene un parrafo generico) por una seccion legal completa con las siguientes subsecciones usando Accordion para organizar el contenido:

1. **Marco legal aplicable** - Ley 2/2023 y Directiva UE 2019/1937, ambito de aplicacion
2. **Plazos de tramitacion** - Acuse de recibo (7 dias habiles), resolucion maxima (3 meses), ampliacion excepcional a 6 meses
3. **Derechos del denunciante** - Confidencialidad (art. 33), proteccion frente a represalias (art. 36), asistencia juridica, inversion de la carga de la prueba
4. **Proteccion frente a represalias** - Definicion de represalias prohibidas segun art. 36.2 (despido, suspension, discriminacion, etc.)
5. **Proteccion de datos** - Responsable del tratamiento, finalidad, conservacion, derechos RGPD
6. **Infracciones denunciables** - Ambito material segun art. 2 (contratacion publica, servicios financieros, seguridad, medio ambiente, etc.)

### Detalles tecnicos

- Importar `Accordion, AccordionContent, AccordionItem, AccordionTrigger` de `@/components/ui/accordion`
- Importar iconos adicionales: `Scale, FileText, Users, Lock` de `lucide-react`
- Reemplazar las lineas 455-489 con la nueva seccion legal expandida
- Mantener el mismo estilo visual (Card con borde primary/20)
- Usar Accordion tipo "multiple" para que se puedan abrir varias secciones a la vez

