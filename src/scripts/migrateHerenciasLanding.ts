import { supabase } from '@/integrations/supabase/client';

/**
 * Script de migración para importar la landing de Herencias Barcelona
 * a la base de datos de landing_pages
 * 
 * Ejecutar una sola vez desde la consola del navegador:
 * import('/src/scripts/migrateHerenciasLanding.ts').then(m => m.migrateHerenciasLanding())
 */

export async function migrateHerenciasLanding() {
  try {
    console.log('🚀 Iniciando migración de landing de herencias...');

    const landingData = {
      slug: 'abogados-herencias-barcelona',
      slug_es: 'abogados-herencias-barcelona',
      title: 'Abogados de Herencias en Barcelona | Expertos en Sucesiones Cataluña',
      title_es: 'Abogados de Herencias en Barcelona | Expertos en Sucesiones Cataluña',
      meta_title: 'Abogados de Herencias en Barcelona | Expertos en Sucesiones Cataluña',
      meta_title_es: 'Abogados de Herencias en Barcelona | Expertos en Sucesiones Cataluña',
      meta_description: 'Abogados especializados en herencias en Barcelona. Tramitación completa de herencias según el Codi Civil Català. Legítima catalana, impuestos, conflictos. Consulta gratuita.',
      meta_description_es: 'Abogados especializados en herencias en Barcelona. Tramitación completa de herencias según el Codi Civil Català. Legítima catalana, impuestos, conflictos. Consulta gratuita.',
      status: 'published',
      is_active: true,
      use_navbar: true,
      use_footer: true,
      primary_cta_text: 'Calcular mi herencia',
      primary_cta_text_es: 'Calcular mi herencia',
      primary_cta_url: '#calculadora',
      keywords: ['herencias', 'barcelona', 'cataluña', 'codi civil català', 'legítima catalana', 'abogados herencias', 'sucesiones'],
      sections: [
        {
          type: 'hero',
          id: 'hero-herencias',
          props: {
            badge: 'Expertos en Derecho Sucesorio Catalán',
            badgeIcon: 'Scale',
            title: 'Abogados de Herencias en Barcelona. Expertos en Sucesiones en Cataluña.',
            subtitle: 'Tramitamos tu herencia de principio a fin: declaración de herederos, reparto, legítima catalana, impuestos y conflictos familiares.',
            primaryCta: {
              text: 'Calcular mi herencia en Cataluña',
              url: '#calculadora',
              icon: 'Calculator'
            },
            secondaryCta: {
              text: 'Hablar con un abogado ahora',
              url: '#contacto'
            },
            background: 'gradient'
          }
        },
        {
          type: 'trust-bar',
          id: 'trust-bar',
          props: {}
        },
        {
          type: 'value-props',
          id: 'value-props-herencias',
          props: {
            title: '¿Por qué escoger a un abogado especializado en herencias en Cataluña?',
            subtitle: 'El Derecho Sucesorio catalán es único. Necesitas expertos que dominen el Codi Civil Català.',
            items: [
              {
                icon: 'Scale',
                title: 'Dominio del Codi Civil Català',
                description: 'Legítima catalana (25%), cuartos viudales, derechos sucesorios específicos de Cataluña.'
              },
              {
                icon: 'FileCheck',
                title: 'Gestión completa de la herencia',
                description: 'Trámites, certificados, cuentas bancarias, partición, impuestos. Todo incluido.'
              },
              {
                icon: 'Users',
                title: 'Resolución de conflictos',
                description: 'Acuerdos privados, mediación, litigios entre herederos. Soluciones efectivas.'
              },
              {
                icon: 'Euro',
                title: 'Máxima optimización fiscal',
                description: 'ISD, plusvalía, reducción por vivienda habitual, planificación previa.'
              }
            ]
          }
        },
        {
          type: 'calculator-cta',
          id: 'calculadora',
          props: {
            title: 'Calcula ahora cuánto te corresponde según el Codi Civil Català',
            subtitle: 'En menos de 3 minutos, estimación automática del reparto entre herederos',
            ctaText: 'Solicitar cálculo personalizado ahora',
            ctaUrl: '#contacto',
            background: 'primary-gradient'
          }
        },
        {
          type: 'services-list',
          id: 'servicios-herencias',
          props: {
            title: 'Servicios de Herencias en Cataluña',
            subtitle: 'Cobertura completa para cualquier tipo de herencia',
            services: [
              {
                icon: 'FileCheck',
                title: 'Declaración de herederos',
                description: 'Testamento o intestada (ab intestato). Certificados de últimas voluntades, defunción, registro.',
                features: [
                  'Testamento notarial válido',
                  'Sin testamento: sucesión intestada',
                  'Herederos legítimos según Codi Civil Català',
                  'Cuadernos particionales'
                ]
              },
              {
                icon: 'Users',
                title: 'Reparto de bienes y partición',
                description: 'Inventario completo, valoración, cuadernos particionales, adjudicación, inscripción en registros.',
                features: [
                  'Inventario detallado de activos y pasivos',
                  'Tasación de inmuebles y activos',
                  'Cuaderno particional privado o notarial',
                  'Inscripción en Registro de la Propiedad'
                ]
              },
              {
                icon: 'Euro',
                title: 'Impuestos de herencia (ISD)',
                description: 'Liquidación del Impuesto sobre Sucesiones y Donaciones en Cataluña. Reducciones fiscales, bonificaciones.',
                features: [
                  'Modelo 650 del ISD en Cataluña',
                  'Bonificación del 99% (cónyuge e hijos)',
                  'Reducción vivienda habitual',
                  'Plusvalía municipal (IIVTNU)'
                ]
              },
              {
                icon: 'Shield',
                title: 'Conflictos entre herederos',
                description: 'Mediación extrajudicial, acuerdos privados, litigios civiles, división judicial de la herencia.',
                features: [
                  'Mediación entre coherederos',
                  'Reclamación de legítima catalana',
                  'Impugnación de testamento',
                  'División judicial de herencia'
                ]
              },
              {
                icon: 'Clock',
                title: 'Herencias internacionales',
                description: 'Fallecido residente en el extranjero, bienes en varios países, aplicación del Reglamento Europeo 650/2012.',
                features: [
                  'Reglamento UE 650/2012',
                  'Certificado Sucesorio Europeo',
                  'Ley aplicable según residencia',
                  'Coordinación con abogados internacionales'
                ]
              },
              {
                icon: 'CheckCircle2',
                title: 'Planificación sucesoria',
                description: 'Testamento optimizado, donaciones en vida, usufructo, pactos sucesorios catalanes (heredaments).',
                features: [
                  'Testamento adaptado al Codi Civil Català',
                  'Donaciones con reserva de usufructo',
                  'Pactos sucesorios (heredaments)',
                  'Optimización fiscal familiar'
                ]
              }
            ]
          }
        },
        {
          type: 'differences-section',
          id: 'diferencias-catalunya',
          props: {
            title: 'Herencias en Cataluña: Diferencias clave con el Derecho Común',
            subtitle: 'El Codi Civil Català establece normas propias que debes conocer',
            differences: [
              {
                title: 'Legítima catalana: solo el 25%',
                description: 'En Cataluña, la legítima es del 25% del caudal hereditario (versus 66% en derecho común español). Esto da mucha más libertad al testador para disponer de sus bienes.'
              },
              {
                title: 'Cuarto viudal',
                description: 'El cónyuge viudo tiene derecho al usufructo universal (cuarto viudal) sobre toda la herencia, salvo que el testamento disponga otra cosa.'
              },
              {
                title: 'Pactos sucesorios',
                description: 'El Codi Civil Català permite los heredaments (pactos sucesorios), contratos previos al fallecimiento para designar herederos.'
              },
              {
                title: 'Libertad de testar amplia',
                description: 'Mayor flexibilidad para repartir la herencia como el testador desee, respetando solo la legítima del 25%.'
              }
            ]
          }
        },
        {
          type: 'testimonials',
          id: 'testimonios-herencias',
          props: {
            title: 'Lo que dicen nuestros clientes',
            testimonials: [
              {
                text: 'Nos ayudaron a resolver un conflicto familiar muy complejo. Su conocimiento del derecho catalán fue decisivo.',
                author: 'Marta S.',
                role: 'Cliente Barcelona'
              },
              {
                text: 'Tramitaron toda la herencia de mi padre en tiempo récord. Muy profesionales y cercanos.',
                author: 'Joan P.',
                role: 'Cliente Girona'
              },
              {
                text: 'Nos ahorraron miles de euros en impuestos gracias a su planificación fiscal.',
                author: 'Anna M.',
                role: 'Cliente Tarragona'
              }
            ]
          }
        },
        {
          type: 'faq',
          id: 'faq-herencias',
          props: {
            title: 'Preguntas frecuentes sobre herencias en Cataluña',
            faqs: [
              {
                question: '¿Cuánto cuesta tramitar una herencia en Barcelona?',
                answer: 'Los honorarios varían según la complejidad (herencia simple, con conflictos, con inmuebles, etc.). Ofrecemos presupuesto cerrado sin sorpresas. Primera consulta gratuita.'
              },
              {
                question: '¿Cuánto tiempo tarda en tramitarse una herencia?',
                answer: 'Una herencia sin conflictos puede resolverse en 2-4 meses. Con litigios o bienes complejos, puede extenderse a 6-12 meses.'
              },
              {
                question: '¿Qué es la legítima catalana?',
                answer: 'Es la cuota mínima reservada a los herederos forzosos (descendientes). En Cataluña es del 25% del caudal hereditario, mucho menor que en el resto de España (66%).'
              },
              {
                question: '¿Puedo renunciar a una herencia?',
                answer: 'Sí, se puede renunciar pura y simplemente ante notario. También existe la aceptación a beneficio de inventario si hay dudas sobre las deudas.'
              },
              {
                question: '¿Se pagan impuestos por heredar?',
                answer: 'Sí, el Impuesto sobre Sucesiones (ISD). En Cataluña existe una bonificación del 99% para cónyuge e hijos (Grupo I y II), por lo que en la práctica apenas se paga.'
              }
            ]
          }
        },
        {
          type: 'final-cta',
          id: 'contacto',
          props: {
            title: '¿Necesitas asesoramiento en tu herencia?',
            subtitle: 'Primera consulta gratuita. Te explicamos tus derechos, costes y plazos.',
            features: [
              'Consulta inicial sin coste',
              'Presupuesto cerrado y transparente',
              'Expertos en Codi Civil Català',
              'Respuesta en menos de 24h'
            ]
          }
        }
      ]
    };

    const { data, error } = await supabase
      .from('landing_pages')
      .insert([landingData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error al insertar landing:', error);
      throw error;
    }

    console.log('✅ Landing de herencias migrada exitosamente:', data);
    console.log('📍 ID de la landing:', data.id);
    console.log('🔗 Slug:', data.slug);
    
    return data;
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  }
}
