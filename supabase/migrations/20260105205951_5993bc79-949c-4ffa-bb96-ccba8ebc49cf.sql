-- Populate detailed content for all 12 resources

-- 1. Checklist: 15 Deducciones Fiscales
UPDATE resources SET
  benefits = ARRAY[
    'Identifica deducciones que tu empresa podría estar dejando de aplicar',
    'Ahorra hasta un 30% en tu próxima declaración del Impuesto de Sociedades',
    'Lista verificable paso a paso para tu equipo contable',
    'Incluye requisitos documentales para cada deducción',
    'Evita errores que pueden generar sanciones de Hacienda',
    'Maximiza los beneficios fiscales de tus inversiones en I+D+i'
  ],
  target_audience = ARRAY[
    'Directores financieros y CFOs',
    'Empresarios y autónomos',
    'Asesores fiscales y contables',
    'Controllers financieros'
  ],
  content = '## ¿Por qué necesitas este checklist?

Cada año, miles de empresas en España dejan de aplicar deducciones fiscales a las que tienen derecho. El motivo principal: desconocimiento o falta de documentación adecuada. Este checklist te ayuda a identificar oportunidades de ahorro fiscal que podrías estar perdiendo.

### Las 15 deducciones que analizamos

Nuestro checklist cubre las deducciones más relevantes para empresas españolas:

1. **Deducción por I+D+i** - Hasta el 42% de los gastos en investigación y desarrollo
2. **Deducciones por creación de empleo** - Por cada incremento de plantilla indefinida
3. **Deducción por contratación de personas con discapacidad** - Beneficios por inclusión laboral
4. **Reserva de capitalización** - Reducción del 10% en base imponible
5. **Reserva de nivelación** - Para pymes con beneficios variables
6. **Deducciones por producciones cinematográficas** - Incentivos del sector audiovisual
7. **Patent Box** - Reducción por cesión de activos intangibles
8. **Deducciones por donativos** - Aportaciones a fundaciones y ONGs
9. **Deducciones medioambientales** - Inversiones en sostenibilidad
10. **Formación profesional** - Gastos en capacitación de empleados

### Cómo usar este checklist

Este documento está diseñado para que tu equipo contable pueda revisar cada deducción de forma sistemática antes del cierre fiscal. Para cada una incluimos:

- **Requisitos de elegibilidad** - ¿Tu empresa cumple los criterios?
- **Documentación necesaria** - Qué documentos debes preparar
- **Plazos importantes** - Fechas clave a tener en cuenta
- **Cuantía de la deducción** - Porcentajes y límites aplicables

### Beneficios de una revisión sistemática

Una revisión fiscal ordenada puede suponer un ahorro significativo. Nuestros clientes han identificado deducciones no aplicadas por valor medio de 15.000€ a 50.000€ anuales simplemente siguiendo este proceso de verificación.

### Próximos pasos

Descarga el checklist, revísalo con tu equipo contable y contacta con nuestros asesores fiscales para validar las deducciones identificadas y asegurar su correcta aplicación.'
WHERE slug = 'checklist-deducciones-fiscales';

-- 2. Guía Completa: Ley Beckham
UPDATE resources SET
  benefits = ARRAY[
    'Comprende todos los requisitos para acogerte al régimen especial',
    'Calcula tu ahorro fiscal real con ejemplos prácticos',
    'Conoce los plazos y procedimientos de solicitud',
    'Evita los errores más comunes en la aplicación',
    'Planifica tu traslado a España con seguridad fiscal',
    'Incluye casos prácticos de diferentes perfiles profesionales'
  ],
  target_audience = ARRAY[
    'Profesionales extranjeros que se trasladan a España',
    'Deportistas y artistas internacionales',
    'Directivos de multinacionales',
    'Emprendedores e inversores internacionales'
  ],
  content = '## ¿Qué es la Ley Beckham?

La Ley Beckham (oficialmente Régimen Especial de Impatriados) permite a profesionales que se trasladan a España tributar a un tipo fijo del 24% sobre sus rentas del trabajo durante 6 años, en lugar del tipo progresivo que puede llegar al 47%.

### Requisitos fundamentales

Para acogerte al régimen especial debes cumplir estos requisitos:

- **No haber sido residente fiscal en España** en los 5 años anteriores al traslado
- **El traslado debe producirse** por un contrato de trabajo, cargo de administrador, o actividad emprendedora
- **El trabajo debe realizarse principalmente en España** (más del 50% del tiempo)
- **Solicitar el régimen dentro de los 6 meses** siguientes al alta en la Seguridad Social

### Ventajas fiscales

El ahorro fiscal puede ser muy significativo:

| Salario Bruto | Tributación Normal | Ley Beckham | Ahorro Anual |
|---------------|-------------------|-------------|--------------|
| 100.000€ | ~37.000€ | ~24.000€ | ~13.000€ |
| 200.000€ | ~82.000€ | ~48.000€ | ~34.000€ |
| 500.000€ | ~225.000€ | ~120.000€ | ~105.000€ |

### Procedimiento de solicitud

El proceso incluye varios pasos:

1. **Obtención del NIE** - Número de Identificación de Extranjero
2. **Alta en Seguridad Social** - Registro como trabajador en España
3. **Presentación del Modelo 149** - Solicitud del régimen especial
4. **Confirmación por Hacienda** - Resolución de la Agencia Tributaria

### Aspectos a considerar

Antes de tomar la decisión, debes valorar:

- **Patrimonio en el extranjero** - Solo tributas por rentas españolas
- **Dividendos y ganancias de capital** - Tratamiento fiscal especial
- **Convenios de doble imposición** - Interacción con tu país de origen
- **Duración del régimen** - 6 años máximo, no renovable

### ¿Es adecuado para ti?

Esta guía incluye un cuestionario de autoevaluación y ejemplos prácticos para diferentes perfiles: directivos, deportistas, emprendedores e inversores. Descárgala para analizar tu situación específica.'
WHERE slug = 'guia-ley-beckham';

-- 3. Calendario Fiscal 2025
UPDATE resources SET
  benefits = ARRAY[
    'Todas las fechas clave del ejercicio fiscal 2025 en un solo documento',
    'Alertas anticipadas para preparar cada obligación',
    'Diferenciación por tipo de empresa y régimen fiscal',
    'Compatible con calendarios digitales (Google, Outlook)',
    'Incluye festivos y días inhábiles que afectan a plazos',
    'Actualizado con los últimos cambios normativos'
  ],
  target_audience = ARRAY[
    'Departamentos de administración y finanzas',
    'Asesores fiscales y gestorías',
    'Autónomos y pequeños empresarios',
    'Controllers y CFOs'
  ],
  content = '## Tu guía definitiva para el cumplimiento fiscal 2025

El incumplimiento de plazos fiscales conlleva recargos automáticos del 1% al 20% más intereses de demora. Este calendario te ayuda a planificar con antelación y evitar sorpresas desagradables.

### Obligaciones trimestrales

**Primer trimestre (hasta 20 de abril)**
- Modelo 303: IVA trimestral
- Modelo 111: Retenciones IRPF trabajadores
- Modelo 115: Retenciones alquileres
- Modelo 130/131: Pagos fraccionados autónomos

**Segundo trimestre (hasta 20 de julio)**
- Mismas obligaciones trimestrales
- Modelo 200: Impuesto sobre Sociedades (hasta 25 de julio)

**Tercer trimestre (hasta 20 de octubre)**
- Obligaciones trimestrales habituales
- Modelo 202: Pago fraccionado Sociedades

**Cuarto trimestre (hasta 30 de enero 2026)**
- Cierre de obligaciones del ejercicio
- Modelo 390: Resumen anual IVA

### Obligaciones anuales destacadas

| Modelo | Descripción | Plazo 2025 |
|--------|-------------|------------|
| 347 | Operaciones con terceros | Febrero |
| 190 | Resumen retenciones | Enero |
| 180 | Retenciones alquileres | Enero |
| 200 | Impuesto Sociedades | Julio |
| 720 | Bienes en extranjero | Marzo |

### Fechas críticas para pymes

Hemos destacado especialmente las fechas que afectan a pequeñas y medianas empresas:

- **Régimen de módulos** - Plazos específicos para estimación objetiva
- **SII (Suministro Inmediato de Información)** - Para empresas obligadas
- **Pagos fraccionados** - Opciones de cálculo y plazos

### Cómo usar este calendario

El documento incluye:

1. **Vista mensual** - Para planificación a corto plazo
2. **Vista trimestral** - Para preparar cierres
3. **Alertas configurables** - Fechas en formato compatible con calendarios digitales
4. **Checklist por obligación** - Documentación necesaria para cada modelo

### Novedades fiscales 2025

Incluimos los cambios normativos que afectan a los plazos y obligaciones de este ejercicio, como las modificaciones en el IVA de determinadas operaciones y los nuevos umbrales para declaraciones informativas.'
WHERE slug = 'calendario-fiscal-2025';

-- 4. Guía Fiscal para Empresas 2025
UPDATE resources SET
  benefits = ARRAY[
    'Visión completa del marco fiscal español para empresas',
    'Novedades legislativas del ejercicio 2025',
    'Estrategias de planificación fiscal legal',
    'Comparativa de formas jurídicas y su fiscalidad',
    'Casos prácticos y ejemplos reales',
    'Recomendaciones de optimización por sector'
  ],
  target_audience = ARRAY[
    'CEOs y directores generales',
    'Directores financieros',
    'Emprendedores que inician actividad',
    'Inversores en empresas españolas'
  ],
  content = '## El marco fiscal español para empresas en 2025

Esta guía proporciona una visión integral de la fiscalidad empresarial en España, desde la elección de la forma jurídica hasta las estrategias de optimización fiscal.

### Impuesto sobre Sociedades

El tipo general del IS en España es del 25%, pero existen tipos reducidos:

| Tipo de empresa | Tipo impositivo |
|-----------------|-----------------|
| General | 25% |
| Pymes (< 1M€ beneficio) | 23% |
| Nuevas empresas (2 primeros años) | 15% |
| Cooperativas fiscalmente protegidas | 20% |
| Entidades sin fines lucrativos | 10% |

### IVA: Régimen general y especiales

El sistema de IVA español contempla tres tipos:

- **Tipo general: 21%** - Aplicable a la mayoría de bienes y servicios
- **Tipo reducido: 10%** - Alimentación, transporte, hostelería
- **Tipo superreducido: 4%** - Productos de primera necesidad

### Retenciones e ingresos a cuenta

Las empresas actúan como retenedores en múltiples situaciones:

- **Trabajadores** - Según tablas de IRPF
- **Profesionales** - 15% (7% para nuevos autónomos)
- **Alquileres** - 19%
- **Dividendos** - 19%

### Planificación fiscal estratégica

Estrategias legales de optimización:

1. **Reserva de capitalización** - Reducción del 10% de la base imponible
2. **Compensación de bases imponibles negativas** - Hasta el 70% de la base positiva
3. **Deducciones por I+D+i** - Hasta el 42% de los gastos
4. **Amortización acelerada** - Para determinados activos

### Obligaciones formales

Calendario de obligaciones por tipo de empresa:

- **Sociedades en SII** - Declaraciones en tiempo real
- **Pymes** - Régimen trimestral estándar
- **Grupos fiscales** - Consolidación fiscal

### Novedades 2025

Este ejercicio trae cambios importantes:

- Modificaciones en el tratamiento de operaciones vinculadas
- Nuevos límites para pagos fraccionados
- Cambios en deducciones medioambientales
- Actualización de coeficientes de amortización

### Recomendaciones por sector

Incluimos secciones específicas para:
- Tecnología y startups
- Comercio electrónico
- Servicios profesionales
- Industria y manufactura'
WHERE slug = 'guia-fiscal-empresas-2025';

-- 5. Cómo Constituir una Empresa en España
UPDATE resources SET
  benefits = ARRAY[
    'Proceso paso a paso desde la idea hasta la inscripción',
    'Comparativa de formas jurídicas con pros y contras',
    'Costes reales y plazos actualizados a 2025',
    'Documentación necesaria con plantillas incluidas',
    'Trámites telemáticos vs presenciales',
    'Errores comunes a evitar en la constitución'
  ],
  target_audience = ARRAY[
    'Emprendedores españoles',
    'Inversores extranjeros',
    'Startups y empresas tecnológicas',
    'Empresas que se expanden a España'
  ],
  content = '## Tu guía completa para crear una empresa en España

Constituir una empresa en España puede hacerse en tan solo 48-72 horas si conoces el proceso. Esta guía te lleva paso a paso desde la decisión inicial hasta la inscripción en el Registro Mercantil.

### Elección de la forma jurídica

Las opciones más habituales y sus características:

| Forma | Capital mínimo | Responsabilidad | Ideal para |
|-------|---------------|-----------------|------------|
| Sociedad Limitada (SL) | 1€ | Limitada | Pymes, startups |
| Sociedad Anónima (SA) | 60.000€ | Limitada | Grandes empresas |
| Sociedad Limitada Nueva Empresa | 3.000-120.000€ | Limitada | Constitución rápida |
| Autónomo | 0€ | Ilimitada | Freelancers |

### Proceso de constitución de una SL

**Paso 1: Certificación negativa de denominación**
- Solicitud al Registro Mercantil Central
- Plazo: 24-48 horas telemático
- Validez: 6 meses

**Paso 2: Apertura de cuenta bancaria**
- Depósito del capital social
- Obtención del certificado bancario

**Paso 3: Redacción de estatutos**
- Objeto social, domicilio, capital
- Órgano de administración
- Régimen de transmisión de participaciones

**Paso 4: Escritura pública ante notario**
- Comparecencia de los socios
- Firma de la escritura de constitución

**Paso 5: Obtención del NIF**
- Modelo 036 ante la Agencia Tributaria
- NIF provisional inmediato

**Paso 6: Inscripción en el Registro Mercantil**
- Plazo: 5-15 días hábiles
- Obtención del NIF definitivo

### Costes aproximados 2025

| Concepto | Coste |
|----------|-------|
| Certificación denominación | 15€ |
| Notaría | 150-400€ |
| Registro Mercantil | 100-150€ |
| Gestoría (opcional) | 300-600€ |
| **Total aproximado** | **600-1.200€** |

### Trámites posteriores obligatorios

Una vez constituida la sociedad:

1. Alta en el IAE (Impuesto de Actividades Económicas)
2. Alta en la Seguridad Social de administradores
3. Comunicación de apertura del centro de trabajo
4. Licencias municipales según actividad
5. Registro de la propiedad industrial (si aplica)

### Opciones de constitución rápida

- **CIRCE/PAE** - Constitución telemática en 48h
- **Notaría con estatutos tipo** - Proceso simplificado
- **Creación con 1€ de capital** - Régimen de formación sucesiva'
WHERE slug = 'guia-constituir-empresa-espana';

-- 6. Plantilla de Acuerdo de Confidencialidad (NDA)
UPDATE resources SET
  benefits = ARRAY[
    'Plantilla profesional revisada por abogados especialistas',
    'Cláusulas adaptables a diferentes situaciones',
    'Versiones unilateral y bilateral incluidas',
    'Explicación de cada cláusula para no juristas',
    'Conforme a la legislación española y europea',
    'Formato editable Word y PDF'
  ],
  target_audience = ARRAY[
    'Empresas en negociaciones comerciales',
    'Startups que buscan inversores',
    'Departamentos de compras y ventas',
    'Profesionales que comparten información sensible'
  ],
  content = '## Protege tu información confidencial

Un Acuerdo de Confidencialidad (NDA) bien redactado es esencial antes de compartir información sensible con terceros. Esta plantilla profesional te proporciona la base legal necesaria.

### ¿Cuándo necesitas un NDA?

Situaciones típicas que requieren protección:

- **Negociaciones de inversión** - Antes de compartir datos financieros
- **Acuerdos comerciales** - Precios, estrategias, clientes
- **Desarrollo de productos** - Prototipos, diseños, código
- **Due diligence en M&A** - Información corporativa sensible
- **Colaboraciones con proveedores** - Procesos y know-how

### Tipos de NDA incluidos

**NDA Unilateral**
Una parte revela información y la otra se compromete a mantenerla confidencial. Ideal para:
- Presentaciones a inversores
- Contratación de proveedores
- Entrevistas con candidatos senior

**NDA Bilateral (Mutuo)**
Ambas partes comparten y protegen información. Adecuado para:
- Joint ventures
- Alianzas estratégicas
- Fusiones y adquisiciones

### Cláusulas esenciales explicadas

**1. Definición de información confidencial**
Qué se considera protegido y qué queda excluido. Incluimos ejemplos concretos para evitar ambigüedades.

**2. Obligaciones de las partes**
- No divulgación a terceros
- Uso limitado al propósito acordado
- Medidas de seguridad exigibles

**3. Excepciones permitidas**
- Información ya pública
- Conocimiento previo demostrable
- Requerimiento legal o judicial

**4. Duración de la confidencialidad**
Plazos recomendados según tipo de información:
- Información técnica: 3-5 años
- Secretos comerciales: indefinido
- Datos financieros: 2-3 años

**5. Consecuencias del incumplimiento**
- Indemnización por daños
- Posibilidad de medidas cautelares
- Jurisdicción y ley aplicable

### Cómo personalizar la plantilla

Cada sección incluye:
- Texto base recomendado
- Alternativas según el caso
- Notas explicativas para no juristas
- Ejemplos de redacción específica

### Validez legal

Esta plantilla cumple con:
- Código Civil español
- Ley de Secretos Empresariales
- Reglamento General de Protección de Datos (RGPD)
- Directiva europea de secretos comerciales'
WHERE slug = 'plantilla-nda';

-- 7. Plantilla de Pacto de Socios
UPDATE resources SET
  benefits = ARRAY[
    'Evita conflictos futuros entre socios con acuerdos claros',
    'Cláusulas esenciales para startups y pymes',
    'Mecanismos de salida y valoración incluidos',
    'Protección del socio minoritario',
    'Regulación del trabajo y dedicación de los socios',
    'Compatible con estatutos sociales estándar'
  ],
  target_audience = ARRAY[
    'Socios fundadores de startups',
    'Empresas familiares',
    'Inversores y business angels',
    'Socios de despachos profesionales'
  ],
  content = '## El documento más importante después de los estatutos

El pacto de socios regula las relaciones entre los propietarios de una empresa más allá de lo que establecen los estatutos. Es un contrato privado que puede marcar la diferencia entre un proyecto exitoso y un conflicto destructor.

### ¿Por qué necesitas un pacto de socios?

Los estatutos son públicos y genéricos. El pacto de socios permite:

- Regular situaciones específicas de tu empresa
- Mantener acuerdos confidenciales entre socios
- Establecer compromisos personales no inscribibles
- Definir mecanismos de resolución de conflictos

### Contenido de la plantilla

**1. Gobierno corporativo**
- Composición del órgano de administración
- Materias reservadas a la junta
- Mayorías reforzadas para decisiones críticas
- Derecho de información de los socios

**2. Transmisión de participaciones**
- Derecho de adquisición preferente
- Cláusula de arrastre (drag-along)
- Cláusula de acompañamiento (tag-along)
- Restricciones de venta a terceros

**3. Valoración de participaciones**
- Métodos de valoración acordados
- Descuentos por iliquidez o minoría
- Procedimiento en caso de desacuerdo
- Valorador independiente

**4. Dedicación y no competencia**
- Exclusividad de los socios ejecutivos
- Prohibición de competencia durante y después
- Régimen de otras actividades permitidas

**5. Situaciones de bloqueo**
- Definición de punto muerto (deadlock)
- Mecanismos de desbloqueo: mediación, ruleta rusa
- Disolución como última opción

**6. Salida de socios**
- Good leaver vs bad leaver
- Vesting de participaciones
- Cláusulas de permanencia mínima
- Valoración diferenciada según causa

### Cláusulas específicas para startups

Incluimos secciones adicionales para empresas tecnológicas:

- **Vesting** - Consolidación progresiva de participaciones
- **Cliff period** - Periodo inicial sin derechos
- **Aceleración** - Eventos que aceleran el vesting
- **Propiedad intelectual** - Cesión de desarrollos a la empresa

### Cláusulas para empresas familiares

Adaptaciones específicas:

- Acceso de familiares a puestos directivos
- Protocolo de incorporación de nuevas generaciones
- Dividendo mínimo garantizado
- Órganos de gobierno familiar

### Cómo usar esta plantilla

1. Revisa todas las cláusulas con tus socios
2. Adapta las que apliquen a vuestra situación
3. Elimina las que no sean relevantes
4. Valida el documento con un abogado
5. Firma ante notario para mayor seguridad'
WHERE slug = 'plantilla-pacto-socios';

-- 8. Due Diligence en Operaciones de M&A
UPDATE resources SET
  benefits = ARRAY[
    'Checklist completo de áreas a revisar en una due diligence',
    'Identificación de red flags y riesgos ocultos',
    'Metodología probada en operaciones reales',
    'Plantillas de solicitud de información',
    'Valoración del impacto de hallazgos en el precio',
    'Casos prácticos de operaciones en España'
  ],
  target_audience = ARRAY[
    'Compradores de empresas',
    'Fondos de private equity',
    'Directores de desarrollo corporativo',
    'Asesores en operaciones de M&A'
  ],
  content = '## Guía práctica para una due diligence efectiva

La due diligence es el proceso de investigación que realiza el comprador antes de adquirir una empresa. Una revisión rigurosa puede revelar problemas ocultos y evitar errores costosos.

### Áreas de revisión

**Due Diligence Financiera**
- Estados financieros de los últimos 3-5 años
- Calidad de los ingresos y EBITDA normalizado
- Working capital y ciclo de conversión
- Deuda financiera y compromisos off-balance
- Proyecciones y planes de negocio

**Due Diligence Fiscal**
- Situación fiscal de la sociedad
- Inspecciones abiertas o riesgo de inspección
- Bases imponibles negativas y deducciones pendientes
- Operaciones vinculadas y precios de transferencia
- Contingencias fiscales no provisionadas

**Due Diligence Legal**
- Estructura societaria y libros de actas
- Contratos mercantiles relevantes
- Litigios en curso y contingencias
- Propiedad intelectual e industrial
- Autorizaciones y licencias

**Due Diligence Laboral**
- Plantilla y costes laborales
- Convenios colectivos aplicables
- Litigios laborales pendientes
- Planes de pensiones y retribución diferida
- Cumplimiento en materia de prevención

### Red flags más comunes

Señales de alerta que detectamos frecuentemente:

| Área | Red Flag | Impacto típico |
|------|----------|----------------|
| Financiera | EBITDA ajustado > 30% del reportado | Reducción de precio |
| Fiscal | Operaciones vinculadas sin documentar | Contingencia fiscal |
| Legal | Cláusulas de cambio de control | Renegociación necesaria |
| Laboral | Falsos autónomos | Regularización y multas |

### Proceso recomendado

**Fase 1: Preparación (1-2 semanas)**
- Definición del alcance
- Solicitud de información inicial
- Configuración del data room

**Fase 2: Revisión documental (3-4 semanas)**
- Análisis de documentación
- Sesiones de Q&A con el vendedor
- Identificación de hallazgos

**Fase 3: Valoración de hallazgos (1-2 semanas)**
- Cuantificación de contingencias
- Ajustes al precio propuestos
- Negociación con vendedor

**Fase 4: Reporting (1 semana)**
- Informe de due diligence
- Recomendaciones para el SPA
- Garantías y representaciones sugeridas

### Impacto en la negociación

Los hallazgos de due diligence afectan a:

- **Precio de compra** - Ajustes por contingencias
- **Estructura de la operación** - Earn-outs, escrows
- **Contrato de compraventa** - Garantías específicas
- **Decisión go/no-go** - Deal breakers identificados

### Plantillas incluidas

- Checklist de solicitud de información por área
- Modelo de informe de due diligence
- Matriz de hallazgos y cuantificación
- Guía de preguntas para sesiones de Q&A'
WHERE slug = 'due-diligence-ma';

-- 9. Protocolo Familiar: Guía de Implementación
UPDATE resources SET
  benefits = ARRAY[
    'Metodología probada para elaborar protocolos familiares',
    'Separación efectiva de familia, propiedad y empresa',
    'Mecanismos de resolución de conflictos familiares',
    'Reglas de acceso y salida de familiares',
    'Gobierno corporativo adaptado a empresas familiares',
    'Planificación de la sucesión generacional'
  ],
  target_audience = ARRAY[
    'Fundadores de empresas familiares',
    'Segunda y tercera generación',
    'Consejos de familia',
    'Asesores de family offices'
  ],
  content = '## Garantiza la continuidad de tu empresa familiar

El 70% de las empresas familiares no sobreviven a la segunda generación. Un protocolo familiar bien diseñado puede marcar la diferencia entre la continuidad y la desaparición.

### ¿Qué es un protocolo familiar?

Es un acuerdo marco que regula las relaciones entre la familia y la empresa, estableciendo:

- Valores y principios compartidos
- Reglas de participación familiar en la empresa
- Órganos de gobierno familiar
- Mecanismos de resolución de conflictos
- Planificación sucesoria

### Los tres círculos

El modelo de los tres círculos identifica los ámbitos a regular:

**Círculo Familia**
- Asamblea familiar
- Consejo de familia
- Formación de las nuevas generaciones
- Actividades familiares compartidas

**Círculo Propiedad**
- Junta de accionistas
- Política de dividendos
- Transmisión de acciones
- Valoración de participaciones

**Círculo Empresa**
- Consejo de administración
- Dirección profesional
- Incorporación de familiares
- Retribución de directivos familiares

### Contenido esencial del protocolo

**1. Preámbulo y valores**
- Historia de la familia empresaria
- Misión, visión y valores
- Compromiso de las generaciones

**2. Órganos de gobierno familiar**
- Asamblea familiar: composición y funciones
- Consejo de familia: miembros y competencias
- Comités específicos: formación, patrimonio

**3. Relación familia-empresa**
- Política de empleo de familiares
- Requisitos para ocupar cargos directivos
- Retribución de familiares vs mercado
- Evaluación del desempeño

**4. Propiedad y patrimonio**
- Política de dividendos mínimos
- Restricciones a la transmisión
- Derecho de adquisición preferente
- Financiación para familiares compradores

**5. Sucesión y continuidad**
- Planificación sucesoria del líder
- Identificación y desarrollo de sucesores
- Transición gradual de responsabilidades
- Plan de contingencia

**6. Resolución de conflictos**
- Mediación familiar interna
- Árbitros externos predefinidos
- Mecanismos de última ratio

### Proceso de elaboración

**Fase 1: Diagnóstico (1-2 meses)**
- Entrevistas individuales con familiares
- Análisis de la estructura familiar y empresarial
- Identificación de temas sensibles

**Fase 2: Deliberación (3-6 meses)**
- Sesiones de trabajo familiar
- Construcción de consensos
- Redacción de borradores

**Fase 3: Formalización (1-2 meses)**
- Revisión legal del documento
- Firma del protocolo
- Comunicación a la organización

**Fase 4: Implementación (continuo)**
- Constitución de órganos de gobierno
- Primera asamblea familiar
- Seguimiento y ajustes

### Claves del éxito

Un protocolo efectivo requiere:
- Compromiso genuino de todas las ramas familiares
- Facilitación externa profesional
- Tiempo suficiente para el debate
- Revisión periódica (cada 3-5 años)'
WHERE slug = 'protocolo-familiar-guia';

-- 10. Sucesión en la Empresa Familiar
UPDATE resources SET
  benefits = ARRAY[
    'Planificación fiscal de la sucesión empresarial',
    'Optimización del Impuesto sobre Sucesiones',
    'Requisitos para la reducción del 95% en empresa familiar',
    'Alternativas: donación vs herencia',
    'Estructuras holding para la sucesión',
    'Casos prácticos con ejemplos numéricos'
  ],
  target_audience = ARRAY[
    'Empresarios en fase de sucesión',
    'Herederos de empresas familiares',
    'Asesores fiscales especializados',
    'Family officers'
  ],
  content = '## Planifica la sucesión para preservar el patrimonio familiar

La transmisión de la empresa familiar a la siguiente generación puede suponer una carga fiscal significativa si no se planifica adecuadamente. Conocer las opciones disponibles es esencial.

### Marco fiscal de la sucesión

La transmisión de una empresa puede tributar por:

**Impuesto sobre Sucesiones y Donaciones**
- Competencia autonómica con grandes diferencias
- Tipos desde el 7,65% al 34%
- Multiplicadores por parentesco y patrimonio preexistente
- Bonificaciones en algunas comunidades autónomas

**Reducción del 95% en empresa familiar**
Permite reducir la base imponible en un 95% si se cumplen requisitos:

| Requisito | Descripción |
|-----------|-------------|
| Porcentaje de participación | 5% individual o 20% grupo familiar |
| Funciones directivas | El causante/donante o familiar ejercía funciones |
| Retribución | Más del 50% de los rendimientos del trabajo |
| Mantenimiento | 10 años por los herederos |

### Donación vs herencia

**Ventajas de la donación en vida**
- Control del proceso por el empresario
- Posibilidad de establecer condiciones
- Planificación del momento fiscal óptimo
- Transmisión gradual del poder

**Ventajas de la herencia**
- Actualización fiscal del valor de adquisición
- No tributación en IRPF del donante
- Mantenimiento del control hasta el fallecimiento

### Estructuras de planificación

**Holding familiar**
Ventajas de interponer una sociedad holding:
- Exención por dividendos y plusvalías
- Facilita la sucesión por ramas
- Separación de patrimonio empresarial y personal
- Mejor gobernanza corporativa

**Usufructo y nuda propiedad**
- El empresario mantiene usufructo (control y dividendos)
- Los hijos reciben la nuda propiedad
- Consolidación automática al fallecimiento
- Tributación diferida

### Ejemplo práctico

**Caso: Empresa valorada en 5 millones de euros**

| Escenario | Base imponible | Impuesto estimado |
|-----------|---------------|-------------------|
| Sin planificación | 5.000.000€ | ~1.200.000€ |
| Con reducción 95% | 250.000€ | ~50.000€ |
| Con holding + reducción | 250.000€ | ~35.000€ |

**Ahorro potencial: más de 1 millón de euros**

### Requisitos para mantener la reducción

Durante los 10 años siguientes:
- Mantener el valor de adquisición en la empresa
- No realizar operaciones que minoren sustancialmente
- Mantener el derecho a la exención en Patrimonio
- Los herederos deben mantener la participación

### Planificación temporal

| Plazo | Acción recomendada |
|-------|--------------------|
| 10+ años antes | Constituir holding, reorganizar |
| 5-10 años | Verificar cumplimiento de requisitos |
| 2-5 años | Donaciones progresivas si procede |
| 1-2 años | Revisión final, testamento actualizado |

### Documentación incluida

- Checklist de requisitos para la reducción
- Modelo de cláusulas testamentarias
- Esquema de estructura holding
- Comparativa fiscal por comunidades autónomas'
WHERE slug = 'sucesion-empresa-familiar';

-- 11. Costes de Contratación en España
UPDATE resources SET
  benefits = ARRAY[
    'Desglose completo de costes laborales en España',
    'Comparativa de tipos de contrato y su coste',
    'Calculadora de coste empresa incluida',
    'Bonificaciones y reducciones disponibles',
    'Costes de despido por tipo de contrato',
    'Obligaciones del empleador detalladas'
  ],
  target_audience = ARRAY[
    'Empresas que contratan en España',
    'Departamentos de RRHH',
    'Inversores extranjeros',
    'Startups en fase de contratación'
  ],
  content = '## Todo lo que necesitas saber sobre contratar en España

Contratar empleados en España implica costes significativos más allá del salario bruto. Esta guía te ayuda a calcular el coste real de cada contratación.

### Componentes del coste laboral

**Salario bruto**
El punto de partida de cualquier contratación. Incluye:
- Salario base mensual
- Pagas extraordinarias (mínimo 2 al año)
- Complementos salariales
- Variables y comisiones

**Cotizaciones a la Seguridad Social (empresa)**
La empresa paga aproximadamente un 30% adicional:

| Concepto | Porcentaje |
|----------|------------|
| Contingencias comunes | 23,60% |
| Desempleo | 5,50% |
| FOGASA | 0,20% |
| Formación profesional | 0,60% |
| Accidentes de trabajo | 1,50% (media) |
| **Total empresa** | **~31,40%** |

**Otros costes a considerar**
- Prevención de riesgos laborales
- Reconocimientos médicos
- Formación obligatoria
- Equipamiento y herramientas

### Ejemplo de coste real

**Salario bruto anual: 30.000€**

| Concepto | Importe |
|----------|---------|
| Salario bruto | 30.000€ |
| SS empresa (31,4%) | 9.420€ |
| Otros costes (~5%) | 1.500€ |
| **Coste total empresa** | **~40.920€** |

**El coste real es un 36% superior al salario bruto**

### Tipos de contrato y costes

**Contrato indefinido**
- Indemnización por despido: 33 días/año (máx. 24 mensualidades)
- Bonificaciones disponibles para colectivos específicos
- Mayor estabilidad para el trabajador

**Contrato temporal**
- Indemnización fin de contrato: 12 días/año
- Limitaciones de duración (máx. 12 meses en 18)
- Conversión obligatoria a indefinido tras límites

**Contrato de formación**
- Reducción de cotizaciones significativa
- Requisitos de edad y formación
- Duración mínima 3 meses, máxima 2 años

### Bonificaciones a la contratación

| Colectivo | Bonificación |
|-----------|--------------|
| Jóvenes < 30 años indefinido | 100-137,50€/mes |
| Mayores de 45 años | 125€/mes |
| Personas con discapacidad | 375-600€/mes |
| Víctimas de violencia de género | 125€/mes |

### Costes de finalización

**Despido procedente**
- Incumplimiento grave del trabajador
- Sin indemnización

**Despido improcedente**
- 33 días por año trabajado
- Máximo 24 mensualidades

**Despido objetivo**
- 20 días por año trabajado
- Máximo 12 mensualidades

### Calculadora incluida

El documento incluye una hoja de cálculo para:
- Estimar el coste total de una contratación
- Comparar diferentes escenarios salariales
- Calcular el impacto de bonificaciones
- Proyectar costes de plantilla'
WHERE slug = 'costes-contratacion-espana';

-- 12. Precios de Transferencia
UPDATE resources SET
  benefits = ARRAY[
    'Obligaciones documentales explicadas paso a paso',
    'Métodos de valoración con ejemplos prácticos',
    'Plantillas de documentación transfer pricing',
    'Análisis de comparabilidad simplificado',
    'Riesgos y sanciones por incumplimiento',
    'Novedades normativas 2025'
  ],
  target_audience = ARRAY[
    'Grupos empresariales con filiales',
    'Multinacionales con operaciones en España',
    'Directores financieros de grupos',
    'Asesores fiscales especializados'
  ],
  content = '## Cumple con las obligaciones de precios de transferencia

Las operaciones entre empresas vinculadas deben realizarse a valores de mercado. El incumplimiento puede suponer ajustes fiscales millonarios y sanciones graves.

### ¿Qué son los precios de transferencia?

Son los precios pactados en operaciones entre empresas del mismo grupo:
- Compraventa de bienes
- Prestación de servicios
- Cesión de intangibles
- Operaciones financieras

La normativa exige que estos precios sean similares a los que se pactarían entre partes independientes (principio de plena competencia).

### Obligaciones documentales

**Documentación específica del grupo**
Obligatoria para grupos con facturación > 45M€:
- Estructura organizativa del grupo
- Actividades y funciones de cada entidad
- Intangibles y su propiedad
- Política de precios de transferencia

**Documentación específica del contribuyente**
Para operaciones vinculadas > 250.000€:
- Descripción de la entidad y operaciones
- Análisis de comparabilidad
- Método de valoración utilizado
- Justificación del precio aplicado

**Informe país por país (CbC)**
Para grupos con facturación > 750M€:
- Ingresos por jurisdicción
- Beneficios antes de impuestos
- Impuestos pagados
- Empleados y activos tangibles

### Métodos de valoración

| Método | Descripción | Aplicación típica |
|--------|-------------|-------------------|
| Precio libre comparable | Precio de mercado observable | Commodities, bienes estándar |
| Coste incrementado | Coste + margen habitual | Servicios, manufactura |
| Precio de reventa | Precio venta - margen distribuidor | Distribución |
| Margen neto transaccional | Margen neto comparable | Operaciones complejas |
| Distribución del resultado | Reparto según contribución | Joint ventures, intangibles |

### Análisis de comparabilidad

Pasos para justificar el precio de mercado:

1. **Caracterización de la operación**
   - Funciones realizadas
   - Activos utilizados
   - Riesgos asumidos

2. **Búsqueda de comparables**
   - Bases de datos especializadas
   - Operaciones internas comparables
   - Información pública de mercado

3. **Ajustes de comparabilidad**
   - Diferencias en términos contractuales
   - Características de los productos
   - Circunstancias económicas

4. **Determinación del rango intercuartil**
   - Rango de precios aceptables
   - Mediana como referencia

### Riesgos de incumplimiento

**Ajuste fiscal**
- Hacienda puede ajustar el precio al valor de mercado
- Tributación adicional + intereses de demora

**Sanciones**
- Infracción grave: multa del 15% del ajuste
- Falta de documentación: multa fija + % sobre operaciones

**Doble imposición**
- Riesgo de tributar en dos jurisdicciones
- Procedimientos amistosos para resolución

### Contenido del documento

- Guía paso a paso de documentación
- Plantillas editables (Master File y Local File)
- Ejemplos de análisis funcional
- Checklist de cumplimiento
- Calendario de obligaciones 2025'
WHERE slug = 'precios-transferencia';