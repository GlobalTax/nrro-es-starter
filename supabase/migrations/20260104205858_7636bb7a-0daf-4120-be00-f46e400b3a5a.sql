-- Insert 5 new blog articles with real team member authors
-- Using the existing author_id from the system

INSERT INTO public.blog_posts (
  author_id,
  author_name,
  author_specialization,
  title_es,
  slug_es,
  excerpt_es,
  content_es,
  category,
  tags,
  status,
  read_time,
  seo_title_es,
  seo_description_es,
  published_at,
  source_site
) VALUES
-- Article 1: Due Diligence by Samuel L. Navarro
(
  '0aa9233e-5fe3-4901-80ca-b623b4ff01c7',
  'Samuel L. Navarro',
  'M&A y Derecho Mercantil',
  'Due Diligence: Los 5 Errores que Pueden Hundir tu Operación de M&A',
  'due-diligence-errores-operacion-ma',
  'Descubre los errores más comunes en procesos de due diligence y cómo evitarlos para asegurar el éxito de tu operación de M&A.',
  E'## Introducción

La due diligence es el proceso de investigación y análisis que se realiza antes de cerrar una operación de fusión o adquisición. Sin embargo, muchos compradores y vendedores cometen errores que pueden resultar en pérdidas millonarias o en el fracaso total de la operación.

En mi experiencia asesorando operaciones de M&A, he identificado cinco errores recurrentes que pueden hundir incluso las operaciones más prometedoras.

## Error 1: Subestimar el Alcance Temporal

Muchas empresas inician el proceso de due diligence con plazos demasiado ajustados. Una revisión exhaustiva requiere tiempo para:

- Analizar documentación financiera de los últimos 3-5 años
- Revisar contratos con clientes y proveedores clave
- Evaluar contingencias laborales y fiscales
- Identificar riesgos operativos y regulatorios

**Recomendación:** Planifica un mínimo de 4-8 semanas para una due diligence completa, dependiendo del tamaño y complejidad de la empresa objetivo.

## Error 2: Centrarse Solo en los Números

Los estados financieros cuentan solo una parte de la historia. Los compradores que se obsesionan exclusivamente con las cifras pasan por alto aspectos críticos como:

- La calidad del equipo directivo
- La concentración de clientes (si un cliente representa más del 20% de la facturación, es un riesgo)
- La dependencia de proveedores clave
- La cultura organizacional y su compatibilidad

**Caso práctico:** En una reciente operación, detectamos que el 45% de la facturación dependía de un único cliente con contrato renovable anualmente. Este hallazgo redujo significativamente la valoración.

## Error 3: Ignorar las Contingencias Fiscales

Las contingencias fiscales pueden representar pasivos ocultos de gran magnitud. Es fundamental revisar:

- Inspecciones fiscales abiertas o en curso
- Criterios contables agresivos en deducciones
- Operaciones vinculadas y precios de transferencia
- IVA de operaciones intracomunitarias

**Importante:** En España, la Agencia Tributaria puede revisar los últimos 4 años fiscales (5 en caso de bases imponibles negativas pendientes de compensar).

## Error 4: No Verificar la Propiedad Intelectual

En empresas tecnológicas o con marca reconocida, la propiedad intelectual es un activo crítico. Verifica:

- Titularidad de marcas, patentes y dominios
- Contratos de licencia con terceros
- Cesión de derechos de autor por parte de empleados
- Código fuente y su documentación

## Error 5: Descuidar los Aspectos Laborales

Las contingencias laborales pueden emerger después del cierre si no se analizan adecuadamente:

- Contratos de alta dirección con cláusulas de blindaje
- Convenios colectivos aplicables
- Litigios laborales pendientes
- Clasificación correcta de colaboradores (falsos autónomos)

## Conclusión

Una due diligence rigurosa es la mejor inversión para proteger una operación de M&A. No escatimes en tiempo ni recursos: los problemas que no detectes antes del cierre se convertirán en tus problemas después.

**¿Estás preparando una operación de compraventa de empresa?** Contacta con nuestro equipo de M&A para una asesoría especializada.',
  'Mercantil',
  ARRAY['M&A', 'Due Diligence', 'Fusiones', 'Adquisiciones', 'Empresa Familiar'],
  'published',
  7,
  'Due Diligence: 5 Errores Críticos en Operaciones M&A | Navarro',
  'Conoce los 5 errores más comunes en due diligence que pueden arruinar tu operación de M&A y aprende cómo evitarlos con consejos de expertos.',
  NOW() - INTERVAL '2 days',
  'es'
),

-- Article 2: Pactos de Socios by Samuel L. Navarro
(
  '0aa9233e-5fe3-4901-80ca-b623b4ff01c7',
  'Samuel L. Navarro',
  'M&A y Derecho Mercantil',
  'Pactos de Socios: La Herramienta que Toda Empresa Familiar Necesita',
  'pactos-socios-empresa-familiar',
  'Los pactos de socios son esenciales para prevenir conflictos en empresas familiares. Descubre qué cláusulas incluir y cómo estructurarlos.',
  E'## ¿Qué es un Pacto de Socios?

Un pacto de socios (o pacto parasocial) es un contrato privado entre los socios de una empresa que complementa los estatutos sociales. Mientras los estatutos son públicos y se inscriben en el Registro Mercantil, el pacto de socios permanece confidencial entre las partes.

## ¿Por qué es Esencial en Empresas Familiares?

Las empresas familiares tienen dinámicas únicas donde se mezclan relaciones personales, emociones y negocios. El pacto de socios permite:

- Establecer reglas claras antes de que surjan conflictos
- Proteger a socios minoritarios
- Regular la entrada de nuevas generaciones
- Definir mecanismos de salida ordenados

## Cláusulas Fundamentales

### 1. Cláusula de Arrastre (Drag-Along)

Permite al socio mayoritario obligar a los minoritarios a vender sus participaciones en las mismas condiciones cuando recibe una oferta de compra.

**Ejemplo:** Si un fondo de inversión quiere comprar el 100% de la empresa, el socio con el 70% puede obligar al del 30% a vender.

### 2. Cláusula de Acompañamiento (Tag-Along)

Protege al socio minoritario permitiéndole vender en las mismas condiciones cuando el mayoritario vende.

**Protección:** Evita que el minoritario quede atrapado con un nuevo socio desconocido.

### 3. Derecho de Adquisición Preferente

Antes de vender a un tercero, el socio debe ofrecer sus participaciones a los demás socios en las mismas condiciones.

### 4. Cláusulas Anti-Dilución

Protegen el porcentaje de participación ante ampliaciones de capital, especialmente importantes para socios que no pueden aportar más capital.

### 5. Régimen de Distribución de Dividendos

Establecer cuándo y cuánto se distribuirá como dividendos:

- Porcentaje mínimo del beneficio a distribuir
- Condiciones para reinvertir beneficios
- Política de reservas

### 6. Cláusula de No Competencia

Prohíbe a los socios desarrollar actividades competidoras durante su permanencia en la sociedad y durante un periodo posterior a su salida.

### 7. Bloqueo de Situaciones de Punto Muerto (Deadlock)

Cuando hay socios al 50%, es vital establecer mecanismos para resolver desacuerdos:

- Mediación o arbitraje
- Cláusula de ruleta rusa (un socio ofrece comprar o vender a un precio, el otro decide)
- Designación de un tercero dirimente

## Caso Práctico: Empresa Familiar con Segunda Generación

Una empresa familiar fundada por dos hermanos al 50% se enfrenta a la incorporación de la segunda generación. El pacto de socios estableció:

- Los hijos solo pueden ser socios si trabajan en la empresa mínimo 5 años
- Valoración por auditor independiente en caso de salida
- Un consejo de familia para decisiones estratégicas
- Protocolo de sucesión claro

## Conclusión

El mejor momento para firmar un pacto de socios es cuando todos están de acuerdo y las relaciones son buenas. No esperes a que surja el conflicto para intentar regularlo.

**¿Necesitas asesoramiento para elaborar un pacto de socios?** Nuestro equipo puede ayudarte a diseñar un acuerdo a medida.',
  'Mercantil',
  ARRAY['Pactos de Socios', 'Empresa Familiar', 'Gobierno Corporativo', 'Derecho Societario'],
  'published',
  6,
  'Pactos de Socios para Empresas Familiares: Guía Completa | Navarro',
  'Guía completa sobre pactos de socios en empresas familiares: cláusulas esenciales, ejemplos prácticos y cómo prevenir conflictos societarios.',
  NOW() - INTERVAL '5 days',
  'es'
),

-- Article 3: Retribución de Administradores by Clàudia Martin
(
  '0aa9233e-5fe3-4901-80ca-b623b4ff01c7',
  'Clàudia Martin',
  'Fiscalidad',
  'Retribución de Administradores: Optimización Fiscal sin Riesgos',
  'retribucion-administradores-optimizacion-fiscal',
  'La retribución de administradores requiere un tratamiento fiscal específico. Aprende a estructurarla correctamente para evitar contingencias.',
  E'## El Problema de la Retribución de Administradores

La retribución de los administradores de sociedades es uno de los temas fiscales más controvertidos. La Agencia Tributaria presta especial atención a estas remuneraciones, y los errores pueden resultar en:

- No deducibilidad del gasto en el Impuesto sobre Sociedades
- Regularizaciones en IRPF
- Sanciones por retenciones incorrectas

## Marco Legal: Requisitos para la Deducibilidad

Para que la retribución del administrador sea deducible en el Impuesto sobre Sociedades, debe cumplir tres requisitos fundamentales:

### 1. Previsión Estatutaria

Los estatutos deben establecer expresamente:
- Que el cargo es retribuido
- El sistema de retribución (fija, variable, mixta, en especie)
- En caso de retribución variable, los criterios para su determinación

### 2. Aprobación por la Junta General

La Junta General debe aprobar:
- El importe máximo de la retribución anual del conjunto de administradores
- La distribución entre ellos (si hay varios)

### 3. Proporcionalidad

La retribución debe ser proporcionada a:
- La importancia de la sociedad
- La situación económica de la empresa
- Los estándares de mercado para puestos similares

## Administrador vs. Trabajador: La Doble Relación

Cuando el administrador también realiza funciones ejecutivas o técnicas (gerente, director comercial, etc.), surge la polémica sobre la doble relación:

**Doctrina actual del Tribunal Supremo:** Las funciones de alta dirección son inherentes al cargo de administrador y no pueden generar una relación laboral paralela.

**Implicación práctica:** La retribución por funciones directivas debe canalizarse como retribución de administrador, no como salario.

## Estructura Óptima de Retribución

### Componente Fijo

- Cuantía determinada en estatutos o por acuerdo de Junta
- Practicar retención de IRPF según tablas
- Deducible si cumple requisitos formales

### Componente Variable

Puede vincularse a:
- Beneficios de la sociedad (con límites: máximo 10% del beneficio repartible)
- Consecución de objetivos
- Evolución de indicadores

### Retribución en Especie

Posibles elementos:
- Vehículo de empresa
- Seguro médico
- Aportaciones a planes de pensiones
- Vivienda

**Importante:** Debe estar prevista en estatutos y valorarse a precio de mercado.

## Errores Comunes a Evitar

### Error 1: Estatutos Genéricos

"El cargo de administrador será retribuido" → **Insuficiente**

Debe especificar el sistema concreto.

### Error 2: No Actualizar la Junta

Si cambia la retribución, debe aprobarse en Junta cada ejercicio.

### Error 3: Retribuciones Encubiertas

Pagos sin documentar como "servicios profesionales" o a través de sociedades interpuestas.

### Error 4: Desproporción Manifiesta

Retribuciones muy superiores al mercado sin justificación objetiva.

## Plan de Acción Recomendado

1. **Revisar estatutos:** Verificar que contemplan la retribución y su sistema
2. **Documentar acuerdos:** Acta de Junta aprobando la retribución anual
3. **Contrato mercantil:** Formalizar por escrito las condiciones
4. **Comparativa de mercado:** Disponer de datos de retribuciones comparables
5. **Retenciones correctas:** Aplicar retención como rendimiento del trabajo

## Conclusión

La correcta estructuración de la retribución de administradores es fundamental para evitar contingencias fiscales. La planificación preventiva es siempre más económica que las regularizaciones posteriores.

**¿Tienes dudas sobre la retribución de tus administradores?** Consulta con nuestro equipo fiscal.',
  'Fiscal',
  ARRAY['Retribución Administradores', 'Impuesto Sociedades', 'IRPF', 'Fiscalidad', 'Optimización Fiscal'],
  'published',
  8,
  'Retribución de Administradores: Guía Fiscal Completa | Navarro',
  'Guía completa sobre la retribución de administradores: requisitos legales, optimización fiscal y errores a evitar en el Impuesto sobre Sociedades.',
  NOW() - INTERVAL '8 days',
  'es'
),

-- Article 4: Registro de Jornada by Joan Salvo
(
  '0aa9233e-5fe3-4901-80ca-b623b4ff01c7',
  'Joan Salvo',
  'Derecho Laboral',
  'Registro de Jornada 2025: Obligaciones, Novedades y Sanciones',
  'registro-jornada-obligaciones-sanciones-2025',
  'El registro de jornada es obligatorio desde 2019. Conoce las novedades normativas para 2025 y cómo evitar sanciones de la Inspección de Trabajo.',
  E'## Obligación de Registro de Jornada

Desde mayo de 2019, todas las empresas están obligadas a garantizar el registro diario de la jornada de sus trabajadores, incluyendo el horario concreto de inicio y finalización.

Esta obligación afecta a **todas las empresas**, independientemente de su tamaño o sector, y a **todos los trabajadores**, incluidos los que tienen jornada flexible o teletrabajan.

## ¿Qué Debe Registrarse?

El registro debe incluir como mínimo:

- **Hora de inicio** de la jornada
- **Hora de finalización** de la jornada
- Debe realizarse **cada día** de trabajo

Adicionalmente, es recomendable registrar:
- Pausas y descansos
- Horas extraordinarias
- Trabajo en festivos o fines de semana

## Sistemas de Registro Válidos

La normativa no impone un sistema concreto, pero debe ser:

### Sistemas Aceptados

- **Aplicaciones digitales:** Fichaje mediante app móvil o web
- **Sistemas biométricos:** Huella dactilar, reconocimiento facial (con cautelas en protección de datos)
- **Tarjetas magnéticas:** Fichaje en terminal físico
- **Hojas de registro manual:** Firmadas diariamente por el trabajador

### Requisitos del Sistema

1. **Fiabilidad:** Que no pueda manipularse
2. **Accesibilidad:** Disponible para la Inspección de Trabajo
3. **Conservación:** Los registros deben guardarse 4 años

## Novedades para 2025

### Digitalización Obligatoria

El proyecto de Real Decreto en tramitación prevé:

- Obligatoriedad de sistemas digitales (fin del registro en papel)
- Acceso remoto de la Inspección de Trabajo a los registros
- Interoperabilidad con la Seguridad Social

### Incremento de Sanciones

Las sanciones por incumplimiento del registro de jornada se clasifican como:

| Gravedad | Sanción por trabajador |
|----------|----------------------|
| Leve | 60 - 625 € |
| Grave | 626 - 6.250 € |
| Muy Grave | 6.251 - 187.515 € |

La **reincidencia** o la **manipulación de registros** se considera infracción muy grave.

## Casos Especiales

### Teletrabajo

El registro es igualmente obligatorio. Se recomienda:
- Sistemas de fichaje digital accesibles desde casa
- Definir claramente los tiempos de disponibilidad
- Respetar el derecho a la desconexión digital

### Trabajadores con Jornada Flexible

La flexibilidad horaria no exime del registro:
- Debe registrarse la hora real de entrada y salida
- El cómputo se realiza sobre periodos (semanal, mensual)

### Personal de Alta Dirección

Aunque tienen régimen especial, se recomienda también el registro para:
- Control de horas de dedicación
- Posibles reclamaciones futuras

### Trabajadores a Tiempo Parcial

Obligación reforzada:
- Registro de horas ordinarias y complementarias
- Entrega de copia al trabajador junto con la nómina

## Consecuencias del Incumplimiento

### Para la Empresa

1. **Sanciones administrativas** de la Inspección de Trabajo
2. **Presunción de jornada completa** en trabajadores a tiempo parcial
3. **Inversión de la carga de la prueba** en reclamaciones por horas extras

### En Caso de Inspección

La Inspección de Trabajo puede:
- Solicitar los registros de los últimos 4 años
- Entrevistar a trabajadores sobre sus horarios
- Requerir subsanación con plazo
- Levantar acta de infracción

## Plan de Cumplimiento Recomendado

1. **Implementar sistema digital** de registro fiable
2. **Formar a los trabajadores** sobre su uso
3. **Auditar periódicamente** el cumplimiento
4. **Conservar registros** durante 4 años
5. **Negociar con representantes** legales si es necesario

## Conclusión

El registro de jornada ha llegado para quedarse y las inspecciones son cada vez más frecuentes. Implementar un sistema adecuado no solo evita sanciones, sino que aporta transparencia a la relación laboral.

**¿Necesitas asesoramiento sobre registro de jornada?** Contacta con nuestro departamento laboral.',
  'Laboral',
  ARRAY['Registro Jornada', 'Derecho Laboral', 'Inspección Trabajo', 'Control Horario', 'Compliance'],
  'published',
  7,
  'Registro de Jornada 2025: Guía Completa de Obligaciones | Navarro',
  'Todo sobre el registro de jornada obligatorio: sistemas válidos, novedades 2025, sanciones y cómo cumplir con la Inspección de Trabajo.',
  NOW() - INTERVAL '12 days',
  'es'
),

-- Article 5: Valoración de Empresas by Lluis Montanya
(
  '0aa9233e-5fe3-4901-80ca-b623b4ff01c7',
  'Lluis Montanya',
  'M&A y Valoración de Empresas',
  'Valoración de Empresas: Métodos y Consideraciones Prácticas',
  'valoracion-empresas-metodos-guia-practica',
  'Conoce los principales métodos de valoración de empresas y cuándo aplicar cada uno para operaciones de compraventa, sucesión o financiación.',
  E'## ¿Por Qué Valorar una Empresa?

La valoración de empresas es necesaria en múltiples situaciones:

- **Compraventa de empresas** (M&A)
- **Entrada de inversores** o socios
- **Salida de socios** (ejercicio de cláusulas de salida)
- **Sucesión y herencias**
- **Reestructuraciones** y fusiones
- **Obtención de financiación**
- **Disputas judiciales**

El valor de una empresa es subjetivo y depende del contexto, el comprador y el vendedor. No existe un valor único y objetivo.

## Principales Métodos de Valoración

### 1. Métodos Basados en el Balance (Patrimoniales)

Valoran la empresa por sus activos menos sus pasivos.

#### Valor Contable

El más simple: Patrimonio Neto según balance.

**Limitación:** No refleja el valor real de los activos ni los intangibles.

#### Valor Contable Ajustado

Ajusta los activos y pasivos a su valor de mercado:
- Inmuebles a valor de tasación
- Existencias a valor realizable
- Provisiones por contingencias

**Adecuado para:** Empresas patrimoniales, holdings, inmobiliarias.

### 2. Métodos por Múltiplos

Comparan la empresa con transacciones similares en el mercado.

#### Múltiplo de EBITDA

Valor Empresa = EBITDA × Múltiplo sectorial

**Múltiplos habituales por sector:**

| Sector | Múltiplo EBITDA |
|--------|-----------------|
| Tecnología SaaS | 8-15x |
| Industrial | 4-7x |
| Distribución | 3-5x |
| Servicios profesionales | 4-6x |
| Retail | 3-5x |

**Ventaja:** Fácil de aplicar y comunicar.
**Limitación:** Depende de encontrar comparables adecuados.

#### Múltiplo de Ventas

Valor Empresa = Ventas × Múltiplo

Útil para empresas en crecimiento sin beneficios consolidados (startups).

### 3. Descuento de Flujos de Caja (DCF)

Método más riguroso desde el punto de vista financiero.

**Fórmula básica:**

Valor = Σ (FCF / (1+WACC)^n) + Valor Residual

Donde:
- **FCF:** Flujos de caja libres proyectados
- **WACC:** Coste medio ponderado del capital
- **Valor Residual:** Valor de la empresa tras el periodo de proyección

**Adecuado para:** Empresas con flujos predecibles, proyectos de inversión.
**Limitación:** Muy sensible a las hipótesis de crecimiento y tasa de descuento.

### 4. Métodos Mixtos (Goodwill)

Combinan el valor patrimonial con el valor del fondo de comercio (intangibles, marca, clientela).

**Fórmula:**

Valor = Activo Neto Real + Goodwill

El Goodwill puede calcularse como capitalización de los beneficios extraordinarios.

## ¿Qué Método Elegir?

| Situación | Método Recomendado |
|-----------|-------------------|
| Empresa patrimonial | Valor Contable Ajustado |
| Empresa industrial madura | Múltiplo EBITDA + DCF |
| Startup sin beneficios | Múltiplo Ventas |
| Compraventa con sinergias | DCF con hipótesis de sinergias |
| Conflicto entre socios | Varios métodos y media ponderada |

## Ajustes Habituales en Valoración

### Ajustes al EBITDA (Normalización)

Para obtener un EBITDA representativo, se ajustan:

- **Salarios de propietarios** por encima/debajo de mercado
- **Alquileres a partes vinculadas** no a mercado
- **Gastos extraordinarios** no recurrentes
- **Ingresos extraordinarios** que no se repetirán

### Prima de Control vs. Descuento de Minoría

- Comprar el **100%** suele tener una prima del 20-30%
- Una participación **minoritaria** se valora con descuento del 15-25%

### Descuento por Iliquidez

Empresas no cotizadas tienen menor liquidez que las cotizadas: descuento del 20-35%.

## Caso Práctico

Una empresa industrial con:
- EBITDA normalizado: 800.000 €
- Deuda financiera neta: 500.000 €
- Múltiplo sectorial: 5x

**Valor Empresa (EV):** 800.000 × 5 = 4.000.000 €
**Valor Equity (para el vendedor):** 4.000.000 - 500.000 = 3.500.000 €

## Conclusión

La valoración de empresas combina ciencia y arte. Los números son el punto de partida, pero el valor final dependerá de la negociación, las sinergias percibidas y las alternativas de cada parte.

**¿Necesitas valorar tu empresa?** Nuestro equipo de M&A puede ayudarte con un análisis profesional.',
  'Mercantil',
  ARRAY['Valoración Empresas', 'M&A', 'EBITDA', 'DCF', 'Compraventa Empresas'],
  'published',
  9,
  'Valoración de Empresas: Guía de Métodos y Ejemplos | Navarro',
  'Guía completa sobre valoración de empresas: métodos DCF, múltiplos EBITDA, valor patrimonial y cuándo aplicar cada uno en operaciones M&A.',
  NOW() - INTERVAL '15 days',
  'es'
);

-- Fix the existing articles with "Carlos Navarro" author to "Samuel L. Navarro"
UPDATE public.blog_posts 
SET author_name = 'Samuel L. Navarro',
    author_specialization = 'M&A y Derecho Mercantil'
WHERE author_name = 'Carlos Navarro';