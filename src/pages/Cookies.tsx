import { Meta } from "@/components/seo/Meta";

const Cookies = () => {
  return (
    <>
      <Meta
        title="Política de Cookies"
        description="Información sobre el uso de cookies en el sitio web de NRRO (Navarro, Legal Y Tributario S.L.P.). Conoce qué cookies utilizamos y cómo gestionarlas."
        keywords="política cookies navarro, cookies nrro, gestión cookies asesoría fiscal"
        canonicalUrl="https://nrro.es/cookies"
      />

      {/* Hero Section */}
      <section className="bg-background py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-foreground mb-6">
              Política de Cookies
            </h1>
            <p className="text-xl text-muted-foreground">
              Información sobre el uso de cookies en nuestro sitio web
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
                <p>Última actualización: 1 de noviembre de 2025</p>
              </div>

              {/* ¿Qué son las cookies? */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  1. ¿Qué son las cookies?
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, tablet, smartphone) cuando los visitas. Contienen información sobre tu navegación y permiten que el sitio web "recuerde" ciertas acciones y preferencias.
                  </p>
                  <p>
                    Las cookies pueden clasificarse según:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Duración:</strong>
                      <ul className="list-circle pl-6 mt-2 space-y-1">
                        <li><strong className="text-foreground">De sesión:</strong> Se eliminan cuando cierras el navegador</li>
                        <li><strong className="text-foreground">Persistentes:</strong> Permanecen hasta su fecha de caducidad o hasta que las eliminas manualmente</li>
                      </ul>
                    </li>
                    <li>
                      <strong className="text-foreground">Propósito:</strong>
                      <ul className="list-circle pl-6 mt-2 space-y-1">
                        <li><strong className="text-foreground">Técnicas/Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                        <li><strong className="text-foreground">De preferencias:</strong> Guardan tus ajustes (idioma, región, etc.)</li>
                        <li><strong className="text-foreground">Analíticas:</strong> Recopilan estadísticas de uso anónimas</li>
                        <li><strong className="text-foreground">Publicitarias:</strong> Rastrean tu navegación para mostrar anuncios personalizados</li>
                      </ul>
                    </li>
                    <li>
                      <strong className="text-foreground">Origen:</strong>
                      <ul className="list-circle pl-6 mt-2 space-y-1">
                        <li><strong className="text-foreground">Propias:</strong> Instaladas por el sitio que visitas</li>
                        <li><strong className="text-foreground">De terceros:</strong> Instaladas por otros dominios (redes sociales, herramientas analytics, etc.)</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cookies que utilizamos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  2. Cookies que utilizamos
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    En Navarro Tax Legal tenemos un compromiso firme con la privacidad de nuestros usuarios. Por ello, <strong className="text-foreground">solo utilizamos cookies técnicas estrictamente necesarias</strong> para el funcionamiento del sitio web.
                  </p>
                  
                  <div className="bg-background border border-border rounded-lg p-6 my-6">
                    <h3 className="text-lg font-display font-normal text-foreground mb-4">
                      Cookies Técnicas Esenciales
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground">Cookies de sesión de administración</p>
                        <ul className="list-none pl-0 mt-2 space-y-1 text-sm">
                          <li><strong>Finalidad:</strong> Mantener la sesión activa de los administradores del sitio</li>
                          <li><strong>Duración:</strong> Sesión (se eliminan al cerrar el navegador)</li>
                          <li><strong>Tipo:</strong> Propia, técnica</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground">Cookies de preferencias de idioma</p>
                        <ul className="list-none pl-0 mt-2 space-y-1 text-sm">
                          <li><strong>Finalidad:</strong> Recordar el idioma seleccionado por el usuario</li>
                          <li><strong>Duración:</strong> Persistente (hasta 1 año)</li>
                          <li><strong>Tipo:</strong> Propia, técnica</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-foreground">Cookies de funcionalidad básica</p>
                        <ul className="list-none pl-0 mt-2 space-y-1 text-sm">
                          <li><strong>Finalidad:</strong> Garantizar el correcto funcionamiento de formularios y navegación</li>
                          <li><strong>Duración:</strong> Sesión</li>
                          <li><strong>Tipo:</strong> Propia, técnica</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 my-6">
                    <p className="font-semibold text-foreground mb-2">✅ Lo que NO hacemos:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong className="text-foreground">NO utilizamos cookies publicitarias</strong> para rastrearte o mostrarte anuncios personalizados</li>
                      <li><strong className="text-foreground">NO utilizamos cookies de análisis de terceros</strong> como Google Analytics o similares</li>
                      <li><strong className="text-foreground">NO compartimos tus datos de navegación</strong> con redes publicitarias</li>
                      <li><strong className="text-foreground">NO vendemos ni cedemos</strong> información de navegación a terceros</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Finalidad */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  3. Finalidad de las cookies
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Las cookies que utilizamos tienen exclusivamente las siguientes finalidades:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Autenticación:</strong> Mantener activas las sesiones de los administradores del sitio para gestionar contenidos de forma segura
                    </li>
                    <li>
                      <strong className="text-foreground">Preferencias del usuario:</strong> Recordar el idioma seleccionado y otras preferencias de visualización
                    </li>
                    <li>
                      <strong className="text-foreground">Funcionalidad técnica:</strong> Asegurar que los formularios de contacto y otras funcionalidades del sitio operen correctamente
                    </li>
                    <li>
                      <strong className="text-foreground">Seguridad:</strong> Prevenir ataques CSRF (Cross-Site Request Forgery) y otras vulnerabilidades de seguridad
                    </li>
                  </ul>
                  <p className="mt-4">
                    <strong className="text-foreground">Importante:</strong> Ninguna de estas cookies se utiliza para rastrear tu comportamiento de navegación con fines comerciales o publicitarios.
                  </p>
                </div>
              </div>

              {/* Base legal */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  4. Base legal (RGPD y ePrivacy)
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    El uso de cookies técnicas esenciales se basa en:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-foreground">Art. 6.1.f del RGPD (Reglamento General de Protección de Datos):</strong> Interés legítimo del responsable del tratamiento. Tenemos un interés legítimo en garantizar el correcto funcionamiento y seguridad del sitio web.
                    </li>
                    <li>
                      <strong className="text-foreground">Art. 5.3 de la Directiva ePrivacy 2002/58/CE (modificada por 2009/136/CE):</strong> Las cookies estrictamente necesarias para la prestación de un servicio de la sociedad de la información expresamente solicitado por el usuario están exentas del requisito de consentimiento previo.
                    </li>
                    <li>
                      <strong className="text-foreground">Ley 34/2002 (LSSI):</strong> Ley de Servicios de la Sociedad de la Información y de Comercio Electrónico española, que transpone la Directiva ePrivacy.
                    </li>
                  </ul>
                  
                  <div className="bg-background border border-border rounded-lg p-6 my-6">
                    <p className="font-semibold text-foreground mb-3">
                      ¿Por qué no hay un banner de cookies en este sitio?
                    </p>
                    <p>
                      Como <strong className="text-foreground">únicamente utilizamos cookies técnicas esenciales</strong>, no estamos obligados legalmente a solicitar tu consentimiento previo mediante un banner. Sin embargo, cumplimos con nuestro deber de transparencia informándote de su uso en esta Política de Cookies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gestión */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  5. ¿Cómo gestionar las cookies?
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies. A continuación, te indicamos cómo hacerlo en los navegadores más comunes:
                  </p>

                  <div className="space-y-6 mt-6">
                    <div className="bg-background border border-border rounded-lg p-6">
                      <h3 className="text-lg font-display font-normal text-foreground mb-3">
                        Google Chrome
                      </h3>
                      <ol className="list-decimal pl-6 space-y-2 text-sm">
                        <li>Haz clic en el menú de Chrome (tres puntos verticales) en la esquina superior derecha</li>
                        <li>Selecciona "Configuración" → "Privacidad y seguridad" → "Cookies y otros datos de sitios"</li>
                        <li>Desde aquí puedes bloquear todas las cookies, permitir solo las necesarias, o ver y eliminar cookies existentes</li>
                      </ol>
                      <p className="mt-3 text-sm">
                        Más info:{" "}
                        <a 
                          href="https://support.google.com/chrome/answer/95647" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          support.google.com/chrome
                        </a>
                      </p>
                    </div>

                    <div className="bg-background border border-border rounded-lg p-6">
                      <h3 className="text-lg font-display font-normal text-foreground mb-3">
                        Mozilla Firefox
                      </h3>
                      <ol className="list-decimal pl-6 space-y-2 text-sm">
                        <li>Haz clic en el menú (tres líneas horizontales) en la esquina superior derecha</li>
                        <li>Selecciona "Ajustes" → "Privacidad y seguridad"</li>
                        <li>En la sección "Cookies y datos de sitios", configura tus preferencias</li>
                      </ol>
                      <p className="mt-3 text-sm">
                        Más info:{" "}
                        <a 
                          href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          support.mozilla.org
                        </a>
                      </p>
                    </div>

                    <div className="bg-background border border-border rounded-lg p-6">
                      <h3 className="text-lg font-display font-normal text-foreground mb-3">
                        Safari (macOS y iOS)
                      </h3>
                      <ol className="list-decimal pl-6 space-y-2 text-sm">
                        <li><strong>macOS:</strong> Safari → Preferencias → Privacidad → Gestionar datos de sitios web</li>
                        <li><strong>iOS:</strong> Ajustes → Safari → Privacidad y seguridad → Bloquear todas las cookies</li>
                      </ol>
                      <p className="mt-3 text-sm">
                        Más info:{" "}
                        <a 
                          href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          support.apple.com
                        </a>
                      </p>
                    </div>

                    <div className="bg-background border border-border rounded-lg p-6">
                      <h3 className="text-lg font-display font-normal text-foreground mb-3">
                        Microsoft Edge
                      </h3>
                      <ol className="list-decimal pl-6 space-y-2 text-sm">
                        <li>Haz clic en el menú (tres puntos horizontales) en la esquina superior derecha</li>
                        <li>Selecciona "Configuración" → "Cookies y permisos de sitios"</li>
                        <li>Haz clic en "Cookies y datos de sitios" para gestionar tus preferencias</li>
                      </ol>
                      <p className="mt-3 text-sm">
                        Más info:{" "}
                        <a 
                          href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          support.microsoft.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 my-6">
                    <p className="font-semibold text-foreground mb-2">⚠️ Advertencia:</p>
                    <p>
                      Si bloqueas o eliminas las cookies técnicas esenciales, <strong className="text-foreground">algunas funcionalidades del sitio web pueden dejar de funcionar correctamente</strong>. Por ejemplo:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Es posible que tengas que volver a seleccionar tu idioma preferido cada vez que visites el sitio</li>
                      <li>Los formularios de contacto podrían no funcionar correctamente</li>
                      <li>Las sesiones de administración se cerrarán constantemente</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cookies de terceros */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  6. Cookies de terceros
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Como norma general, <strong className="text-foreground">NO utilizamos cookies de terceros</strong> en nuestro sitio web.
                  </p>
                  <p>
                    Sin embargo, debes tener en cuenta que:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Si el sitio incluye contenido embebido de terceros (por ejemplo, vídeos de YouTube, widgets de redes sociales), esos servicios pueden instalar sus propias cookies cuando interactúas con ellos.
                    </li>
                    <li>
                      Navarro Tax Legal no controla las cookies instaladas por terceros. Te recomendamos revisar las políticas de privacidad de esos servicios:
                      <ul className="list-circle pl-6 mt-2 space-y-1">
                        <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google / YouTube</a></li>
                        <li><a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">LinkedIn</a></li>
                        <li><a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Facebook / Instagram</a></li>
                        <li><a href="https://twitter.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Twitter</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Transferencias internacionales */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  7. Transferencias internacionales de datos
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Nuestros servidores están ubicados en la <strong className="text-foreground">Unión Europea</strong> y cumplen con el RGPD. Las cookies técnicas que utilizamos almacenan la información localmente en tu dispositivo o en nuestros servidores europeos.
                  </p>
                  <p>
                    <strong className="text-foreground">NO realizamos transferencias internacionales de datos</strong> fuera del Espacio Económico Europeo (EEE).
                  </p>
                  <p>
                    Si en el futuro necesitáramos realizar transferencias internacionales, lo haríamos únicamente bajo las garantías adecuadas previstas en el RGPD (Cláusulas Contractuales Tipo, Decisiones de Adecuación, etc.).
                  </p>
                </div>
              </div>

              {/* Actualización */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  8. Actualización de la política
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Navarro Tax Legal se reserva el derecho a modificar esta Política de Cookies en cualquier momento para adaptarla a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cambios en la legislación vigente</li>
                    <li>Nuevas funcionalidades del sitio web</li>
                    <li>Mejoras en la transparencia y claridad de la información</li>
                  </ul>
                  <p className="mt-4">
                    Te recomendamos revisar esta política periódicamente. La fecha de "Última actualización" al principio de esta página indica cuándo se realizó el último cambio.
                  </p>
                  <p>
                    Si realizamos cambios sustanciales (por ejemplo, empezar a utilizar cookies analíticas o publicitarias), te informaremos mediante un aviso destacado en el sitio web.
                  </p>
                </div>
              </div>

              {/* Más información */}
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-normal text-foreground">
                  9. Más información
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Para más información sobre cómo protegemos tu privacidad y tratamos tus datos personales, consulta:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <a href="/privacy" className="text-accent hover:underline font-normal">
                        Política de Privacidad
                      </a>{" "}
                      - Información completa sobre protección de datos personales (RGPD)
                    </li>
                    <li>
                      <a href="/legal" className="text-accent hover:underline font-normal">
                        Aviso Legal y Términos de Uso
                      </a>{" "}
                      - Condiciones generales de uso del sitio web
                    </li>
                  </ul>

                  <div className="bg-background border border-border rounded-lg p-6 my-6">
                    <h3 className="text-lg font-display font-normal text-foreground mb-3">
                      Contacto
                    </h3>
                    <p className="mb-3">
                      Si tienes dudas sobre esta Política de Cookies o sobre cómo gestionamos tus datos, puedes contactarnos en:
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

                  <p className="text-sm italic">
                    Navarro Tax Legal - Comprometidos con tu privacidad y la transparencia en el tratamiento de datos.
                  </p>
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
