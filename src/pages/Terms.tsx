import { Meta } from "@/components/seo/Meta";
import { Scale, FileText, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function Terms() {
  return (
    <>
      <Meta
        title="Condiciones Generales de Contratación | Grupo Navarro"
        description="Condiciones que regulan la prestación de servicios profesionales del Grupo Empresarial Navarro: jurídicos, fiscales, contables y laborales."
        keywords="condiciones contratación, términos servicio, honorarios, asesoría legal, fiscal, contable, laboral, Barcelona"
        canonicalUrl={`${window.location.origin}/condiciones-contratacion`}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-primary-foreground mb-6">
              Condiciones Generales de Contratación
            </h1>
            <p className="text-xl text-primary-foreground/90 font-light">
              Términos y condiciones de prestación de servicios profesionales
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
                <BreadcrumbPage>Condiciones de Contratación</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Last Update */}
            <div className="text-sm text-foreground border-l-4 border-accent pl-4">
              <p><strong>Última actualización:</strong> 12 de enero de 2025</p>
            </div>

            {/* Section 1: Entidades Prestadoras */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                1. Entidades Prestadoras de Servicios
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  Las presentes condiciones regulan la prestación de servicios profesionales por parte de las entidades del <strong>Grupo Empresarial Navarro</strong>, incluyendo servicios jurídicos, fiscales, contables y laborales.
                </p>
                <p>
                  Estas condiciones se aplican a todos los encargos realizados por los clientes del Grupo, complementando los términos específicos recogidos en la propuesta o presupuesto aceptado por cada cliente.
                </p>

                {/* Grupo Navarro - Cabecera */}
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Grupo Empresarial Navarro
                  </p>
                  <p className="text-sm text-foreground">
                    Prestadores conjuntos de servicios profesionales:
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

                <div className="mt-6 text-sm text-foreground bg-muted/20 p-4 rounded-lg">
                  <p>
                    <strong>Nota legal:</strong> Los servicios son prestados exclusivamente por el Grupo Empresarial Navarro a favor del cliente que los contrata y no podrán ser cedidos ni utilizados por terceros sin autorización expresa. La relación profesional se mantiene directamente con el Grupo, que asume la plena responsabilidad de los servicios prestados por sus profesionales o entidades asociadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Naturaleza de los Servicios */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                2. Naturaleza de los Servicios
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  El Grupo Empresarial Navarro presta servicios profesionales en las siguientes áreas:
                </p>

                {/* Servicios con diseño de tarjetas */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {/* Jurídica */}
                  <div className="border border-border/50 rounded-lg p-4 bg-muted/10">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Scale className="h-5 w-5 text-accent" />
                      Jurídica
                    </h4>
                    <p className="text-sm text-foreground">
                      Asesoramiento civil, mercantil, societario y contractual.
                    </p>
                  </div>

                  {/* Fiscal */}
                  <div className="border border-border/50 rounded-lg p-4 bg-muted/10">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Fiscal
                    </h4>
                    <p className="text-sm text-foreground">
                      Confección y presentación de declaraciones tributarias, planificación fiscal y defensa ante la Administración.
                    </p>
                  </div>

                  {/* Contable */}
                  <div className="border border-border/50 rounded-lg p-4 bg-muted/10">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Contable
                    </h4>
                    <p className="text-sm text-foreground">
                      Llevanza de la contabilidad conforme al Plan General Contable, cierres y elaboración de cuentas anuales.
                    </p>
                  </div>

                  {/* Laboral */}
                  <div className="border border-border/50 rounded-lg p-4 bg-muted/10">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Laboral
                    </h4>
                    <p className="text-sm text-foreground">
                      Gestión de nóminas, contratos, seguros sociales y asesoramiento en relaciones laborales e inspecciones.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-4 mt-4">
                  <p className="text-sm text-foreground">
                    <strong>Modalidades:</strong> Los servicios podrán prestarse de forma <strong>recurrente (mediante cuota periódica)</strong> o <strong>puntual (por proyecto o consulta)</strong>.
                  </p>
                </div>

                <p className="mt-4">
                  Cualquier modificación o ampliación de los servicios deberá acordarse por escrito entre las partes.
                </p>
              </div>
            </div>

            {/* Section 3: Honorarios y Facturación */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                3. Honorarios y Facturación
              </h2>
              <div className="space-y-3 text-foreground">
                <ul className="list-none space-y-3">
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.1</span>
                    <span>Los honorarios se fijan conforme a la propuesta económica aceptada por el cliente.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.2</span>
                    <span>Salvo indicación contraria, los importes no incluyen IVA ni otros impuestos indirectos.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.3</span>
                    <span>En los servicios recurrentes, la facturación será <strong>mensual</strong>, por adelantado, mediante domiciliación o transferencia bancaria.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.4</span>
                    <span>El impago de dos mensualidades consecutivas autoriza al Grupo a suspender temporalmente el servicio hasta su regularización.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.5</span>
                    <span>Los gastos y suplidos (notariales, registrales, procuradores, tasas administrativas, mensajería, etc.) serán asumidos por el cliente, pudiendo requerirse provisión de fondos para su gestión.</span>
                  </li>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 p-4 mt-4">
                  <p className="text-sm text-foreground">
                    <strong>⚠️ Importante:</strong> Los honorarios indicados en cada propuesta son exclusivos para el cliente que los contrata y no podrán ser cedidos a terceros sin autorización expresa del Grupo.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Obligaciones de las Partes */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                4. Obligaciones de las Partes
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Del Grupo */}
                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold text-foreground mb-3">Del Grupo Empresarial Navarro</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Prestar los servicios con la diligencia profesional debida.</li>
                      <li>Designar los profesionales responsables de cada área.</li>
                      <li>Mantener la confidencialidad y cumplir la normativa de protección de datos.</li>
                      <li>Comunicar al cliente cualquier circunstancia relevante para la prestación del servicio.</li>
                    </ul>
                  </div>

                  {/* Del Cliente */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-foreground mb-3">Del Cliente</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Facilitar información veraz, completa y actualizada para la correcta ejecución de los servicios.</li>
                      <li>Comunicar cualquier cambio relevante (societario, fiscal, laboral o de otra índole).</li>
                      <li>Abonar los honorarios en los plazos acordados.</li>
                      <li>Colaborar activamente en la obtención de documentación necesaria.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 mt-4">
                  <p className="text-sm text-foreground">
                    <strong>⚠️ Limitación de responsabilidad:</strong> El Grupo no será responsable de los daños, errores o perjuicios derivados de información incorrecta, incompleta o desactualizada proporcionada por el cliente, ni de decisiones adoptadas por el cliente sin la revisión previa del Grupo.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Duración y Terminación */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                5. Duración y Terminación
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  <strong>5.1 Duración inicial:</strong> Los contratos de servicios recurrentes tendrán una duración inicial de <strong>12 meses</strong>, prorrogándose automáticamente por períodos iguales salvo comunicación en contrario con <strong>30 días de antelación</strong> al vencimiento.
                </p>
                <p>
                  <strong>5.2 Resolución anticipada:</strong> Cualquiera de las partes podrá resolver la relación contractual en cualquier momento mediante comunicación escrita dirigida a la otra parte.
                </p>
                <p>
                  <strong>5.3 Obligaciones pendientes:</strong> En caso de resolución anticipada, el cliente deberá abonar los honorarios devengados hasta la fecha de efecto de la resolución, así como los trabajos en curso que se encuentren iniciados y que, por su naturaleza, deban finalizarse.
                </p>
                <p>
                  <strong>5.4 Devolución de documentación:</strong> Finalizada la relación contractual, el Grupo procederá a la devolución de la documentación original aportada por el cliente, conservando copia de aquella que resulte necesaria para el cumplimiento de obligaciones legales.
                </p>
              </div>
            </div>

            {/* Section 6: Confidencialidad */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                6. Confidencialidad
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  Toda la información y documentación facilitada por el cliente al Grupo Empresarial Navarro será tratada con carácter estrictamente confidencial y protegida conforme a la normativa aplicable en materia de protección de datos y secreto profesional.
                </p>
                <p>
                  Este deber de confidencialidad subsiste incluso tras la finalización de la relación profesional y se extiende a todos los profesionales, colaboradores y entidades del Grupo que tengan acceso a dicha información.
                </p>
                <p>
                  El Grupo no divulgará información confidencial a terceros salvo:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Autorización expresa y por escrito del cliente.</li>
                  <li>Obligación legal o requerimiento de autoridad competente.</li>
                  <li>Necesidad de compartir información con colaboradores externos (peritos, procuradores, etc.) vinculados por igual deber de confidencialidad.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Protección de Datos */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                7. Protección de Datos Personales
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  El Grupo Empresarial Navarro cumple con el <strong>Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD)</strong> y la <strong>Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)</strong>.
                </p>
                <p>
                  Cuando el Grupo trate datos personales por cuenta del cliente (por ejemplo, en servicios de gestión de nóminas, contabilidad o asesoramiento fiscal), actuará como <strong>encargado del tratamiento</strong>, suscribiéndose el correspondiente <strong>Contrato de Encargo de Tratamiento de Datos</strong> conforme al artículo 28 del RGPD.
                </p>
                <p>
                  El cliente, en su condición de responsable del tratamiento, garantiza que ha informado debidamente a los titulares de los datos personales sobre su tratamiento y que cuenta con la base legal necesaria para facilitar dichos datos al Grupo.
                </p>
                <p>
                  Para más información sobre el tratamiento de datos personales, consulte nuestra <a href="/privacidad" className="text-accent hover:underline">Política de Privacidad</a>.
                </p>
              </div>
            </div>

            {/* Section 8: Limitación de Responsabilidad */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                8. Limitación de Responsabilidad
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  La responsabilidad del Grupo Empresarial Navarro frente al cliente derivada de los servicios prestados se limita al <strong>importe máximo de los honorarios anuales percibidos por el servicio objeto de reclamación</strong>.
                </p>
                <p>
                  El Grupo no responderá en ningún caso de:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Daños indirectos, lucro cesante o pérdida de oportunidades comerciales.</li>
                  <li>Decisiones adoptadas por el cliente sin la revisión previa y aprobación del Grupo.</li>
                  <li>Errores o perjuicios derivados de información incorrecta, incompleta o desactualizada proporcionada por el cliente.</li>
                  <li>Actuaciones de terceros (notarios, registros, administraciones públicas, etc.) sobre las que el Grupo no tenga control directo.</li>
                  <li>Cambios normativos o criterios interpretativos de la Administración posteriores a la prestación del servicio.</li>
                </ul>
                <p>
                  La responsabilidad del Grupo se regirá en todo caso por las normas aplicables al ejercicio profesional de las actividades jurídicas, fiscales, contables y laborales, así como por la normativa colegial correspondiente.
                </p>
              </div>
            </div>

            {/* Section 9: Propiedad Intelectual */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                9. Propiedad Intelectual
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  Los informes, dictámenes, opiniones, modelos y demás documentos elaborados por el Grupo Empresarial Navarro son de su propiedad intelectual, sin perjuicio del derecho del cliente a utilizarlos para los fines objeto del encargo.
                </p>
                <p>
                  El cliente podrá utilizar dichos documentos exclusivamente para su <strong>uso interno</strong>, quedando expresamente prohibida su cesión, difusión, reproducción o comunicación pública a terceros sin autorización previa y por escrito del Grupo.
                </p>
                <p>
                  Los documentos y trabajos elaborados no podrán ser utilizados por el cliente en procedimientos o asuntos distintos a aquellos para los que fueron expresamente contratados, salvo autorización expresa del Grupo.
                </p>
              </div>
            </div>

            {/* Section 10: Legislación Aplicable y Jurisdicción */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                10. Legislación Aplicable y Jurisdicción
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  La relación contractual entre el Grupo Empresarial Navarro y el cliente se rige por la <strong>legislación española</strong>.
                </p>
                <p>
                  Para la resolución de cualquier controversia o conflicto que pudiera surgir en la interpretación, cumplimiento o ejecución de estas condiciones, las partes se someten expresamente a los <strong>Juzgados y Tribunales de la ciudad de Barcelona</strong>, renunciando a cualquier otro fuero que pudiera corresponderles, salvo que disposición legal imperativa establezca otra cosa.
                </p>
                <p>
                  En caso de que el cliente tenga la condición de consumidor conforme a la normativa de protección de consumidores y usuarios, será de aplicación el fuero correspondiente según dicha normativa.
                </p>
              </div>
            </div>

            {/* Section 11: Contacto */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-normal text-foreground">
                11. Contacto
              </h2>
              <div className="space-y-3 text-foreground">
                <p>
                  Para cualquier consulta, aclaración o comunicación relacionada con estas Condiciones Generales de Contratación, puede contactar con cualquiera de las entidades del Grupo Empresarial Navarro indicadas en la <strong>Sección 1</strong> de este documento.
                </p>
                <p>
                  También puede dirigirse a nuestros datos de contacto generales:
                </p>
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 mt-4">
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
}
