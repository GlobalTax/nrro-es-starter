import { Meta } from "@/components/seo/Meta";
import { Link } from "react-router-dom";

const Legal = () => {
  
  return (
    <>
      <Meta
        title="Aviso Legal"
        description="Términos y condiciones de uso del sitio web"
        keywords="aviso legal, términos condiciones, información legal"
        canonicalUrl={`${window.location.origin}/aviso-legal`}
      />

      {/* Hero Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-foreground mb-6">
              Aviso Legal
            </h1>
            <p className="text-xl text-muted-foreground">
              Términos y condiciones de uso
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              
              {/* Last Updated */}
              <div className="text-sm text-muted-foreground">
                <p>Última actualización: 12 de noviembre de 2025</p>
              </div>
              
              {/* Identificación */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  1. Identificación del Titular
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se informa de los siguientes datos:
                  </p>
              <ul className="list-none space-y-2">
                <li>
                  <strong className="text-foreground">Denominación social:</strong> Navarro, Legal Y Tributario S.L.P.
                </li>
                <li>
                  <strong className="text-foreground">CIF:</strong> B67261552
                </li>
                <li>
                  <strong className="text-foreground">Forma jurídica:</strong> Sociedad Limitada Profesional
                </li>
                <li>
                  <strong className="text-foreground">Nombre comercial:</strong> NRRO / Navarro
                </li>
                <li>
                  <strong className="text-foreground">Grupo empresarial:</strong> Grupo Navarro
                </li>
                <li>
                  <strong className="text-foreground">Domicilio social:</strong> Carrer Ausias March número 36, 08010 Barcelona, España
                </li>
                <li>
                  <strong className="text-foreground">Email de contacto:</strong>{" "}
                  <a href="mailto:info@nrro.es" className="text-accent hover:underline">
                    info@nrro.es
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Teléfono:</strong> 934593600
                </li>
              </ul>
                </div>
              </div>

              {/* Objeto del sitio */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  2. Objeto del Sitio Web
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Este sitio web tiene como finalidad:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Proporcionar información corporativa sobre Navarro, Legal Y Tributario S.L.P. (NRRO) y sus servicios</li>
                    <li>Servir como canal de contacto para clientes actuales y potenciales</li>
                    <li>Mostrar casos de éxito y testimonios (con el consentimiento de nuestros clientes)</li>
                    <li>Publicar contenidos informativos sobre fiscalidad, contabilidad y asesoría legal</li>
                    <li>Facilitar solicitudes de información sobre productos y servicios</li>
                  </ul>
                  <p className="text-sm italic mt-4">
                    Nota: Este sitio web NO es una plataforma de e-commerce. Los servicios profesionales se contratan mediante acuerdos específicos fuera de este portal.
                  </p>
                </div>
              </div>

              {/* Condiciones de uso */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  3. Condiciones de Uso
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    El acceso y uso de este sitio web implica la aceptación de estas condiciones. El usuario se compromete a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Utilizar el sitio web de forma lícita y conforme a la legislación vigente</li>
                    <li>No introducir virus, código malicioso o realizar ataques informáticos</li>
                    <li>No realizar scraping automatizado sin autorización expresa</li>
                    <li>No suplantar la identidad de otras personas en formularios</li>
                    <li>No utilizar los contenidos con fines comerciales sin autorización</li>
                    <li>Respetar los derechos de propiedad intelectual</li>
                  </ul>
                  <p className="mt-4">
                    El acceso al sitio web es libre y gratuito. Sin embargo, algunos servicios pueden requerir registro o suscripción.
                  </p>
                </div>
              </div>

              {/* Propiedad intelectual */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  4. Propiedad Intelectual e Industrial
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Todos los contenidos de este sitio web (textos, imágenes, logos, diseño gráfico, código fuente, estructura) son propiedad de Navarro, Legal Y Tributario S.L.P. (NRRO) o sus licenciantes y están protegidos por:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Real Decreto Legislativo 1/1996 (Ley de Propiedad Intelectual)</li>
                    <li>Ley 17/2001 de Marcas</li>
                    <li>Normativa europea e internacional aplicable</li>
                  </ul>
                  <p className="mt-4">
                    Queda <strong className="text-foreground">expresamente prohibido</strong>:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Reproducir, distribuir, modificar o comunicar públicamente los contenidos sin autorización</li>
                    <li>Utilizar los logos y marcas de NRRO fuera de su contexto</li>
                    <li>Realizar ingeniería inversa del código fuente</li>
                    <li>Extraer bases de datos o contenidos mediante técnicas automatizadas</li>
                  </ul>
                  <p className="mt-4 text-sm">
                    Los logos y nombres de empresas mencionados en casos de éxito son propiedad de sus respectivos titulares y se muestran con autorización expresa.
                  </p>
                </div>
              </div>

              {/* Responsabilidad */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  5. Limitación de Responsabilidad
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    NRRO no se responsabiliza de:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Contenidos informativos:</strong> Los artículos y publicaciones tienen carácter meramente informativo y <strong className="text-foreground">NO constituyen asesoramiento legal vinculante</strong>. Cada caso requiere análisis individualizado.
                    </li>
                    <li>
                      <strong className="text-foreground">Decisiones sin consulta:</strong> No nos responsabilizamos de decisiones tomadas basándose únicamente en información del sitio web sin consulta profesional previa.
                    </li>
                    <li>
                      <strong className="text-foreground">Disponibilidad del sitio:</strong> Aunque nos esforzamos por mantener el sitio operativo 24/7, no garantizamos disponibilidad ininterrumpida debido a mantenimientos técnicos.
                    </li>
                    <li>
                      <strong className="text-foreground">Enlaces externos:</strong> No nos responsabilizamos del contenido de sitios web de terceros enlazados desde esta web.
                    </li>
                    <li>
                      <strong className="text-foreground">Virus o malware:</strong> Aunque implementamos medidas de seguridad, no garantizamos que el sitio esté libre de errores o virus.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Exactitud de la información */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  6. Exactitud de la Información
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Nos esforzamos por mantener la información actualizada y precisa. Sin embargo:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Las normativas fiscales y legales cambian con frecuencia</li>
                    <li>Los artículos del blog pueden quedar desactualizados con el tiempo</li>
                    <li>Cada caso empresarial es único y requiere análisis específico</li>
                  </ul>
                  <p className="mt-4">
                    <strong className="text-foreground">Recomendamos encarecidamente</strong> consultar directamente con nuestros profesionales antes de tomar decisiones fiscales o legales importantes.
                  </p>
                </div>
              </div>

              {/* Enlaces externos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  7. Enlaces a Sitios Externos
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Este sitio web puede contener enlaces a sitios de terceros (proveedores, partners, redes sociales). 
                  </p>
                  <p>
                    NRRO:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>No se responsabiliza del contenido de sitios externos</li>
                    <li>No garantiza la disponibilidad de esos sitios</li>
                    <li>No aprueba ni recomienda necesariamente sus contenidos</li>
                  </ul>
                  <p className="mt-4">
                    Los enlaces se proporcionan únicamente para conveniencia del usuario. Te recomendamos leer las políticas de privacidad de cada sitio externo.
                  </p>
                </div>
              </div>

              {/* Modificaciones */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  8. Modificaciones
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    NRRO se reserva el derecho a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modificar los contenidos del sitio web sin previo aviso</li>
                    <li>Suspender temporalmente el sitio por mantenimiento técnico</li>
                    <li>Actualizar estos términos y condiciones en cualquier momento</li>
                    <li>Modificar la estructura, diseño o funcionalidades del sitio</li>
                  </ul>
                  <p className="mt-4">
                    Los cambios en los términos legales se publicarán en esta página con la fecha de "Última actualización" correspondiente.
                  </p>
                </div>
              </div>

              {/* Jurisdicción */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  9. Legislación Aplicable y Jurisdicción
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Este Aviso Legal se rige por la legislación española vigente.
                  </p>
                  <p>
                    Para cualquier controversia o conflicto derivado del uso de este sitio web, las partes se someten expresamente a la jurisdicción de los <strong className="text-foreground">Juzgados y Tribunales de Barcelona</strong>, renunciando a cualquier otro fuero que pudiera corresponderles.
                  </p>
                  <p>
                    El idioma de interpretación de estos términos es el <strong className="text-foreground">español</strong>. En caso de traducciones, la versión en español prevalecerá.
                  </p>
                </div>
              </div>

              {/* Protección de datos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  10. Protección de Datos Personales
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    El tratamiento de datos personales se rige por nuestra{" "}
                    <a href="/privacy" className="text-accent hover:underline font-normal">
                      Política de Privacidad
                    </a>
                    , donde se detalla:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Qué datos recopilamos y con qué finalidad</li>
                    <li>Base legal del tratamiento (RGPD)</li>
                    <li>Tus derechos como usuario</li>
                    <li>Medidas de seguridad implementadas</li>
                  </ul>
                  <p className="mt-4">
                    Para más información sobre cookies, consulta nuestra{" "}
                    <a href="/cookies" className="text-accent hover:underline font-normal">
                      Política de Cookies
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Política de envío y recepción de currículums */}
              <div id="politica-curriculum" className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  11. Política de Envío y Recepción de Currículums
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    NRRO recibe y gestiona currículums vitae (CV) para procesos de selección de personal. El envío de un currículum a través de cualquiera de nuestros canales oficiales constituye el consentimiento expreso del candidato para el tratamiento de sus datos personales con las finalidades descritas en esta política.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.1. Finalidad del Tratamiento
                  </h3>
                  <p>
                    Los currículums recibidos serán tratados exclusivamente para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Evaluar la candidatura para procesos de selección activos</li>
                    <li>Mantener una base de datos de talento para futuras oportunidades laborales</li>
                    <li>Comunicarnos con los candidatos durante el proceso de selección</li>
                    <li>Cumplir con obligaciones legales en materia laboral y de igualdad</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.2. Datos Recopilados
                  </h3>
                  <p>
                    Los datos personales que podemos recopilar incluyen:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Datos identificativos:</strong> Nombre, apellidos, DNI/NIE/Pasaporte, fecha de nacimiento</li>
                    <li><strong className="text-foreground">Datos de contacto:</strong> Correo electrónico, teléfono, dirección postal</li>
                    <li><strong className="text-foreground">Formación académica:</strong> Títulos, certificaciones, historial educativo</li>
                    <li><strong className="text-foreground">Experiencia profesional:</strong> Historial laboral, referencias profesionales</li>
                    <li><strong className="text-foreground">Competencias:</strong> Idiomas, habilidades técnicas, conocimientos específicos</li>
                    <li><strong className="text-foreground">Otros datos:</strong> Cualquier información adicional incluida voluntariamente en el CV (foto, carta de presentación, etc.)</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.3. Base Legal del Tratamiento
                  </h3>
                  <p>
                    El tratamiento de datos personales de candidatos se fundamenta en:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Consentimiento del interesado</strong> (art. 6.1.a RGPD) mediante el envío voluntario del currículum</li>
                    <li><strong className="text-foreground">Ejecución de medidas precontractuales</strong> (art. 6.1.b RGPD) en el marco del proceso de selección</li>
                    <li><strong className="text-foreground">Cumplimiento de obligaciones legales</strong> (art. 6.1.c RGPD) en materia laboral e igualdad</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.4. Período de Conservación
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">CVs no seleccionados:</strong> Se conservarán durante <strong className="text-foreground">1 año</strong> desde la recepción para considerarlos en futuros procesos de selección
                    </li>
                    <li>
                      <strong className="text-foreground">CVs seleccionados:</strong> Se incorporarán al expediente del empleado y se conservarán según la legislación laboral vigente
                    </li>
                    <li>
                      Transcurrido el plazo de conservación, los datos serán eliminados de forma segura conforme a nuestros protocolos de destrucción de información
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.5. Destinatarios de los Datos
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Los datos serán accesibles únicamente al Departamento de Recursos Humanos de NRRO</li>
                    <li>No se cederán datos a terceros salvo obligación legal o consentimiento expreso del candidato</li>
                    <li>En caso de utilizar plataformas de gestión de candidatos (ATS), estas actuarán como encargados del tratamiento bajo contrato</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.6. Derechos de los Candidatos (ARCO-POL)
                  </h3>
                  <p>
                    Como candidato, tienes derecho a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-foreground">Acceso:</strong> Conocer qué datos personales conservamos sobre ti</li>
                    <li><strong className="text-foreground">Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos</li>
                    <li><strong className="text-foreground">Cancelación/Supresión:</strong> Solicitar la eliminación de tus datos de nuestra base de talento</li>
                    <li><strong className="text-foreground">Oposición:</strong> Oponerte al tratamiento de tus datos personales</li>
                    <li><strong className="text-foreground">Portabilidad:</strong> Recibir tus datos en formato estructurado, de uso común y lectura mecánica</li>
                    <li><strong className="text-foreground">Limitación:</strong> Solicitar la restricción del tratamiento en determinadas circunstancias</li>
                  </ul>
                  <p className="mt-4">
                    Para ejercer estos derechos, envía un correo electrónico a{" "}
                    <a href="mailto:info@nrro.es?subject=Protección de Datos - Candidatos" className="text-accent hover:underline">
                      info@nrro.es
                    </a>
                    {" "}con asunto <strong className="text-foreground">"Protección de Datos - Candidatos"</strong>, adjuntando copia de tu DNI o documento identificativo equivalente.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.7. Canales de Envío de Currículums
                  </h3>
                  <p>
                    Los canales oficiales para enviar tu currículum son:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Correo electrónico:</strong>{" "}
                      <a href="mailto:info@nrro.es" className="text-accent hover:underline">
                        info@nrro.es
                      </a>
                      {" "}con asunto <strong className="text-foreground">"Candidatura - [Nombre del puesto]"</strong>
                    </li>
                    <li>
                      <strong className="text-foreground">Formulario web:</strong> A través de la sección{" "}
                      <Link to="/carreras" className="text-accent hover:underline">
                        Carreras
                      </Link>
                      {" "}en nrro.es
                    </li>
                  </ul>
                  <p className="mt-4 text-sm italic">
                    <strong className="text-foreground">Nota importante:</strong> No se aceptarán currículums enviados a través de redes sociales, mensajería instantánea u otros canales no oficiales. Solo se procesarán candidaturas recibidas por los medios indicados anteriormente.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.8. Principio de No Discriminación
                  </h3>
                  <p>
                    NRRO garantiza procesos de selección transparentes basados exclusivamente en:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Méritos profesionales y académicos</li>
                    <li>Competencias y habilidades requeridas para el puesto</li>
                    <li>Experiencia laboral relevante</li>
                  </ul>
                  <p className="mt-4">
                    <strong className="text-foreground">Nos comprometemos a NO discriminar</strong> por razón de:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Edad, género, identidad de género u orientación sexual</li>
                    <li>Origen racial, étnico o nacionalidad</li>
                    <li>Religión, creencias o ideología</li>
                    <li>Discapacidad o estado de salud</li>
                    <li>Estado civil, situación familiar o cualquier otra característica protegida por la legislación vigente</li>
                  </ul>
                  <p className="mt-4 text-sm">
                    Cumplimos con la <strong className="text-foreground">Ley Orgánica 3/2007</strong> para la igualdad efectiva de mujeres y hombres, y promovemos la diversidad e inclusión en nuestros procesos de selección.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.9. Confidencialidad y Seguridad
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Los currículums se almacenan en sistemas seguros con medidas técnicas y organizativas apropiadas</li>
                    <li>Solo el personal autorizado del Departamento de RRHH tiene acceso a los datos de candidatos</li>
                    <li>Implementamos cifrado, control de accesos y auditorías periódicas de seguridad</li>
                    <li>Los datos NO se comparten públicamente ni en plataformas de terceros sin tu consentimiento expreso</li>
                    <li>Todos los empleados con acceso a datos de candidatos están sujetos a acuerdos de confidencialidad</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mt-4">
                    11.10. Derecho a Reclamación
                  </h3>
                  <p>
                    Si consideras que tus derechos en materia de protección de datos han sido vulnerados, tienes derecho a presentar una reclamación ante la autoridad de control:
                  </p>
                  <div className="mt-3 pl-4 border-l-4 border-accent/30">
                    <p className="font-semibold text-foreground">Agencia Española de Protección de Datos (AEPD)</p>
                    <p>C/ Jorge Juan, 6 - 28001 Madrid</p>
                    <p>
                      Web:{" "}
                      <a 
                        href="https://www.aepd.es" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        www.aepd.es
                      </a>
                    </p>
                    <p>Tel: 901 100 099 / 912 663 517</p>
                  </div>
                </div>
              </div>

              {/* Comunicaciones electrónicas */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  12. Comunicaciones Electrónicas
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Al utilizar nuestros formularios de contacto:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Aceptas recibir respuesta por correo electrónico</li>
                    <li>
                      <strong className="text-foreground">NO enviaremos newsletters ni comunicaciones comerciales</strong> sin tu consentimiento explícito previo
                    </li>
                    <li>Tienes derecho a darte de baja en cualquier momento</li>
                    <li>Respetamos la Ley 34/2002 (LSSI) sobre comunicaciones comerciales</li>
                  </ul>
                </div>
              </div>

              {/* Servicios profesionales */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  13. Servicios Profesionales
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Este Aviso Legal aplica exclusivamente al <strong className="text-foreground">uso del sitio web</strong>.
                  </p>
                  <p>
                    Los servicios de asesoría fiscal, contable y legal se rigen por:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contratos de prestación de servicios específicos</li>
                    <li>Cartas de encargo profesional</li>
                    <li>Condiciones particulares acordadas con cada cliente</li>
                    <li>Normativa profesional aplicable (deontología, colegios profesionales)</li>
                  </ul>
                  <p className="mt-4">
                    La relación cliente-asesor se formalizará mediante documentos contractuales independientes.
                  </p>
                </div>
              </div>

              {/* Resolución de conflictos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  14. Resolución de Conflictos
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    En caso de controversia, intentaremos resolverla de forma amistosa mediante negociación directa.
                  </p>
                  <p>
                    Los usuarios pueden acceder a la plataforma de Resolución de Litigios en Línea (RLL) de la Unión Europea:
                  </p>
                  <p>
                    <a 
                      href="https://ec.europa.eu/consumers/odr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      https://ec.europa.eu/consumers/odr
                    </a>
                  </p>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  15. Contacto
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Para cualquier cuestión relacionada con este Aviso Legal, puedes contactarnos:
                  </p>
                  <ul className="list-none space-y-2">
                    <li>
                      <strong className="text-foreground">Email:</strong>{" "}
                      <a href="mailto:info@nrro.es" className="text-accent hover:underline">
                        info@nrro.es
                      </a>
                    </li>
                    <li>
                      <strong className="text-foreground">Teléfono:</strong> 934593600
                    </li>
                    <li>
                      <strong className="text-foreground">Dirección:</strong> Carrer Ausias March número 36, 08010 Barcelona
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Legal;
