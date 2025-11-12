import { Meta } from "@/components/seo/Meta";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const Privacy = () => {
  
  return (
    <>
      <Meta
        title="Política de Privacidad"
        description="Información sobre el tratamiento de datos personales"
        keywords="privacidad, protección datos, RGPD, datos personales"
        canonicalUrl={`${window.location.origin}/privacidad`}
      />

      {/* Hero Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-foreground mb-6">
              Política de Privacidad
            </h1>
            <p className="text-xl text-foreground">
              Protección de tus datos personales
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/aviso-legal">Legal</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Política de Privacidad</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Content Sections */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              
              {/* Last Updated */}
            <div className="text-sm text-foreground">
              <p>Última actualización: 12 de enero de 2025</p>
            </div>

              {/* Responsable del tratamiento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  1. Responsable del Tratamiento de Datos
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos (LOPDGDD), 
                    los responsables del tratamiento de tus datos personales son las siguientes entidades del Grupo Empresarial Navarro:
                  </p>

                  {/* Grupo Navarro - Cabecera */}
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Grupo Empresarial Navarro
                    </p>
                    <p className="text-sm text-foreground">
                      Responsables conjuntos del tratamiento de datos:
                    </p>
                  </div>

                  {/* Empresa 1: Navarro Legal Y Tributario */}
                  <div className="border-l-4 border-accent pl-4 mb-6">
                    <h3 className="font-semibold text-foreground mb-2">
                      Navarro, Legal Y Tributario S.L.P.
                    </h3>
                    <ul className="list-none space-y-1 text-sm">
                      <li><strong className="text-foreground">CIF:</strong> B67261552</li>
                      <li><strong className="text-foreground">Forma jurídica:</strong> Sociedad Limitada Profesional</li>
                      <li><strong className="text-foreground">Actividad:</strong> Asesoría legal, fiscal y tributaria</li>
                      <li><strong className="text-foreground">Nombre comercial:</strong> NRRO / Navarro</li>
                    </ul>
                  </div>

                  {/* Empresa 2: Capittal Transacciones */}
                  <div className="border-l-4 border-accent pl-4 mb-6">
                    <h3 className="font-semibold text-foreground mb-2">
                      Capittal Transacciones S.L.
                    </h3>
                    <ul className="list-none space-y-1 text-sm">
                      <li><strong className="text-foreground">CIF:</strong> B02721918</li>
                      <li><strong className="text-foreground">Forma jurídica:</strong> Sociedad Limitada</li>
                      <li><strong className="text-foreground">Actividad:</strong> Originación e intermediación de operaciones</li>
                    </ul>
                  </div>

                  {/* Empresa 3: Navarro Empresarial */}
                  <div className="border-l-4 border-accent pl-4 mb-6">
                    <h3 className="font-semibold text-foreground mb-2">
                      Navarro Empresarial S.L.
                    </h3>
                    <ul className="list-none space-y-1 text-sm">
                      <li><strong className="text-foreground">CIF:</strong> B58068800</li>
                      <li><strong className="text-foreground">Forma jurídica:</strong> Sociedad Limitada</li>
                      <li><strong className="text-foreground">Actividad:</strong> Asesoría fiscal, laboral y contable recurrente</li>
                    </ul>
                  </div>

                  {/* Empresa 4: SPV Corporate Advisors */}
                  <div className="border-l-4 border-accent pl-4 mb-6">
                    <h3 className="font-semibold text-foreground mb-2">
                      SPV Corporate Advisors S.L.
                    </h3>
                    <ul className="list-none space-y-1 text-sm">
                      <li><strong className="text-foreground">CIF:</strong> B09652017</li>
                      <li><strong className="text-foreground">Forma jurídica:</strong> Sociedad Limitada</li>
                      <li><strong className="text-foreground">Actividad:</strong> Sociedad holding de participaciones empresariales</li>
                    </ul>
                  </div>

                  {/* Datos de contacto comunes - Destacado con fondo */}
                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 mt-6">
                    <h4 className="font-semibold text-foreground mb-3">Datos de contacto del grupo</h4>
                    <ul className="list-none space-y-2">
                      <li>
                        <strong className="text-foreground">Domicilio social (todas las empresas):</strong> Carrer Ausias March número 36, 08010 Barcelona, España
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

                  {/* Nota legal sobre responsabilidad conjunta */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                    <p className="text-sm text-foreground">
                      <strong className="text-foreground">Nota:</strong> Las entidades del grupo pueden compartir datos personales entre sí cuando sea necesario para la prestación de servicios integrales. 
                      Todos los tratamientos se realizan conforme a las bases legales establecidas en el RGPD y la LOPDGDD.
                    </p>
                  </div>
                </div>
              </div>

              {/* Datos que recopilamos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  2. Datos que Recopilamos
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>A través de nuestro sitio web, podemos recopilar los siguientes tipos de datos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Datos de contacto:</strong> Nombre, email, empresa y mensaje cuando utilizas nuestros formularios de contacto
                    </li>
                    <li>
                      <strong className="text-foreground">Datos de navegación:</strong> Dirección IP, tipo de navegador y comportamiento de navegación (registrados automáticamente)
                    </li>
                    <li>
                      <strong className="text-foreground">Datos de solicitudes de demo:</strong> Nombre, email y nombre del restaurante (para solicitudes de Orquest KairosHR)
                    </li>
                  </ul>
                  <p className="text-sm italic">
                    Nota: NO recopilamos datos financieros ni datos bancarios a través de nuestro sitio web.
                  </p>
                </div>
              </div>

              {/* Finalidad del tratamiento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  3. Finalidad del Tratamiento
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>Tratamos tus datos personales para las siguientes finalidades:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Responder a tus consultas y solicitudes de información</li>
                    <li>Gestionar solicitudes de servicios profesionales</li>
                    <li>Enviar información solicitada sobre nuestros servicios</li>
                    <li>Mejorar nuestros servicios y la experiencia del usuario</li>
                    <li>Cumplir con obligaciones legales aplicables</li>
                  </ul>
                </div>
              </div>

              {/* Base legal */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  4. Base Legal del Tratamiento
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>El tratamiento de tus datos personales se basa en:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Consentimiento del usuario</strong> (art. 6.1.a RGPD) cuando utilizas nuestros formularios de contacto
                    </li>
                    <li>
                      <strong className="text-foreground">Interés legítimo</strong> (art. 6.1.f RGPD) para responder a consultas comerciales
                    </li>
                    <li>
                      <strong className="text-foreground">Ejecución de contrato</strong> (art. 6.1.b RGPD) para clientes que contratan nuestros servicios
                    </li>
                    <li>
                      <strong className="text-foreground">Cumplimiento de obligaciones legales</strong> (art. 6.1.c RGPD) cuando lo requiera la normativa aplicable
                    </li>
                  </ul>
                </div>
              </div>

              {/* Destinatarios */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  5. Destinatarios de los Datos
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Tus datos personales <strong className="text-foreground">NO se ceden a terceros</strong> salvo obligación legal.
                    Los únicos destinatarios son:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Proveedor de hosting y base de datos:</strong> Supabase (ubicado en la Unión Europea)
                    </li>
                    <li>
                      <strong className="text-foreground">Administración Tributaria:</strong> Cuando exista obligación legal
                    </li>
                  </ul>
                </div>
              </div>

              {/* Conservación de datos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  6. Plazo de Conservación
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>Conservamos tus datos personales durante:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Datos de contacto:</strong> Hasta que retires tu consentimiento o solicites su supresión
                    </li>
                    <li>
                      <strong className="text-foreground">Datos de clientes:</strong> Según las obligaciones legales fiscales y mercantiles (mínimo 6 años)
                    </li>
                    <li>
                      <strong className="text-foreground">Datos de navegación:</strong> Máximo 2 años desde la última interacción
                    </li>
                  </ul>
                </div>
              </div>

              {/* Derechos del usuario */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  7. Derechos del Usuario
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>Tienes derecho a:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Acceso:</strong> Consultar qué datos personales tenemos sobre ti
                    </li>
                    <li>
                      <strong className="text-foreground">Rectificación:</strong> Corregir datos inexactos o incompletos
                    </li>
                    <li>
                      <strong className="text-foreground">Supresión:</strong> Solicitar la eliminación de tus datos ("derecho al olvido")
                    </li>
                    <li>
                      <strong className="text-foreground">Limitación del tratamiento:</strong> Restringir el uso de tus datos
                    </li>
                    <li>
                      <strong className="text-foreground">Portabilidad:</strong> Recibir tus datos en formato estructurado
                    </li>
                    <li>
                      <strong className="text-foreground">Oposición:</strong> Oponerte al tratamiento de tus datos
                    </li>
                    <li>
                      <strong className="text-foreground">Retirada del consentimiento:</strong> En cualquier momento, sin que afecte a la licitud del tratamiento previo
                    </li>
                  </ul>
                  <p className="mt-4">
                    Para ejercer estos derechos, envía un email a{" "}
                    <a href="mailto:info@nrro.es" className="text-accent hover:underline">
                      info@nrro.es
                    </a>{" "}
                    con el asunto "Ejercicio de derechos RGPD" adjuntando copia de tu DNI/NIE.
                  </p>
                </div>
              </div>

              {/* Seguridad */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  8. Medidas de Seguridad
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>Implementamos medidas técnicas y organizativas para proteger tus datos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cifrado SSL/TLS en todas las comunicaciones</li>
                    <li>Base de datos con Row Level Security (RLS) activado</li>
                    <li>Auditoría de accesos y eventos de seguridad</li>
                    <li>Rate limiting para prevenir ataques automatizados</li>
                    <li>Validación de datos de entrada con librerías especializadas</li>
                    <li>Acceso restringido al personal autorizado</li>
                  </ul>
                </div>
              </div>

              {/* Cookies */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  9. Política de Cookies
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Nuestro sitio web <strong className="text-foreground">NO utiliza cookies publicitarias ni de terceros</strong> para rastreo comercial.
                  </p>
                  <p>Solo utilizamos cookies técnicas esenciales para:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Mantener sesiones de usuario en el área de administración</li>
                    <li>Garantizar el funcionamiento correcto del sitio web</li>
                    <li>Recordar preferencias de idioma (si aplica)</li>
                  </ul>
                  <p>
                    Estas cookies son necesarias para el funcionamiento del sitio y no requieren consentimiento previo según la normativa vigente.
                  </p>
                  <p className="mt-4">
                    Para más información sobre las cookies que utilizamos, consulta nuestra{" "}
                    <Link to="/cookies" className="text-accent hover:underline font-normal">
                      Política de Cookies
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Enlaces a terceros */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  10. Enlaces a Sitios de Terceros
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Nuestro sitio web puede contener enlaces a redes sociales (LinkedIn, Instagram, Twitter, Facebook) y otros sitios de terceros.
                  </p>
                  <p>
                    No nos responsabilizamos de las políticas de privacidad de estos sitios externos. 
                    Te recomendamos leer sus políticas de privacidad antes de proporcionar información personal.
                  </p>
                </div>
              </div>

              {/* Menores de edad */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  11. Política sobre Menores
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Nuestros servicios están dirigidos exclusivamente a empresas y profesionales.
                    No recopilamos intencionadamente datos de menores de 14 años.
                  </p>
                  <p>
                    Si detectamos que hemos recopilado datos de un menor, los eliminaremos inmediatamente.
                  </p>
                </div>
              </div>

              {/* Transferencias internacionales */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  12. Transferencias Internacionales
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Todos nuestros servidores y proveedores de servicios están ubicados en la Unión Europea.
                    <strong className="text-foreground"> No realizamos transferencias internacionales de datos</strong> fuera del Espacio Económico Europeo.
                  </p>
                </div>
              </div>

              {/* Modificaciones */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  13. Modificaciones de la Política
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Nos reservamos el derecho a actualizar esta Política de Privacidad en cualquier momento para adaptarla a cambios normativos o mejoras en nuestros servicios.
                  </p>
                  <p>
                    Cualquier cambio será publicado en esta página con la fecha de "Última actualización" correspondiente.
                  </p>
                </div>
              </div>

              {/* Reclamación */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  14. Derecho a Presentar Reclamación
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Si consideras que no hemos tratado tus datos correctamente, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):
                  </p>
                  <ul className="list-none space-y-2">
                    <li>
                      <strong className="text-foreground">Web:</strong>{" "}
                      <a 
                        href="https://www.aepd.es" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        www.aepd.es
                      </a>
                    </li>
                    <li>
                      <strong className="text-foreground">Dirección:</strong> C/ Jorge Juan, 6, 28001 Madrid
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  15. Contacto
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Para cualquier cuestión relacionada con esta Política de Privacidad o el tratamiento de tus datos personales, puedes contactarnos en:
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

export default Privacy;
