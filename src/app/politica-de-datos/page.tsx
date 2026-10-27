import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { COMPANY } from "@/lib/catalog-data";

// Texto tomado de "POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES.docx" (vigente desde el 26/10/2026)
export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales | Ancheta & Co.",
  description:
    "Conoce cómo Ancheta & Co. (Nativity World S.A.S.) recolecta, usa y protege tus datos personales, y cómo ejercer tus derechos según la Ley 1581 de 2012.",
  alternates: {
    canonical: "/politica-de-datos",
  },
};

const EFFECTIVE_DATE = "26 de octubre de 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-xl font-bold text-forest sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-gold-deep">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-gold-deep">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

function EmailLink() {
  return (
    <a
      href={`mailto:${COMPANY.dataProtectionEmail}`}
      className="font-semibold text-forest underline decoration-gold underline-offset-4 transition-colors hover:text-gold-deep"
    >
      {COMPANY.dataProtectionEmail}
    </a>
  );
}

export default function DataPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Encabezado oscuro: el header fijo es transparente arriba del todo */}
        <div className="bg-forest-deep pb-14 pt-32 text-cream pattern-stars sm:pb-16 sm:pt-36">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
              {COMPANY.brand}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Política de Tratamiento de Datos Personales
            </h1>
            <p className="mt-4 text-sm text-cream/70">
              Fecha de entrada en vigencia: {EFFECTIVE_DATE}
            </p>
          </div>
        </div>

        <article className="bg-cream py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Section title="1. Identificación del responsable del tratamiento">
              <p>
                La presente Política de Tratamiento de Datos Personales establece los términos
                bajo los cuales se recolectan, almacenan, utilizan, actualizan, transmiten y
                protegen los datos personales de los usuarios, clientes, proveedores y demás
                personas que interactúan con la marca {COMPANY.brand}
              </p>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:grid-cols-[auto_1fr]">
                <dt className="font-semibold text-forest">Responsable del tratamiento</dt>
                <dd>{COMPANY.legalName}</dd>
                <dt className="font-semibold text-forest">NIT</dt>
                <dd>{COMPANY.nit}</dd>
                <dt className="font-semibold text-forest">Domicilio</dt>
                <dd>Av. 6A Bis # 35-100, Of. 413, Centro Empresarial Chipichape</dd>
                <dt className="font-semibold text-forest">Correo para protección de datos</dt>
                <dd>
                  <EmailLink />
                </dd>
                <dt className="font-semibold text-forest">Página web</dt>
                <dd>www.anchetasco.com</dd>
              </dl>
              <p>
                Esta política se rige principalmente por la Ley 1581 de 2012, el Decreto 1074 de
                2015 y las demás normas colombianas aplicables en materia de protección de datos
                personales.
              </p>
            </Section>

            <Section title="2. Objeto y ámbito de aplicación">
              <p>
                Esta política tiene como finalidad informar a los titulares sobre el tratamiento
                que se dará a sus datos personales cuando visiten nuestra página web, soliciten
                cotizaciones, contacten a nuestro equipo comercial, realicen pedidos o mantengan
                relaciones comerciales con {COMPANY.brand}
              </p>
              <p>
                Aplica a clientes actuales y potenciales, representantes legales, empleados o
                funcionarios de empresas clientes, proveedores, aliados comerciales y usuarios de
                nuestros canales digitales.
              </p>
            </Section>

            <Section title="3. Finalidades del tratamiento">
              <p>Los datos personales podrán ser tratados para las siguientes finalidades:</p>
              <OrderedList
                items={[
                  "Recibir, gestionar y responder solicitudes de información y cotizaciones de anchetas corporativas.",
                  "Elaborar propuestas comerciales y presupuestos para empresas, instituciones y personas naturales.",
                  "Gestionar pedidos, contratos, pagos, facturación, despachos y entregas.",
                  "Coordinar la personalización de anchetas, maletines, empaques y productos con logotipos o mensajes corporativos.",
                  "Contactar a los clientes por correo electrónico, teléfono, WhatsApp u otros canales autorizados para atender solicitudes y hacer seguimiento comercial.",
                  "Enviar catálogos, novedades, promociones y comunicaciones comerciales, cuando exista la autorización correspondiente.",
                  "Mantener y actualizar bases de datos de clientes, prospectos, proveedores y aliados comerciales.",
                  "Cumplir obligaciones legales, tributarias, contables, contractuales y comerciales.",
                  "Prevenir fraudes, verificar operaciones y atender reclamaciones.",
                  "Mejorar la experiencia de navegación y el funcionamiento de nuestra página web mediante herramientas tecnológicas y, cuando corresponda, cookies.",
                  "Realizar análisis estadísticos y comerciales relacionados con nuestros productos y servicios.",
                  "Atender consultas, peticiones, quejas y reclamos relacionados con el tratamiento de datos personales.",
                ]}
              />
            </Section>

            <Section title="4. Datos personales que podemos recolectar">
              <p>Dependiendo de la interacción con el usuario, podremos recolectar:</p>
              <BulletList
                items={[
                  "Nombres y apellidos.",
                  "Nombre de la empresa, razón social y NIT, cuando corresponda.",
                  "Cargo y área de trabajo.",
                  "Número de teléfono y correo electrónico.",
                  "Ciudad y dirección de entrega, cuando sean necesarias para gestionar un pedido.",
                  "Información relacionada con cotizaciones, pedidos, facturación y relaciones comerciales.",
                  "Información que el usuario suministre voluntariamente al diligenciar formularios o comunicarse con nosotros.",
                  "Datos técnicos de navegación, dirección IP y cookies, según la configuración de la página web y las herramientas utilizadas.",
                ]}
              />
              <p>
                {COMPANY.brand} solicitará únicamente los datos pertinentes para las finalidades
                informadas.
              </p>
              <p>
                No solicitaremos datos sensibles como requisito general para cotizar o comprar
                nuestros productos.
              </p>
            </Section>

            <Section title="5. Autorización del titular">
              <p>
                El tratamiento de datos personales se realizará con la autorización previa, expresa
                e informada del titular, salvo las excepciones previstas en la ley.
              </p>
              <p>
                La autorización podrá obtenerse mediante formularios electrónicos, casillas de
                aceptación, comunicaciones escritas u otros mecanismos que permitan conservar
                evidencia del consentimiento.
              </p>
              <p>
                Cuando el usuario autorice el envío de comunicaciones comerciales, sus datos podrán
                utilizarse para remitir información sobre productos, catálogos, promociones y
                novedades de {COMPANY.brand}
              </p>
              <p>
                La autorización para recibir publicidad y promociones será independiente de la
                gestión necesaria para responder una cotización o ejecutar un pedido. El usuario
                podrá retirar su autorización para comunicaciones comerciales sin que ello afecte
                el tratamiento que resulte necesario para cumplir obligaciones legales o
                contractuales.
              </p>
            </Section>

            <Section title="6. Derechos de los titulares">
              <p>De acuerdo con la legislación colombiana, los titulares tienen derecho a:</p>
              <OrderedList
                items={[
                  "Conocer, actualizar y rectificar sus datos personales.",
                  "Solicitar prueba de la autorización otorgada, cuando sea exigible.",
                  "Ser informados sobre el uso que se ha dado a sus datos.",
                  "Presentar consultas y reclamos relacionados con el tratamiento.",
                  "Solicitar la revocatoria de la autorización o la supresión de sus datos cuando proceda legalmente.",
                  "Acceder gratuitamente a sus datos personales objeto de tratamiento.",
                  "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), una vez agotado el trámite de consulta o reclamo ante el responsable, cuando corresponda.",
                ]}
              />
              <p>
                Estos derechos se ejercerán conforme a los requisitos y excepciones establecidos en
                la normativa vigente.
              </p>
            </Section>

            <Section title="7. Procedimiento para consultas y reclamos">
              <p>
                Los titulares podrán presentar sus solicitudes a través del correo electrónico{" "}
                <EmailLink />.
              </p>
              <p>
                La solicitud deberá indicar, cuando sea necesario para tramitarla, el nombre del
                titular, los datos de contacto, la descripción de la consulta o reclamo y los
                documentos que permitan verificar su identidad o representación.
              </p>
              <p>
                Las consultas y reclamos se atenderán dentro de los términos legales aplicables. En
                particular, las consultas se resolverán dentro de los diez (10) días hábiles
                siguientes a su recepción, con posibilidad de ampliación en los términos previstos
                por la ley. Los reclamos se tramitarán dentro de los quince (15) días hábiles
                siguientes a su recepción, también con las posibilidades de ampliación legalmente
                establecidas.
              </p>
              <p>
                Si la solicitud está incompleta, se requerirá al interesado para que la subsane
                conforme al procedimiento legal.
              </p>
            </Section>

            <Section title="8. Uso de cookies y tecnologías similares">
              <p>
                Nuestra página web podrá utilizar cookies y tecnologías similares para facilitar la
                navegación, recordar preferencias, medir el funcionamiento del sitio y, si se
                encuentran implementadas y cuentan con las autorizaciones necesarias, realizar
                análisis de uso o actividades publicitarias.
              </p>
              <p>
                El usuario podrá gestionar las cookies mediante las opciones disponibles en su
                navegador y, cuando corresponda, mediante el mecanismo de preferencias habilitado
                en la página web.
              </p>
              <p>
                Las cookies que no sean estrictamente necesarias se gestionarán conforme a los
                consentimientos y requisitos legales aplicables.
              </p>
            </Section>

            <Section title="9. Transmisión y transferencia de datos">
              <p>
                Los datos personales podrán ser compartidos con proveedores tecnológicos, servicios
                de alojamiento web, plataformas de comunicación, operadores logísticos, proveedores
                de facturación y otros terceros que apoyen la operación comercial de{" "}
                {COMPANY.brand}, como marca comercial, y de {COMPANY.legalName}, únicamente cuando
                resulte necesario para las finalidades informadas y de acuerdo con la normativa
                aplicable.
              </p>
              <p>
                Cuando un tercero trate datos por cuenta del responsable, se adoptarán las medidas
                contractuales y de seguridad que correspondan.
              </p>
              <p>
                Las transferencias internacionales de datos, cuando se presenten, estarán sujetas a
                las condiciones y restricciones previstas en la legislación colombiana.
              </p>
              <p>No venderemos datos personales a terceros.</p>
            </Section>

            <Section title="10. Seguridad y confidencialidad">
              <p>
                Adoptaremos medidas técnicas, humanas, administrativas y organizativas razonables
                para proteger los datos personales frente a pérdida, acceso no autorizado,
                alteración, divulgación o uso indebido.
              </p>
              <p>
                El acceso a la información se limitará a las personas que la necesiten para cumplir
                funciones autorizadas. Asimismo, procuraremos que los proveedores que intervengan
                en el tratamiento mantengan condiciones adecuadas de confidencialidad y seguridad.
              </p>
            </Section>

            <Section title="11. Conservación de los datos">
              <p>
                Los datos personales se conservarán durante el tiempo necesario para cumplir las
                finalidades autorizadas y las obligaciones legales, contables, tributarias y
                contractuales aplicables.
              </p>
              <p>
                Cuando los datos dejen de ser necesarios y no exista una obligación legal o
                contractual de conservarlos, se procederá a su supresión o anonimización, según
                corresponda.
              </p>
            </Section>

            <Section title="12. Datos de terceros suministrados por clientes">
              <p>
                Cuando un cliente suministre datos de destinatarios de anchetas, funcionarios,
                empleados u otras personas para gestionar entregas o personalizaciones, deberá
                contar con la autorización o fundamento jurídico necesario para suministrarlos y
                garantizar que la información se utilice para la finalidad informada.
              </p>
              <p>
                {COMPANY.brand} tratará esos datos únicamente para las actividades relacionadas con
                el pedido, la entrega y las demás finalidades legítimas que hayan sido debidamente
                informadas.
              </p>
            </Section>

            <Section title="13. Modificaciones de la política">
              <p>
                {COMPANY.brand} podrá actualizar esta política cuando sea necesario por cambios
                legales, operativos o comerciales. Las modificaciones sustanciales se comunicarán
                por los medios adecuados, de conformidad con la normativa aplicable.
              </p>
              <p>La versión vigente estará disponible en nuestra página web.</p>
            </Section>

            <Section title="14. Vigencia">
              <p>
                La presente política rige a partir de la fecha de su publicación y se aplicará a
                los tratamientos de datos personales realizados por el responsable identificado en
                esta política.
              </p>
            </Section>

            <div className="mt-12 border-t border-forest/10 pt-6 text-sm text-foreground/70">
              <p className="font-display text-base font-bold text-forest">{COMPANY.brand}</p>
              <p className="mt-1">
                <EmailLink />
              </p>
              <p className="mt-1">www.anchetasco.com</p>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
