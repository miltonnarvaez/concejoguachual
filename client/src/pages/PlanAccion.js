import React from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { 
  FaFileAlt, FaUsers, FaChartLine, FaCheckCircle, FaCalendarAlt,
  FaBullseye, FaEye, FaHandshake, FaGavel, FaBook, FaLaptop,
  FaArchive, FaShieldAlt, FaComments, FaGlobe, FaUserTie,
  FaSyncAlt, FaEye as FaEyeIcon, FaDownload, FaSitemap,
  FaUserSecret, FaUserCog, FaClipboardList, FaTasks, FaMapMarkerAlt
} from 'react-icons/fa';
import './PlanAccion.css';

const PlanAccion = () => {
  const mesaDirectiva = [
    {
      nombre: 'JOHANA ELIZABETH CUATIN GALINDRES',
      cargo: 'Presidenta',
      periodo: 'MESA DIRECTIVA PERIODO 2025'
    },
    {
      nombre: 'JERCY BLADIMIR AZA',
      cargo: 'Primer Vicepresidente',
      periodo: 'MESA DIRECTIVA PERIODO 2025'
    },
    {
      nombre: 'ROMMEL ALVEIRO CUASTUMAL RODRIGUEZ',
      cargo: 'Segundo Vicepresidente Ad Hoc',
      periodo: 'MESA DIRECTIVA PERIODO 2025'
    },
    {
      nombre: 'ANGELA CRISTINA HERNÁNDEZ REINA',
      cargo: 'Secretaria General',
      periodo: 'Vigencia 2025'
    }
  ];

  const valores = [
    { nombre: 'RESPONSABILIDAD', icono: FaHandshake },
    { nombre: 'ÉTICA', icono: FaShieldAlt },
    { nombre: 'PARTICIPACIÓN', icono: FaUsers },
    { nombre: 'IMPARCIALIDAD', icono: FaGavel },
    { nombre: 'HONESTIDAD', icono: FaCheckCircle },
    { nombre: 'LEALTAD', icono: FaHandshake },
    { nombre: 'PRUDENCIA', icono: FaEyeIcon },
    { nombre: 'RESPETO', icono: FaUsers },
    { nombre: 'INTEGRIDAD', icono: FaShieldAlt },
    { nombre: 'TOLERANCIA', icono: FaComments }
  ];

  const politicasCalidad = [
    'Posibilitar la participación ciudadana fomentando los mecanismos de participación establecidos en la Constitución y la Ley y propiciando la realización de los Cabildos Abiertos y la participación en los debates a los proyectos de acuerdo.',
    'Ejercer el Control Político a la Administración Municipal, los entes Descentralizados.',
    'Ejercer el control Especial a las Empresas de Servicios Públicos.',
    'Contribuir a la solución y satisfacción de las necesidades básicas de la comunidad mediante la generación de Acuerdos que permitan el cumplimiento del Plan de Desarrollo Municipal acorde con las metas del milenio.',
    'Adelantar acciones eficientes, eficaces y efectivas, ajustadas al marco legal, al bien general y mejoramiento continuo de los Procesos.',
    'Implementar, desarrollar y garantizar la actualización de la estrategia de Gobierno en Línea, mediante la modernización tecnológica, capacitación y formación de los Concejales y la Secretaria General del Concejo a fin de generar una cultura proactiva del uso de los medios electrónicos de información al servicio del desarrollo social y el mejoramiento de la calidad de vida de la comunidad.'
  ];

  const objetivosCalidad = [
    'Implementar sistema tecnológico de comunicación en el Concejo Municipal.',
    'Desarrollar mecanismos eficaces que aseguren la satisfacción de los usuarios y demás partes interesadas, así como los legales y reglamentarios aplicables a la Corporación.',
    'Documentar e implementar procedimientos participativos y efectivos que aseguren el mejoramiento continuo del Sistema de Gestión Integral y sus procesos.',
    'Velar por la objetividad, transparencia y efectividad de los procesos de desarrollo y cualificación de las competencias de su talento humano.',
    'Gestionar de manera eficiente y oportuna los recursos de infraestructura y de ambiente de trabajo necesarios para la prestación de los servicios y la gestión de los procesos internos.',
    'Posibilitar el desarrollo de la comunidad a través de la toma de decisiones ajustadas a la ley, que propendan por el bien general.',
    'Promover los mecanismos de participación comunitaria mediante audiencias públicas, cabildos abiertos y espacios de intervención ciudadana para conocer sus expectativas y satisfacer sus necesidades.',
    'Propiciar la consecución de los recursos necesarios y su utilización eficiente, eficaz y efectiva para velar por el oportuno desarrollo del Municipio.',
    'Desarrollar mecanismos de mejoramiento continuo que faciliten la gestión del Concejo Municipal.',
    'Ejercer oportuno y eficiente control político a los servidores públicos en relación con su desempeño público y administrativo.'
  ];

  const objetivosEspecificos = [
    'Implementar tecnologías de la información en el Concejo Municipal, la logística para los procesos de aseguramiento documental de las sesiones, procesos y procedimientos llevados a cabo.',
    'Ejecutar acciones que garanticen la actualización de la información acerca de los trámites y servicios que presta la administración municipal a la comunidad y a los diferentes actores del desarrollo local y facilitar el acceso de la ciudadanía a la información que le permita saber cómo puede participar e incidir en las decisiones de la administración municipal con el fin de lograr una legítima Gobernabilidad por el progreso del municipio.',
    'Gestionar ante la Alcaldía, Gobernación y entidades gubernamentales para acceder a los recursos financieros con el fin de implementar y adecuar tecnológica y logísticamente el Concejo Municipal.',
    'Implementar procesos que integren a la comunidad al reconocimiento de la calidad implementada en el Concejo Municipal.',
    'Contratar o afiliar a la Corporación a una entidad que preste los servicios de Unidad de Apoyo Normativo de conformidad con el artículo 78 de la Ley 617 de 2000.',
    'Actualizar el Reglamento Interno del Concejo Municipal y adecuar sus disposiciones a los últimos cambios normativos, garantizando el cumplimiento de la Ley de Bancadas y el correcto trámite de los proyectos de Acuerdo que se sometan a consideración de la Corporación.',
    'Desarrollar actividades para la sostenibilidad y mejoramiento del MECI y la Ley de Archivo a fin de rendir los informes de ley correspondientes al Departamento Administrativo de la Función Pública y el Archivo General de la Nación.',
    'Adecuar y publicar al finalizar el año la Gaceta del Concejo Municipal y disponer su distribución entre la comunidad.',
    'Expedir los manuales de procesos y procedimientos, el manual de contratación, el código de ética y el manual de funciones y competencias laborales.'
  ];

  const herramientasEsperadas = [
    'Plan de Acción',
    'Programa de Transparencia y ética pública',
    'Plan Anual de Adquisiciones',
    'Manual de Contratación',
    'Código de Ética',
    'Plan de Rendición de Cuentas',
    'Reglamento Interno Actualizado',
    'Tablas de Retención Documental',
    'Tablas de Valoración Documental'
  ];

  const diagnostico = [
    'El Concejo Municipal no tiene implementado y/o actualizado su manual de contratación junto con las minutas de contratación pública.',
    'Baja participación de la ciudadanía en las sesiones que realiza el Concejo Municipal.',
    'Los Concejales no se cuentan con la suficiente preparación para presentar proyectos de acuerdo de iniciativa propia.',
    'Se exige a la secretaria la transcripción literal de las sesiones en las actas, contrario a lo que dispone el artículo 26 de la ley 136 de 1994.',
    'El Concejo no ha elaborado/implementado/actualizado el Sistema de Control Interno de conformidad con la ley 87 de 1993.',
    'El Concejo no ha presentado el informe de FURAG, que es indicador con el que se mide el desempeño de las entidades en diferentes áreas.',
    'La Secretaria del concejo y los Concejales no cuentan con suficiente capacitación en temas de la función pública por lo cual se requiere mayor capacitación.',
    'El Concejo no tiene implementada la Ley de Archivo junto con los procesos de gestión documental o no ha actualizado las tablas de retención y valoración documental.',
    'El Concejo no ha implementado la rendición de cuentas a la que hace referencia el artículo 58 de la Ley 1757 de 2015.',
    'El Concejo no tiene implementado en forma total la publicación de los procesos de contratación en la página pública del SECOP.',
    'El Concejo no cuenta con página web propia ni redes sociales o la página está desactualizada, dado que existe una página web compartida con la alcaldía de Guachucal.',
    'El Concejo tiene sus equipos de sistemas y de cómputo, desactualizados e inservibles.',
    'El Concejo tiene desactualizado su reglamento interno.',
    'El Concejo no cuenta con asesoría jurídica o unidades de apoyo normativo.',
    'El Concejo no tiene reglamentado el manejo de caja menor.',
    'El Concejo tiene bienes muebles obsoletos o en desuso que provocan hacinamiento y debe dárseles de baja.',
    'El Concejo no ha implementado el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST).',
    'El Concejo obtuvo un bajo puntaje en la medición del índice de Transparencia y Acceso a la Información Pública – ITA.',
    'El Concejo no ha creado la Comisión Especial para la Equidad de la Mujer y Genero o no la ha puesto a funcionar.',
    'El Concejo no cuenta con un Comité de Bajas y un procedimiento para dar de baja bienes muebles.',
    'El Concejo no ha reglamentado el funcionamiento de la Comisión de Ética, ni ha adoptado el Código de Ética.',
    'El Concejo no transmite las sesiones por redes sociales o canales comunitarios de televisión.',
    'El Concejo no tiene sistema de sonido y micrófonos que garanticen una correcta interlocución.',
    'El Concejo no ha suministrado carnet y chaquetas o camisas institucionales a los Honorables Concejales y la Secretaria General para el fortalecimiento de la imagen corporativa ante la ciudadanía.',
    'El Concejo no cuenta con servicio de internet propio y/o un equipo de celular con plan de minutos y datos para la oficina de la Secretaría General.',
    'El Concejo no brinda refrigerios a los Concejales en periodo de sesiones.',
    'El Concejo no realiza procesos de seguimiento a los planes adoptados.',
    'El Concejo no se siente preparado para la realización directa del Concurso Público y Abierto de Méritos para la elección de Personero Municipal y no cuenta con recursos financieros necesario para contratar y pagar por el proceso de selección a una Universidad o entidad especializada en estos procesos.',
    'El Concejo no realiza seguimiento al cumplimiento de los Acuerdos Municipales aprobados.',
    'El Concejo no tienen claras sus competencias en materia de control, confunde el control político con el control administrativo y el control especial.',
    'El Concejo no realiza seguimiento y mantenimiento preventivo y/o correctivos a los equipos tecnológicos.'
  ];

  const beneficiosMECI = [
    'Se construye y fortalece la ética institucional.',
    'Se previenen los riesgos.',
    'Se obtiene una organización por procesos.',
    'Se encauza la entidad hacía un control corporativo permanente.',
    'Se mide la gestión en tiempo real.',
    'Se enfatiza en la generación de información suficiente, pertinente, oportuna, de utilidad organizacional y social.',
    'Se articula con los sistemas de información existentes.',
    'Se controla la efectividad de los procesos de comunicación pública y rendición de cuentas.',
    'Se fortalece la función de evaluación independiente al control y la gestión.',
    'Se orienta hacía la estandarización de metodologías y procedimientos de evaluación del sistema de control interno.',
    'Se otorga alto nivel de importancia a los planes de mejoramiento.'
  ];

  const beneficiosArchivo = [
    'Garantizar el acceso de los ciudadanos a los documentos públicos, en cumplimiento de las normas vigentes en la materia.',
    'Seleccionar, organizar, conservar y divulgar el acervo documental del Concejo.',
    'Recibir las transferencias documentales secundarias, de conformidad con el plan que se elabore conjuntamente con los Entes Municipales.',
    'Implementar los lineamientos y políticas que imparta el Archivo General de la Nación, referidos a la preservación de los documentos electrónicos.',
    'Atender los lineamientos que emita el Ministerio de Tecnologías de la Información y las Comunicaciones referentes al uso de medios electrónicos.',
    'Promover la organización y el fortalecimiento de los archivos del orden municipal.',
    'Establecer relaciones y acuerdos de cooperación con instituciones educativas, culturales y de investigación.',
    'Promover la formación y capacitación del personal vinculado a los archivos.',
    'Participar en proyectos de recuperación de memoria y formación de identidad apoyándose en la documentación contenida en sus fondos documentales.',
    'Llevar actualizado el libro Registro de Inventario Documental, consignando los ingresos y salidas documentales.',
    'Organizar la documentación que se encuentre bajo la responsabilidad del Archivo del Concejo.',
    'Elaborar los Instrumentos descriptivos (Guías, Inventarios, catálogos e Índices), necesarios para la prestación eficiente y eficaz de los servicios Archivísticos.',
    'Elaborar e implementar el Sistema de Conservación Documental SCD.',
    'Elaborar, actualizar y/o ajustar las Tablas de Retención Documental TRD.',
    'Elaborar e implementar las Tablas de Valoración Documental TVD.',
    'Diseñar e Implementar el Programa de Gestión Documental (PGD) para el Concejo.',
    'Implementar procesos de selección y eliminación documental, cumpliendo con los plazos de retención.',
    'Ejecutar los procesos de reproducción documental mediante técnicas de microfilmación y/o digitalización.',
    'Ofrecer los servicios de información y reprografía, a usuarios internos como externo del concejo municipal.'
  ];

  return (
    <div className="plan-accion-page">
      {/* Hero Section */}
      <AnimatedSection className="section plan-hero" animationType="fadeIn">
        <div className="container">
          <div className="plan-hero-content">
            <FaFileAlt className="plan-hero-icon" />
            <h1 className="page-title">Plan de Acción 2025</h1>
            <p className="plan-hero-subtitle">
              Concejo Municipal de Guachucal - Nariño
            </p>
            <p className="plan-hero-date">
              <FaCalendarAlt /> Enero 30 de 2025
            </p>
            <p className="plan-hero-resolucion">
              Resolución Nº. 008 de 2025
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Mesa Directiva */}
      <AnimatedSection className="section mesa-directiva-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Mesa Directiva 2025</h2>
          <div className="mesa-directiva-grid">
            {mesaDirectiva.map((miembro, index) => (
              <div key={index} className="mesa-directiva-card">
                <div className="mesa-directiva-cargo">{miembro.cargo}</div>
                <h3 className="mesa-directiva-nombre">{miembro.nombre}</h3>
                <p className="mesa-directiva-periodo">{miembro.periodo}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Estructura Jerárquica */}
      <AnimatedSection className="section estructura-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Estructura Jerárquica del Concejo</h2>
          <p className="section-subtitle">
            Organización y jerarquía institucional del Concejo Municipal de Guachucal
          </p>
          <div className="estructura-organigrama">
            {/* Nivel 1: Presidencia */}
            <div className="estructura-nivel nivel-1">
              <div className="estructura-card presidencia">
                <FaGavel className="estructura-icon" />
                <h3>PRESIDENCIA</h3>
                <p>JOHANA ELIZABETH CUATIN GALINDRES</p>
                <span className="estructura-cargo">Presidenta</span>
              </div>
            </div>

            {/* Nivel 2: Vicepresidencias y Secretaría */}
            <div className="estructura-nivel nivel-2">
              <div className="estructura-card vicepresidencia">
                <FaUserTie className="estructura-icon" />
                <h4>PRIMER VICEPRESIDENTE</h4>
                <p>JERCY BLADIMIR AZA</p>
              </div>
              <div className="estructura-card vicepresidencia">
                <FaUserTie className="estructura-icon" />
                <h4>SEGUNDO VICEPRESIDENTE</h4>
                <p>ROMMEL ALVEIRO CUASTUMAL RODRIGUEZ</p>
                <span className="estructura-badge">Ad Hoc</span>
              </div>
              <div className="estructura-card secretaria">
                <FaUserSecret className="estructura-icon" />
                <h4>SECRETARÍA GENERAL</h4>
                <p>ANGELA CRISTINA HERNÁNDEZ REINA</p>
              </div>
            </div>

            {/* Nivel 3: Concejales y Comisiones */}
            <div className="estructura-nivel nivel-3">
              <div className="estructura-card concejales">
                <FaUsers className="estructura-icon" />
                <h4>CONCEJALES</h4>
                <p>Honorables Concejales del Municipio</p>
                <div className="estructura-funciones">
                  <p><strong>Funciones principales:</strong></p>
                  <ul>
                    <li>Ejercer control político</li>
                    <li>Participar en debates</li>
                    <li>Presentar proyectos de acuerdo</li>
                    <li>Integrar comisiones</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Nivel 4: Comisiones y Apoyo */}
            <div className="estructura-nivel nivel-4">
              <div className="estructura-card comisiones">
                <FaClipboardList className="estructura-icon" />
                <h4>COMISIONES PERMANENTES</h4>
                <p>Comisiones establecidas según reglamento interno</p>
              </div>
              <div className="estructura-card comisiones">
                <FaTasks className="estructura-icon" />
                <h4>COMISIONES ACCIDENTALES</h4>
                <p>Comisiones creadas para temas específicos</p>
              </div>
              <div className="estructura-card apoyo">
                <FaUserCog className="estructura-icon" />
                <h4>UNIDAD DE APOYO NORMATIVO</h4>
                <p>Asesoría jurídica y normativa</p>
              </div>
            </div>

            {/* Nivel 5: Personal Administrativo */}
            <div className="estructura-nivel nivel-5">
              <div className="estructura-card administrativo">
                <FaUsers className="estructura-icon" />
                <h4>PERSONAL ADMINISTRATIVO</h4>
                <p>Personal de apoyo administrativo y técnico</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Presentación */}
      <AnimatedSection className="section presentacion-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Presentación</h2>
          <div className="presentacion-content">
            <p>
              La Mesa Directiva del Honorable Concejo Municipal de Guachucal, dando cumplimiento al artículo 74 de la ley 1474 de 2011, 
              pone a disposición de la ciudadanía el Plan de Acción del Concejo Municipal que regirá las actuaciones administrativas y 
              presupuestales de la entidad en la vigencia fiscal 2025.
            </p>
            <p>
              El Plan de Acción del Concejo Municipal permite determinar y asignar las tareas a los servidores públicos que integran la 
              Corporación, se definen los plazos de tiempo y se calcula el uso de los recursos de que dispone la Corporación para cumplir 
              con sus fines y funciones constitucionales y legales.
            </p>
            <p>
              Mediante el presente documento, la comunidad y los Concejales tendrán acceso a una presentación resumida de las tareas que 
              deben realizarse por ciertas personas que hacen parte del Concejo en un tiempo determinado, utilizando un monto de recursos 
              asignados con el fin de lograr un objetivo dado.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Misión y Visión */}
      <AnimatedSection className="section mision-vision-section" animationType="fadeInUp">
        <div className="container">
          <div className="mision-vision-grid">
            <div className="mision-vision-card">
              <div className="mision-vision-icon">
                <FaBullseye />
              </div>
              <h3>Misión</h3>
              <p>
                El Concejo Municipal de Guachucal es una Corporación Administrativa Pública de elección popular y de carácter deliberante, 
                encargada de ejercer el control político, facilitar y consolidar la democracia local, decidir lo conveniente para el buen vivir, 
                el desarrollo humano sostenible y el crecimiento de municipio, fortaleciendo la participación comunitaria y con ello velar por 
                el buen uso de los recursos y bienes, como patrimonio que nos pertenece a todos los habitantes del municipio de Guachucal.
              </p>
            </div>
            <div className="mision-vision-card">
              <div className="mision-vision-icon">
                <FaEye />
              </div>
              <h3>Visión</h3>
              <p>
                Como corporación político-administrativa del municipio de Guachucal proyecta consolidarse como el órgano colegiado representante 
                de la voluntad popular, que busca en forma permanente desarrollar una administración regida bajo claros principios éticos, que 
                permitan orientar su gestión en beneficio de las comunidades, permitiéndole ser voceros e intérpretes de los diferentes sectores 
                ciudadanos, orientando su trabajo hacia un control político efectivo, con el objeto de desarrollar una administración de calidad.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Diagnóstico */}
      <AnimatedSection className="section diagnostico-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Diagnóstico del Concejo</h2>
          <p className="section-subtitle">
            El Comité de Planeamiento integrado por la Mesa Directiva y la Secretaría General se reunieron para analizar el Concejo Municipal, 
            su funcionamiento Interno e Imagen Institucional y encontró las siguientes deficiencias:
          </p>
          <div className="diagnostico-grid">
            {diagnostico.map((deficiencia, index) => (
              <div key={index} className="diagnostico-item">
                <div className="diagnostico-number">{index + 1}</div>
                <p>{deficiencia}</p>
              </div>
            ))}
          </div>
          <div className="diagnostico-summary">
            <p><strong>Total: 31 deficiencias identificadas</strong></p>
          </div>
        </div>
      </AnimatedSection>

      {/* Proyección Comunitaria */}
      <AnimatedSection className="section proyeccion-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Proyección Comunitaria</h2>
          <div className="proyeccion-content">
            <div className="proyeccion-item">
              <FaUsers className="proyeccion-icon" />
              <h3>El Concejo Somos Todos</h3>
              <p>
                El papel que desarrolla el Concejo debe ser más protagónico, obviamente dentro de los parámetros constitucionales que el rol lo permite, 
                sin embargo, se debe designar una Comisión que realice un monitoreo permanente a las necesidades que son expresadas por las Comunidades, 
                que en muchas ocasiones son repetitivas y quizá puedan ser resueltas mediante Proyectos de Acuerdo o iniciativas desde el Cabildo Municipal.
              </p>
            </div>
            <div className="proyeccion-item">
              <FaMapMarkerAlt className="proyeccion-icon" />
              <h3>El Concejo en las Veredas</h3>
              <p>
                No debemos desconocer su vocación agropecuaria, de hecho, el territorio está constituido por el sector rural y la importancia radica 
                básicamente en aspectos como la competitividad del sector productivo, el cual debe estar acorde con el de los municipios con los cuales 
                se colinda y específicamente con la Agenda Interna. Por ello el Concejo, debe descentralizarse y llevar el Cabildo al sector rural el cual 
                nutre al municipio y le da vida, es así como se debe pensar en sus necesidades, generar propuestas y acompañarlo con soluciones y el Concejo 
                será el canalizador de dichas acciones a favor de nuestros campesinos e indígenas, teniendo como punto de partida la participación voluntaria 
                de los concejales.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Valores */}
      <AnimatedSection className="section valores-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Nuestros Principios y Valores</h2>
          <p className="section-subtitle">
            Los valores del Concejo Municipal son las convicciones profundas que respetamos todos aquellos que integramos la Corporación e 
            interactuamos con ella, que determinan nuestra manera de ser y de orientar nuestra conducta.
          </p>
          <div className="valores-grid">
            {valores.map((valor, index) => (
              <div key={index} className="valor-card">
                <div className="valor-icon">
                  {React.createElement(valor.icono)}
                </div>
                <h4>{valor.nombre}</h4>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Políticas de Calidad */}
      <AnimatedSection className="section politicas-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Políticas de Calidad</h2>
          <div className="politicas-list">
            {politicasCalidad.map((politica, index) => (
              <div key={index} className="politica-item">
                <FaCheckCircle className="politica-icon" />
                <p>{politica}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Objetivos de Calidad */}
      <AnimatedSection className="section objetivos-calidad-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Objetivos de Calidad</h2>
          <div className="objetivos-list">
            {objetivosCalidad.map((objetivo, index) => (
              <div key={index} className="objetivo-item">
                <FaChartLine className="objetivo-icon" />
                <p>{objetivo}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Objetivos Específicos */}
      <AnimatedSection className="section objetivos-especificos-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Objetivos Específicos</h2>
          <div className="objetivos-list">
            {objetivosEspecificos.map((objetivo, index) => (
              <div key={index} className="objetivo-item">
                <FaBullseye className="objetivo-icon" />
                <p>{objetivo}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Fortalecimiento Institucional */}
      <AnimatedSection className="section fortalecimiento-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Fortalecimiento Institucional</h2>
          <div className="fortalecimiento-content">
            <div className="fortalecimiento-item">
              <FaLaptop className="fortalecimiento-icon" />
              <h3>Concejo Tecnológico</h3>
              <p>
                En materia tecnológica es indispensable mejorar el acceso a internet al interior del cabildo, a su vez poder dotar a toda la 
                Mesa Directiva de computadores y tener una capacidad instalada de computadores e impresoras a los concejales. Se requieren 
                elementos como Video-Beam, Micrófonos, Sonido, Cámaras, etc.
              </p>
            </div>
            <div className="fortalecimiento-item">
              <FaShieldAlt className="fortalecimiento-icon" />
              <h3>El Concejo si Controla</h3>
              <p>
                El Concejo Municipal, al ser una entidad pública, se encuentra sometida a una serie de obligaciones periódicas a las que se 
                les debe hacer seguimiento y evaluación para garantizar su cumplimiento. Una de estas obligaciones es la implementación del 
                Modelo Estándar de Control Interno –MECI- la cual busca mejorar los procesos y controlar los riesgos en el Concejo Municipal.
              </p>
              <div className="beneficios-list">
                <h4>Beneficios del MECI:</h4>
                <ul>
                  {beneficiosMECI.map((beneficio, index) => (
                    <li key={index}>{beneficio}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="fortalecimiento-item">
              <FaComments className="fortalecimiento-icon" />
              <h3>Un Concejo Ciudadano</h3>
              <p>
                Se fomentará la realización de Cabildos Abiertos en cumplimiento de lo dispuesto por la Ley de Participación Ciudadana. Para 
                tales fines se harán jornadas de capacitación y sensibilización para enseñar a los presidentes de juntas de acción comunal y a 
                la comunidad en general el uso de esta herramienta ciudadana para discutir pacíficamente los temas coyunturales del municipio.
              </p>
            </div>
            <div className="fortalecimiento-item">
              <FaGlobe className="fortalecimiento-icon" />
              <h3>Un Concejo Visible</h3>
              <p>
                En vigencia de la Ley 1551 de 2012 y la aplicación de las Tecnologías de la Información y las Comunicaciones del Ministerio de 
                las TICs el Concejo Municipal se encuentra obligado a hacer uso de los medios de comunicación tecnológicos que usualmente usa 
                la comunidad. Es por ello que una de las tareas especiales que se adelantará en el Concejo es el fortalecimiento de los canales 
                de comunicación con la comunidad, para lo cual se pondrá en funcionamiento las redes sociales del Concejo y la Pagina Web Institucional.
              </p>
            </div>
            <div className="fortalecimiento-item">
              <FaUserTie className="fortalecimiento-icon" />
              <h3>Un Concejo Asesorado</h3>
              <p>
                Los Concejos Municipales tienen derecho a contar con Unidades de Apoyo Normativo; así lo dispone el artículo 78 de la Ley 617 de 
                2000 que dispone que "Las asambleas y concejos podrán contar con unidades de apoyo normativo, siempre que se observen los límites 
                de gastos a que se refieren los Artículos 8º, 10, 11, 54 y 55". Es por ello que se contratarán los servicios de un asesor o firma 
                asesora en materia financiera y jurídica para el Concejo Municipal o en su defecto se afiliará a la Corporación a una entidad que 
                preste esos beneficios.
              </p>
            </div>
            <div className="fortalecimiento-item">
              <FaSyncAlt className="fortalecimiento-icon" />
              <h3>Un Concejo Actualizado</h3>
              <p>
                Propondremos al Concejo una merecida actualización al reglamento interno. Una propuesta que buscará no reproducir las normas 
                nacionales sino desarrollarlas, especificando los procedimientos y trámites para los múltiples casos presentados en el diario 
                funcionar de la Corporación. Se actualizará a las últimas disposiciones normativas y los pronunciamientos de las altas Cortes.
              </p>
            </div>
            <div className="fortalecimiento-item">
              <FaArchive className="fortalecimiento-icon" />
              <h3>El Concejo Si Archiva</h3>
              <p>
                Otra de las obligaciones que tienen las entidades públicas es la implementación de la Ley General de Archivo, con el fin de aplicar 
                las tablas de retención y valoración documental, gestionar la protección de documentos y en general el manejo del archivo documental, 
                digital y físico, del Concejo Municipal.
              </p>
              <div className="beneficios-list">
                <h4>Beneficios de la Ley de Archivo:</h4>
                <ul>
                  {beneficiosArchivo.map((beneficio, index) => (
                    <li key={index}>{beneficio}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Herramientas Esperadas */}
      <AnimatedSection className="section herramientas-section" animationType="fadeInUp">
        <div className="container">
          <h2 className="section-title">Herramientas Esperadas para 2025</h2>
          <p className="section-subtitle">
            Se espera que para el año 2025 el Concejo Municipal tenga implementados todos los procesos administrativos que por ley le corresponden 
            y en particular esperamos contar con las siguientes herramientas:
          </p>
          <div className="herramientas-grid">
            {herramientasEsperadas.map((herramienta, index) => (
              <div key={index} className="herramienta-card">
                <FaCheckCircle className="herramienta-icon" />
                <span>{herramienta}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Plazo y Seguimiento */}
      <AnimatedSection className="section plazo-seguimiento-section" animationType="fadeInUp">
        <div className="container">
          <div className="plazo-seguimiento-grid">
            <div className="plazo-seguimiento-card">
              <FaCalendarAlt className="plazo-seguimiento-icon" />
              <h3>Plazo</h3>
              <p>
                El presente Plan de Acción se ejecutará en el plazo de un año, contado a partir del primero de enero de la presente vigencia. 
                Cada tres meses se hará seguimiento al cumplimiento de los objetivos y metas del plan.
              </p>
            </div>
            <div className="plazo-seguimiento-card">
              <FaChartLine className="plazo-seguimiento-icon" />
              <h3>Seguimiento</h3>
              <p>
                Una Comisión Accidental integrada por el primer vicepresidente y los presidentes de cada comisión permanente del Concejo, 
                realizarán un seguimiento trimestral a la ejecución del plan de acción y presentarán a la presidenta del Concejo las observaciones 
                que correspondan.
              </p>
            </div>
            <div className="plazo-seguimiento-card">
              <FaUsers className="plazo-seguimiento-icon" />
              <h3>Responsables</h3>
              <p>
                Son responsables de dar cumplimiento al presente Plan de Acción los miembros de la Mesa Directiva, la Secretaria General y todos 
                los demás Concejales/as.
              </p>
            </div>
            <div className="plazo-seguimiento-card">
              <FaFileAlt className="plazo-seguimiento-icon" />
              <h3>Presupuesto</h3>
              <p>
                Para ejecutar el presente Plan de Acción se dispone del personal administrativo del Concejo y los recursos apropiados en el 
                Presupuesto de Funcionamiento de la Corporación aprobado para la vigencia 2025 y las gestiones que desde la Presidencia se adelanten 
                con otras entidades.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default PlanAccion;

