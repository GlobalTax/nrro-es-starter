import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { legalBreadcrumbs } from "@/lib/seoUtils";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const Cookies = () => {
  
  return (
    <>
      <Meta
        title="Política de Cookies"
        description="Información sobre las cookies que utilizamos en nuestro sitio web"
        keywords="política cookies, privacidad, RGPD, protección datos"
        canonicalUrl={`${window.location.origin}/cookies`}
      />
      <BreadcrumbSchema items={legalBreadcrumbs.cookies} />

      {/* Hero Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-foreground mb-6">
              Política de Cookies
            </h1>
            <p className="text-xl text-foreground">
              Información sobre las cookies que utilizamos
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
                <BreadcrumbPage>Política de Cookies</BreadcrumbPage>
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
              
              {/* Responsable de la Política de Cookies */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  1. Responsable de la Política de Cookies
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Las cookies utilizadas en este sitio web son gestionadas por las siguientes entidades del Grupo Empresarial Navarro:
                  </p>

                  {/* Grupo Navarro - Cabecera */}
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Grupo Empresarial Navarro
                    </p>
                    <p className="text-sm text-foreground">
                      Responsables conjuntos de la gestión de cookies:
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

                  {/* Datos de contacto comunes */}
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
                </div>
              </div>
              
              {/* ¿Qué son las cookies? */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  ¿Qué son las cookies?
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo al visitarlos. Permiten recordar información sobre tu visita, lo que puede mejorar tu experiencia en el sitio.
                  </p>
                  <p>
                    Las cookies pueden ser de diferentes tipos:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Cookies de sesión:</strong> se eliminan al cerrar el navegador.
                    </li>
                    <li>
                      <strong className="text-foreground">Cookies persistentes:</strong> permanecen en tu dispositivo durante un tiempo determinado.
                    </li>
                    <li>
                      <strong className="text-foreground">Cookies propias:</strong> son gestionadas por el sitio web que visitas.
                    </li>
                    <li>
                      <strong className="text-foreground">Cookies de terceros:</strong> son gestionadas por un tercero, como un proveedor de servicios.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cookies que utilizamos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Tipos de cookies que utilizamos
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    En este sitio web utilizamos los siguientes tipos de cookies:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Cookies técnicas:</strong> Son esenciales para el funcionamiento del sitio web y te permiten navegar por él y utilizar sus funciones.
                    </li>
                    <li>
                      <strong className="text-foreground">Cookies de análisis:</strong> Nos permiten analizar cómo utilizas el sitio web para poder mejorarlo.
                    </li>
                    <li>
                      <strong className="text-foreground">Cookies de preferencias:</strong> Permiten recordar tus preferencias (por ejemplo, el idioma) para ofrecerte una experiencia más personalizada.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Finalidad */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Finalidad de las cookies
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Las cookies que utilizamos tienen las siguientes finalidades:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Técnicas:</strong> garantizar el correcto funcionamiento del sitio web.
                    </li>
                    <li>
                      <strong className="text-foreground">Análisis:</strong> analizar cómo utilizas el sitio web para poder mejorarlo.
                    </li>
                    <li>
                      <strong className="text-foreground">Preferencias:</strong> recordar tus preferencias (por ejemplo, el idioma) para ofrecerte una experiencia más personalizada.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Base legal */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Base legal
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    La base legal para el uso de cookies técnicas es nuestro interés legítimo en garantizar el correcto funcionamiento del sitio web.
                  </p>
                  <p>
                    La base legal para el uso de cookies de análisis y preferencias es tu consentimiento, que puedes retirar en cualquier momento.
                  </p>
                </div>
              </div>

              {/* Gestión */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Cómo gestionar las cookies
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Puedes gestionar las cookies a través de la configuración de tu navegador. Puedes permitir, bloquear o eliminar las cookies instaladas en tu dispositivo.
                  </p>
                  <p>
                    Para más información sobre cómo gestionar las cookies, consulta la documentación de tu navegador:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Microsoft Edge
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Apple Safari
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cookies de terceros */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Cookies de terceros
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Este sitio web puede utilizar cookies de terceros para mejorar la experiencia del usuario y ofrecer contenido personalizado.
                  </p>
                  <p>
                    Estas cookies son gestionadas por terceros y están sujetas a sus propias políticas de privacidad.
                  </p>
                  <p>
                    Puedes consultar las políticas de privacidad de los terceros que utilizamos en este sitio web en sus respectivos sitios web.
                  </p>
                </div>
              </div>

              {/* Actualizaciones */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Actualizaciones de la política
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Es posible que actualicemos esta Política de Cookies de vez en cuando. Te recomendamos que la revises periódicamente para estar al tanto de los cambios.
                  </p>
                  <p>
                    La fecha de la última actualización se indica al principio de esta página.
                  </p>
                </div>
              </div>

              {/* Más información */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Más información
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Si tienes alguna pregunta sobre esta Política de Cookies, puedes ponerte en contacto con nosotros a través de los medios indicados a continuación.
                  </p>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  Contacto
                </h2>
                <div className="space-y-3 text-foreground">
                  <p>
                    Para cualquier consulta sobre esta Política de Cookies, puedes contactar con cualquiera de las entidades del Grupo Empresarial Navarro indicadas en la sección 1 de esta política.
                  </p>
                  <p>
                    También puedes dirigirte a nuestros datos de contacto generales:
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
                      <strong className="text-foreground">Dirección:</strong> Carrer Ausias March número 36, 08010 Barcelona, España
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

export default Cookies;
