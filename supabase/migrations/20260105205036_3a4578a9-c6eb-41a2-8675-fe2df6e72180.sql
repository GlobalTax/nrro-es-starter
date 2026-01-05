-- Actualizar contenido explicativo para todos los recursos

-- 1. Checklist: 15 Deducciones Fiscales
UPDATE public.resources SET
  benefits = ARRAY[
    'Identifica deducciones fiscales que tu empresa podría estar perdiendo',
    'Lista verificable para revisar con tu equipo contable',
    'Ahorra tiempo en la planificación fiscal anual',
    'Reduce legalmente tu carga tributaria',
    'Incluye ejemplos prácticos de cada deducción'
  ],
  target_audience = ARRAY[
    'Directores financieros y CFOs',
    'Empresarios y autónomos',
    'Responsables de contabilidad',
    'Asesores fiscales'
  ],
  content = '## ¿Por qué necesitas este checklist?

Cada año, miles de empresas en España pierden dinero por no aplicar correctamente todas las deducciones fiscales a las que tienen derecho. Este checklist te ayuda a identificar oportunidades de ahorro fiscal que quizás estés pasando por alto.

### ¿Qué incluye?

Este documento práctico contiene **15 deducciones fiscales clave** que toda empresa debería revisar:

- **Deducciones por I+D+i**: Cómo aplicar correctamente los incentivos fiscales por innovación
- **Gastos de representación**: Límites y requisitos para su deducibilidad
- **Amortizaciones aceleradas**: Cuándo y cómo aplicarlas
- **Provisiones deducibles**: Tipos permitidos y documentación necesaria
- **Gastos financieros**: Limitaciones y excepciones actuales

### Cómo usar este checklist

1. **Revísalo con tu equipo contable** antes del cierre fiscal
2. **Marca cada punto** que ya estés aplicando
3. **Identifica oportunidades** en los puntos no marcados
4. **Consulta con un asesor** para los casos más complejos

### Beneficio inmediato

Con este checklist podrás realizar una auditoría rápida de tu situación fiscal y detectar áreas de mejora antes de la presentación del Impuesto sobre Sociedades.'
WHERE slug = 'checklist-deducciones-fiscales';

-- 2. Guía Completa: Ley Beckham
UPDATE public.resources SET
  benefits = ARRAY[
    'Entiende todos los requisitos para acogerte al régimen',
    'Calcula el ahorro fiscal potencial con ejemplos reales',
    'Conoce el proceso de solicitud paso a paso',
    'Evita errores comunes que pueden invalidar tu solicitud',
    'Incluye casos prácticos de profesionales y deportistas'
  ],
  target_audience = ARRAY[
    'Profesionales extranjeros que se trasladan a España',
    'Empresas que contratan talento internacional',
    'Deportistas y artistas',
    'Asesores de movilidad internacional'
  ],
  content = '## ¿Qué es la Ley Beckham?

La Ley Beckham (oficialmente Régimen Especial de Impatriados) permite a los trabajadores que se trasladan a España tributar a un tipo fijo del **24%** sobre sus rentas del trabajo, en lugar del tipo progresivo general que puede llegar al 47%.

### ¿Quién puede beneficiarse?

Para acogerte a este régimen especial debes cumplir varios requisitos:

- No haber sido residente fiscal en España en los **10 años anteriores**
- El traslado debe ser consecuencia de un **contrato de trabajo** o del nombramiento como administrador
- Los trabajos deben realizarse **efectivamente en España**
- No obtener rentas a través de un establecimiento permanente en España

### Contenido de la guía

Esta guía completa incluye:

1. **Análisis detallado de requisitos** con interpretaciones de la DGT
2. **Proceso de solicitud** con modelos y plazos
3. **Cálculo del ahorro fiscal** con simulaciones comparativas
4. **Obligaciones formales** durante la vigencia del régimen
5. **Casos especiales**: teletrabajo, stock options, bonus diferidos

### ¿Cuánto puedes ahorrar?

Para un salario de 150.000€, el ahorro puede superar los **25.000€ anuales** durante los 6 años que dura el régimen.'
WHERE slug = 'guia-ley-beckham';

-- 3. Calendario Fiscal 2025
UPDATE public.resources SET
  benefits = ARRAY[
    'Todas las fechas clave del ejercicio fiscal 2025',
    'Obligaciones mensuales, trimestrales y anuales',
    'Alertas para evitar sanciones por presentación tardía',
    'Diferenciado por tipo de empresa y régimen fiscal',
    'Formato descargable para tu calendario'
  ],
  target_audience = ARRAY[
    'Departamentos de administración',
    'Controllers y CFOs',
    'Asesores fiscales y contables',
    'Emprendedores y autónomos'
  ],
  content = '## Nunca más olvides una fecha fiscal

El incumplimiento de plazos fiscales puede suponer recargos del 1% al 20% según el retraso, además de posibles sanciones. Este calendario te ayuda a planificar con antelación todas tus obligaciones tributarias.

### ¿Qué incluye el calendario?

Hemos recopilado **todas las fechas fiscales relevantes** para empresas en España:

- **Impuestos mensuales**: Retenciones (mod. 111, 115, 123), IVA grandes empresas
- **Impuestos trimestrales**: IVA, pagos fraccionados IS, retenciones IRPF
- **Declaraciones anuales**: Impuesto sobre Sociedades, resúmenes anuales
- **Obligaciones informativas**: Modelo 347, 349, 720, declaración de bienes

### Organizado por meses

Cada mes incluye:

1. **Fechas límite** claramente marcadas
2. **Modelos a presentar** con descripción breve
3. **Quién está obligado** (sociedades, autónomos, ambos)
4. **Consejos prácticos** para la preparación

### Bonus: Alertas configurables

El calendario incluye un sistema de alertas que puedes configurar para recibir recordatorios antes de cada vencimiento.'
WHERE slug = 'calendario-fiscal-2025';

-- 4. Guía Fiscal para Empresas 2025
UPDATE public.resources SET
  benefits = ARRAY[
    'Novedades fiscales del ejercicio 2025 explicadas',
    'Impacto de los cambios en tu empresa',
    'Estrategias de optimización fiscal actualizadas',
    'Comparativa con ejercicios anteriores',
    'Recomendaciones prácticas por sector'
  ],
  target_audience = ARRAY[
    'Directores generales y CEOs',
    'Directores financieros',
    'Responsables fiscales de empresa',
    'Asesores y consultores'
  ],
  content = '## Todo lo que necesitas saber para 2025

El panorama fiscal cambia cada año. Esta guía te mantiene actualizado sobre las novedades que afectan a tu empresa y cómo adaptarte a ellas.

### Principales novedades 2025

Este ejercicio trae cambios significativos que debes conocer:

- **Impuesto sobre Sociedades**: Nuevos tipos reducidos y limitaciones
- **IVA**: Modificaciones en tipos y regímenes especiales
- **Retenciones**: Cambios en porcentajes y bases
- **Incentivos fiscales**: Nuevas deducciones y créditos disponibles

### Estructura de la guía

La guía está organizada en secciones prácticas:

1. **Resumen ejecutivo**: Los 10 cambios más importantes en 2 páginas
2. **Análisis por impuesto**: Detalle de cada modificación
3. **Impacto por tipo de empresa**: Cómo te afecta según tu situación
4. **Calendario de aplicación**: Cuándo entra en vigor cada cambio
5. **Acciones recomendadas**: Qué hacer para adaptarte

### Para quién es esta guía

Especialmente útil si:

- Gestionas la fiscalidad de una PYME o gran empresa
- Necesitas informar al consejo sobre cambios fiscales
- Quieres anticiparte a los cambios antes de que entren en vigor'
WHERE slug = 'guia-fiscal-empresas-2025';

-- 5. Cómo Constituir una Empresa en España
UPDATE public.resources SET
  benefits = ARRAY[
    'Proceso completo de constitución paso a paso',
    'Comparativa de formas jurídicas (SL, SA, SLU...)',
    'Costes reales desglosados y actualizados',
    'Documentación necesaria con plantillas',
    'Trámites posteriores a la constitución'
  ],
  target_audience = ARRAY[
    'Emprendedores nacionales e internacionales',
    'Inversores extranjeros',
    'Startups y empresas tecnológicas',
    'Profesionales que quieren societarizarse'
  ],
  content = '## Tu hoja de ruta para crear una empresa en España

Constituir una sociedad en España puede parecer complejo, pero con la información correcta el proceso es más sencillo de lo que imaginas. Esta guía te acompaña en cada paso.

### ¿Qué forma jurídica elegir?

La elección depende de varios factores:

| Forma | Capital mínimo | Responsabilidad | Ideal para |
|-------|---------------|-----------------|------------|
| SL | 3.000€ | Limitada | PYMEs, startups |
| SA | 60.000€ | Limitada | Grandes empresas |
| SLU | 3.000€ | Limitada | Empresario individual |

### Contenido de la guía

1. **Análisis de formas jurídicas**: Ventajas e inconvenientes de cada una
2. **Proceso de constitución**: Los 7 pasos desde la idea hasta el CIF definitivo
3. **Costes detallados**: Notaría, registro, gestoría, capital social
4. **Documentación**: Checklist completo con modelos
5. **Después de constituir**: Alta en Hacienda, Seguridad Social, licencias

### Plazos realistas

Con toda la documentación preparada:

- **Constitución exprés (CIRCE)**: 48-72 horas
- **Constitución tradicional**: 2-4 semanas
- **Con inversión extranjera**: 4-6 semanas

### Bonus: Errores frecuentes

Incluimos una sección con los **10 errores más comunes** que retrasan o encarecen el proceso, y cómo evitarlos.'
WHERE slug = 'guia-constituir-empresa-espana';

-- 6. Plantilla de Acuerdo de Confidencialidad
UPDATE public.resources SET
  benefits = ARRAY[
    'Plantilla profesional lista para usar',
    'Cláusulas adaptadas a la legislación española',
    'Versiones unilateral y bilateral incluidas',
    'Guía de personalización incluida',
    'Válida para negociaciones y due diligence'
  ],
  target_audience = ARRAY[
    'Empresas en proceso de negociación',
    'Startups buscando inversión',
    'Departamentos legales internos',
    'Profesionales en operaciones M&A'
  ],
  content = '## Protege tu información confidencial

Antes de compartir información sensible con potenciales socios, inversores o compradores, necesitas un Acuerdo de Confidencialidad (NDA) sólido que proteja tus intereses.

### ¿Por qué es esencial?

Un NDA bien redactado:

- **Protege** tu información comercial, técnica y financiera
- **Establece** límites claros sobre el uso de la información
- **Define** consecuencias en caso de incumplimiento
- **Genera** un marco de confianza para la negociación

### Contenido de la plantilla

Este pack incluye **dos versiones** del NDA:

1. **NDA Unilateral**: Cuando solo una parte revela información
2. **NDA Bilateral**: Cuando ambas partes comparten información sensible

### Cláusulas incluidas

Cada plantilla contiene:

- Definición precisa de **información confidencial**
- **Obligaciones** del receptor de la información
- **Excepciones** legalmente reconocidas
- **Duración** de las obligaciones (durante y post-acuerdo)
- **Jurisdicción** y resolución de conflictos
- **Penalizaciones** por incumplimiento

### Cómo personalizarla

La guía adjunta te explica:

- Qué campos debes completar
- Cláusulas opcionales según tu situación
- Cuándo necesitas revisión legal adicional'
WHERE slug = 'plantilla-acuerdo-confidencialidad';

-- 7. Plantilla de Pacto de Socios
UPDATE public.resources SET
  benefits = ARRAY[
    'Modelo completo y profesional',
    'Cláusulas esenciales explicadas una a una',
    'Adaptado a la práctica española actual',
    'Incluye cláusulas de salida y resolución de conflictos',
    'Guía de negociación entre socios'
  ],
  target_audience = ARRAY[
    'Socios fundadores de startups',
    'Empresas familiares en proceso de estructuración',
    'Inversores entrando en el capital',
    'Abogados y asesores corporativos'
  ],
  content = '## El documento que todo socio debería firmar

El Pacto de Socios es un acuerdo privado que regula las relaciones entre los socios más allá de lo que establecen los estatutos. Es la mejor forma de prevenir conflictos futuros.

### ¿Por qué necesitas un Pacto de Socios?

Los estatutos sociales son públicos y tienen limitaciones. El Pacto de Socios permite:

- Regular situaciones que los estatutos no contemplan
- Establecer **compromisos de permanencia** y dedicación
- Definir **mecanismos de salida** ordenados
- Proteger a **socios minoritarios**
- Establecer **órganos de gobierno** adicionales

### Cláusulas incluidas en la plantilla

**Gobierno y gestión:**
- Composición del consejo de administración
- Materias reservadas y mayorías reforzadas
- Política de dividendos

**Transmisión de participaciones:**
- Derecho de adquisición preferente
- Cláusulas de arrastre (drag-along)
- Cláusulas de acompañamiento (tag-along)
- Lock-up y restricciones temporales

**Situaciones de conflicto:**
- Bloqueo en la toma de decisiones
- Incumplimiento de obligaciones
- Cláusulas de salida forzosa

### Bonus: Guía de negociación

Incluimos consejos prácticos para **negociar cada cláusula** según tu posición (mayoritario, minoritario, inversor).'
WHERE slug = 'plantilla-pacto-socios';

-- 8. Due Diligence en Operaciones de M&A
UPDATE public.resources SET
  benefits = ARRAY[
    'Metodología profesional de due diligence',
    'Checklists por área: legal, fiscal, laboral, financiera',
    'Red flags que debes identificar',
    'Cómo estructurar el informe final',
    'Casos prácticos de operaciones reales'
  ],
  target_audience = ARRAY[
    'Directores de desarrollo corporativo',
    'CFOs en procesos de adquisición',
    'Fondos de private equity',
    'Asesores de M&A'
  ],
  content = '## Domina el proceso de Due Diligence

La due diligence es el proceso de investigación que permite conocer la realidad de una empresa objetivo antes de completar una operación de M&A. Un proceso riguroso puede evitar sorpresas costosas.

### ¿Qué aprenderás en este webinar?

Este webinar grabado (45 minutos) cubre:

1. **Planificación del proceso**: Alcance, equipo y cronograma
2. **Áreas de análisis**: Legal, fiscal, laboral, financiera, comercial
3. **Documentación a solicitar**: Checklists completos por área
4. **Análisis de riesgos**: Cómo identificar y cuantificar contingencias
5. **Informe final**: Estructura y presentación de hallazgos

### Contenido descargable adicional

Junto al acceso al webinar recibirás:

- **Checklist de documentación** en Excel editable
- **Plantilla de informe** de due diligence
- **Matriz de riesgos** para cuantificar contingencias
- **Ejemplos de red flags** por categoría

### Ponente

Impartido por nuestro equipo de M&A con experiencia en más de 50 operaciones de compraventa de empresas, desde PYMEs hasta operaciones de más de 100 millones de euros.

### Para quién es este webinar

Especialmente útil si estás considerando:

- Comprar o vender una empresa
- Recibir inversión de un fondo
- Fusionarte con otra compañía'
WHERE slug = 'webinar-due-diligence-ma';

-- 9. Protocolo Familiar: Guía de Implementación
UPDATE public.resources SET
  benefits = ARRAY[
    'Proceso completo de elaboración de un protocolo familiar',
    'Cláusulas esenciales que debe contener',
    'Cómo gestionar las reuniones familiares',
    'Mecanismos de resolución de conflictos',
    'Casos de éxito de empresas familiares'
  ],
  target_audience = ARRAY[
    'Fundadores de empresas familiares',
    'Segunda y tercera generación',
    'Consejos de familia',
    'Asesores de empresa familiar'
  ],
  content = '## La herramienta clave para la continuidad de tu empresa familiar

El Protocolo Familiar es un acuerdo que regula las relaciones entre la familia y la empresa, estableciendo reglas claras para la incorporación de familiares, la transmisión de la propiedad y la resolución de conflictos.

### ¿Por qué necesitas un Protocolo Familiar?

Las estadísticas son claras:

- Solo el **30%** de las empresas familiares sobrevive a la segunda generación
- Solo el **15%** llega a la tercera generación
- El **70%** de los fracasos se debe a **conflictos familiares**, no empresariales

### Contenido del white paper

Esta guía de 25 páginas incluye:

**1. Fundamentos del Protocolo Familiar**
- Qué es y qué no es un protocolo
- Valor legal vs. valor moral
- Cuándo es el momento adecuado para elaborarlo

**2. Proceso de elaboración**
- Fases del proceso (6-12 meses típicamente)
- Rol del facilitador externo
- Cómo involucrar a toda la familia

**3. Contenido esencial**
- Órganos de gobierno familiar
- Política de empleo de familiares
- Política de retribución
- Normas de transmisión de participaciones
- Mecanismos de resolución de conflictos

**4. Implementación y seguimiento**
- Cómo dar vida al protocolo
- Revisiones periódicas
- Formación de las nuevas generaciones

### Casos prácticos incluidos

Analizamos 3 casos reales de empresas familiares españolas y cómo el protocolo les ayudó a superar situaciones de conflicto.'
WHERE slug = 'guia-protocolo-familiar';

-- 10. Sucesión en la Empresa Familiar
UPDATE public.resources SET
  benefits = ARRAY[
    'Plan de sucesión paso a paso',
    'Aspectos fiscales de la transmisión',
    'Cómo preparar al sucesor',
    'Gestión emocional del proceso',
    'Errores frecuentes y cómo evitarlos'
  ],
  target_audience = ARRAY[
    'Fundadores preparando su retiro',
    'Sucesores designados',
    'Familias empresarias en transición',
    'Asesores de empresa familiar'
  ],
  content = '## El reto más importante de la empresa familiar

La sucesión es el momento más crítico en la vida de una empresa familiar. Una transición bien planificada puede asegurar la continuidad; una mal gestionada puede destruir décadas de trabajo.

### ¿Qué aprenderás en este webinar?

Este webinar grabado (60 minutos) aborda todos los aspectos de la sucesión:

**Parte 1: Planificación (20 min)**
- Cuándo empezar a planificar
- Identificación y selección del sucesor
- El papel de la familia vs. el papel de la empresa

**Parte 2: Aspectos legales y fiscales (20 min)**
- Estructuras de transmisión (donación, compraventa, herencia)
- Optimización fiscal de la sucesión
- Pactos sucesorios y su utilidad

**Parte 3: El factor humano (20 min)**
- Preparación del sucesor
- Gestión de la salida del fundador
- Comunicación con empleados y stakeholders

### Material complementario

Con el webinar recibirás:

- **Checklist de sucesión**: 50 puntos a revisar
- **Timeline tipo**: Plan de 3-5 años
- **Guía fiscal**: Opciones de transmisión comparadas

### Ponentes

Mesa redonda con:
- Abogado especialista en empresa familiar
- Asesor fiscal experto en sucesiones
- Consultor de empresas familiares'
WHERE slug = 'webinar-sucesion-empresa-familiar';

-- 11. Costes de Contratación en España
UPDATE public.resources SET
  benefits = ARRAY[
    'Desglose completo del coste real de un empleado',
    'Comparativa por tipo de contrato',
    'Simulador de costes incluido',
    'Bonificaciones y reducciones disponibles',
    'Actualizado con la normativa 2025'
  ],
  target_audience = ARRAY[
    'Directores de RRHH',
    'CFOs y controllers',
    'Empresas extranjeras contratando en España',
    'Startups en fase de crecimiento'
  ],
  content = '## Conoce el coste real de contratar en España

El salario bruto es solo una parte del coste de un empleado. Seguridad Social, formación, prevención de riesgos... Esta guía te ayuda a calcular el coste total real.

### ¿Por qué es importante conocer el coste total?

Muchas empresas, especialmente internacionales, se sorprenden al descubrir que el coste real de un empleado en España puede superar en un **35-40%** el salario bruto acordado.

### Contenido de la guía

**1. Componentes del coste laboral**
- Salario bruto (fijo + variable)
- Seguridad Social a cargo de la empresa (~30%)
- Otros costes: formación, PRL, seguros

**2. Análisis por tipo de contrato**
- Indefinido vs. temporal
- Tiempo completo vs. parcial
- Contratos formativos

**3. Bonificaciones disponibles**
- Contratación indefinida
- Colectivos específicos (jóvenes, mayores 45, discapacidad)
- Conversión de temporales a indefinidos

**4. Herramienta de cálculo**
- Excel descargable con simulador
- Introduce el salario bruto y obtén el coste total
- Compara diferentes escenarios

### Ejemplo práctico

Para un salario bruto de **40.000€/año**:

| Concepto | Importe |
|----------|---------|
| Salario bruto | 40.000€ |
| Seguridad Social empresa | 12.000€ |
| Otros costes | 2.000€ |
| **Coste total anual** | **54.000€** |

### Actualización 2025

Incluye los nuevos tipos de cotización y las bonificaciones vigentes para el ejercicio 2025.'
WHERE slug = 'guia-costes-contratacion-espana';

-- 12. Precios de Transferencia
UPDATE public.resources SET
  benefits = ARRAY[
    'Obligaciones documentales explicadas',
    'Metodología de valoración de operaciones vinculadas',
    'Cómo preparar el Master File y Local File',
    'Riesgos de inspección y cómo mitigarlos',
    'Casos prácticos con la Agencia Tributaria'
  ],
  target_audience = ARRAY[
    'Grupos multinacionales con filiales en España',
    'Directores fiscales de grupos empresariales',
    'CFOs de empresas con operaciones internacionales',
    'Asesores fiscales especializados'
  ],
  content = '## Cumplimiento y optimización en operaciones vinculadas

Los precios de transferencia son una de las principales áreas de atención de las autoridades fiscales en todo el mundo. Una documentación adecuada es tu mejor defensa ante una inspección.

### ¿Qué son los precios de transferencia?

Son los precios a los que las empresas de un mismo grupo realizan operaciones entre sí. La normativa exige que estos precios se fijen como si las partes fueran independientes (principio de plena competencia o "arm''s length").

### Contenido del white paper

Este documento técnico de 30 páginas cubre:

**1. Marco normativo**
- Directrices OCDE
- Normativa española (Art. 18 LIS)
- Obligaciones documentales por umbrales

**2. Documentación obligatoria**
- Master File: Contenido y estructura
- Local File: Análisis de operaciones
- Country-by-Country Report (CbCR)

**3. Metodología de valoración**
- Método del precio libre comparable
- Método del coste incrementado
- Método del precio de reventa
- Métodos basados en el beneficio

**4. Gestión de inspecciones**
- Cómo se desarrolla una comprobación
- Documentación de soporte
- Acuerdos previos de valoración (APA)

### Herramientas incluidas

- **Checklist de documentación** por tipo de operación
- **Plantilla de análisis de comparabilidad**
- **Modelo de política de precios de transferencia**

### Actualizaciones recientes

Incluye los últimos criterios de la Agencia Tributaria y jurisprudencia relevante del TEAC y Audiencia Nacional.'
WHERE slug = 'white-paper-precios-transferencia';