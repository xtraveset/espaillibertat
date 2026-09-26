
class Component extends DCLogic {
  state = { openFaq: 0, roomType: 'individual', calcHours: 8, lightboxIndex: null, activeTestimonialIndex: null, expandedStep: 0, lang: 'ca', isMobile: false, isMobileOnly: false, mobileMenuOpen: false };
  galleryRef = React.createRef();

  componentDidMount() {
    this.syncHead();
    this.mq = window.matchMedia('(max-width: 1024px)');
    this.mqMobile = window.matchMedia('(max-width: 640px)');
    this.updateMq = () => this.setState(s => ({ isMobile: this.mq.matches, isMobileOnly: this.mqMobile.matches, mobileMenuOpen: this.mq.matches ? s.mobileMenuOpen : false }));
    this.updateMq();
    this.mq.addEventListener('change', this.updateMq);
    this.mqMobile.addEventListener('change', this.updateMq);
  }
  componentWillUnmount() {
    if (this.mq) this.mq.removeEventListener('change', this.updateMq);
    if (this.mqMobile) this.mqMobile.removeEventListener('change', this.updateMq);
  }
  componentDidUpdate(_, prev) { if (prev.lang !== this.state.lang) this.syncHead(); }

  syncHead() {
    const lang = this.state.lang, t = this.T[lang];
    document.title = t.metaTitle;
    document.documentElement.lang = lang;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t.metaDesc);
    const schema = [
      {
        '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Espai Llibertat',
        description: t.metaDesc, url: 'https://www.espaillibertat.es/', telephone: '+34660913103', email: this.mailTo,
        priceRange: '10€ - 280€',
        address: { '@type': 'PostalAddress', streetAddress: 'Carrer de la Llibertat 63, planta baixa', addressLocality: 'Vilanova i la Geltrú', postalCode: '08800', addressRegion: 'Barcelona', addressCountry: 'ES' },
        areaServed: ['Vilanova i la Geltrú', 'Sitges', 'Cubelles', 'Sant Pere de Ribes', 'Garraf'],
      },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: this.faqsData[lang].map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ];
    let el = document.getElementById('el-schema');
    if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'el-schema'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schema);
  }

  toggleMobileMenu = () => this.setState(s => ({ mobileMenuOpen: !s.mobileMenuOpen }));
  closeMobileMenu = () => this.setState({ mobileMenuOpen: false });
  scrollGalleryLeft = () => { if (this.galleryRef.current) this.galleryRef.current.scrollBy({ left: -320, behavior: 'smooth' }); };
  scrollGalleryRight = () => { if (this.galleryRef.current) this.galleryRef.current.scrollBy({ left: 320, behavior: 'smooth' }); };
  closeLightbox = () => this.setState({ lightboxIndex: null });
  stopPropagation = (e) => e.stopPropagation();
  setRoomType = (v) => this.setState(s => ({ roomType: v, calcHours: Math.min(s.calcHours, v === 'grupal' ? 16 : 40) }));
  setCalcHours = (e) => this.setState({ calcHours: Number(e.target.value) });

  mailTo = 'libertad.cg@hotmail.com';
  waNumber = '34660913103';
  buildMailto(subject) { return `mailto:${this.mailTo}?subject=${encodeURIComponent(subject)}`; }
  buildWa(message) { return `https://wa.me/${this.waNumber}?text=${encodeURIComponent(message)}`; }
  resolveAsset(rawPath) {
    const id = rawPath.replace(/^uploads\//, '').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]+/g, '_');
    if (typeof window !== 'undefined' && window.__resources && window.__resources[id]) return window.__resources[id];
    return encodeURI(rawPath);
  }
  slotImage(id) { return this.resolveAsset(`uploads/slot-${id}.webp`); }
  avatarSrcFor(tm) { return tm.avatarSrcOverride ? this.resolveAsset(tm.avatarSrcOverride) : this.slotImage(tm.avatarId); }

  T = {
    ca: {
      metaTitle: 'Lloguer de sales de consulta per hores a Vilanova i la Geltrú | Espai Llibertat',
      metaDesc: "Coworking de salut a Vilanova i la Geltrú: lloga una sala de consulta individual (des de 15€/h) o una sala grupal per a ioga i pilates. Bons d'hores des de 10€/h, sense permanència. Primera hora de visita gratuïta.",
      navProfessionals: 'Per a qui és', navSales: 'Les sales', navTarifes: 'Tarifes', navComFunciona: 'Com reservar', navFaq: 'Preguntes', navUbicacio: 'Ubicació', navReserva: 'Reserva la teva hora',
      heroTag: 'Coworking de salut · Vilanova i la Geltrú',
      heroTitle: 'Lloga una sala de consulta per hores, sense lloguer fix',
      heroDesc: "Espai Llibertat és un coworking de salut amb dues sales equipades, una individual i una grupal, per a fisioterapeutes, nutricionistes, terapeutes i entrenadors. Reserves només les hores que necessites: l'equipament, la neteja i els consumibles ja hi són.",
      heroFromLabel: 'Des de', heroPerHour: '/hora', heroPerk1: 'Sense mínims ni permanència', heroPerk2: 'Primera hora de visita gratuïta', heroSeeRates: 'Veure tarifes',
      heroPhotoAlt: 'Sala grupal d\'Espai Llibertat amb estoretes de ioga, a Vilanova i la Geltrú',
      quickTitle: 'Espai Llibertat en 30 segons',
      segmentsTitle: 'Pensat per al teu tipus de consulta',
      segmentsSubtitle: "Cada professional necessita coses diferents. Troba el teu perfil i descobreix quina sala encaixa amb la teva feina.",
      noProfileTitle: 'No trobes el teu perfil?', noProfileDesc: "Tens dubtes sobre com encaixa la teva especialitat a l'espai? Escriu-nos i t'ajudem.",
      sendWhatsapp: "Envia'ns un WhatsApp", askAboutRooms: 'Pregunta per les sales',
      roomsTitle: 'Dues sales, cada una pensada per a un ús',
      roomsSubtitle: 'Tria segons el tipus de sessió: consulta privada 1 a 1 o classe en grup reduït. Totes dues amb climatització independent i tot el material inclòs.',
      roomEquip: 'Equipament inclòs', roomUses: 'Usos ideals', roomAsk: 'Consulta la sala', roomSeeRates: 'Veure tarifes',
      ratesTitle: 'Tarifes clares, sense sorpreses',
      ratesSubtitle: 'Tot inclòs en el preu: equipament, neteja, consumibles i climatització. Sense permanència ni costos ocults.',
      mostPopular: 'MÉS POPULAR',
      calcTitle: 'Quin pla et surt més a compte?', calcQuestion: 'Quantes hores al mes preveus fer servir la sala?', calcHoursUnit: 'hores / mes',
      calcRecommended: 'Et recomanem', calcMonthly: 'Cost aproximat al mes', calcPerHour: 'Preu per hora',
      calcSavingPre: 'Estalvies ', calcSavingPost: ' al mes respecte al pagament per ús.',
      calcNote: "Càlcul orientatiu. Els bons tenen una caducitat de 3-4 mesos.", calcCta: 'Vull aquest pla', calcConsult: 'A consultar',
      calcCustom: 'Per a més de 8 h al mes et preparem una franja completa a mida.',
      fixedSlotTitle: 'Necessites una franja fixa setmanal o ús intensiu?', fixedSlotDesc: "Oferim condicions a mida per a professionals amb horari estable. Inclou el teu perfil al directori de l'espai.", requestInfo: "Sol·licitar informació",
      stepsTitle: 'Com reservar una sala', stepsSubtitle: 'Disponibilitat en temps real, sincronitzada amb el teu calendari personal.',
      calendarAlt: 'Calendari de reserves de sales d\'Espai Llibertat',
      testiTitle: 'Professionals que han consolidat la seva carrera aquí',
      testiSubtitle: 'Gent que va confiar en Espai Llibertat per començar i avui té la seva consulta consolidada.',
      seeMore: 'Veure més', close: 'Tancar',
      servicesTitle: 'Tot inclòs, sense sorpreses', servicesSubtitle: "El que normalment paguen a part les consultes pròpies, aquí ja està cobert.", askAboutServices: 'Consulta què inclouen les sales',
      galleryTitle: "L'espai", gallerySubtitle: 'Dissenyat per al benestar i la professionalitat.', prev: 'Anterior', next: 'Següent',
      faqTitle: 'Preguntes freqüents', faqSubtitle: 'Preus, reserves i funcionament, explicats clar.', faqMore: 'Tens una altra pregunta?',
      locationTitle: 'A minuts de casa teva',
      locationDesc: "Estalvia temps i estrès. Deixa de dependre dels túnels del Garraf o dels embussos de la C-32. Si vius a Vilanova, Sitges, Cubelles o Sant Pere de Ribes, Espai Llibertat és el teu nou local de salut.",
      addressLabel: 'Adreça', nearTrain: "Molt a prop de l'estació de Renfe", mapTitle: 'mapa',
      finalCtaTitle: "Vols visitar l'espai abans de decidir?", finalCtaDesc: "La primera hora és totalment gratuïta i sense compromís. T'ensenyem les sales i resolem els teus dubtes.",
      contactWhatsapp: 'Contactar per WhatsApp', sendEmail: 'Enviar un email',
      footerTagline: "Coworking de salut a Vilanova i la Geltrú. Sales de consulta i sala grupal per hores per a professionals de la salut i el benestar del Garraf.",
      footerRooms: 'Sales i tarifes', footerPros: 'Per a professionals', footerArea: 'Zona', footerContact: 'Contacte',
      footerSeo: "Espai Llibertat és un coworking sanitari a Vilanova i la Geltrú (Garraf, Barcelona) on fisioterapeutes, osteòpates, nutricionistes, psicòlegs, terapeutes, professionals de l'estètica i entrenadors poden llogar una sala de consulta per hores, amb bons d'hores o amb subscripció mensual. Disposem d'una sala individual amb llitera per a teràpies 1 a 1 i d'una sala grupal per a classes de ioga, pilates i entrenament en grup reduït, totes dues equipades i climatitzades, a prop de l'estació de Renfe. Donem servei a professionals de Vilanova i la Geltrú, Sitges, Cubelles, Sant Pere de Ribes, Canyelles i tot el Garraf que busquen una consulta sense lloguer fix.",
      footerCopy: 'Coworking de salut a Vilanova i la Geltrú',
      legalNotice: 'Avís legal', privacyPolicy: 'Política de privadesa', cookiesPolicy: 'Política de cookies',
    },
    es: {
      metaTitle: 'Alquiler de salas de consulta por horas en Vilanova i la Geltrú | Espai Llibertat',
      metaDesc: 'Coworking de salud en Vilanova i la Geltrú: alquila una sala de consulta individual (desde 15€/h) o una sala grupal para yoga y pilates. Bonos de horas desde 10€/h, sin permanencia. Primera hora de visita gratuita.',
      navProfessionals: 'Para quién es', navSales: 'Las salas', navTarifes: 'Tarifas', navComFunciona: 'Cómo reservar', navFaq: 'Preguntas', navUbicacio: 'Ubicación', navReserva: 'Reserva tu hora',
      heroTag: 'Coworking de salud · Vilanova i la Geltrú',
      heroTitle: 'Alquila una sala de consulta por horas, sin alquiler fijo',
      heroDesc: 'Espai Llibertat es un coworking de salud con dos salas equipadas, una individual y una grupal, para fisioterapeutas, nutricionistas, terapeutas y entrenadores. Reservas solo las horas que necesitas: el equipamiento, la limpieza y los consumibles ya están.',
      heroFromLabel: 'Desde', heroPerHour: '/hora', heroPerk1: 'Sin mínimos ni permanencia', heroPerk2: 'Primera hora de visita gratuita', heroSeeRates: 'Ver tarifas',
      heroPhotoAlt: 'Sala grupal de Espai Llibertat con esterillas de yoga, en Vilanova i la Geltrú',
      quickTitle: 'Espai Llibertat en 30 segundos',
      segmentsTitle: 'Pensado para tu tipo de consulta',
      segmentsSubtitle: 'Cada profesional necesita cosas diferentes. Encuentra tu perfil y descubre qué sala encaja con tu trabajo.',
      noProfileTitle: '¿No encuentras tu perfil?', noProfileDesc: '¿Tienes dudas sobre cómo encaja tu especialidad en el espacio? Escríbenos y te ayudamos.',
      sendWhatsapp: 'Envíanos un WhatsApp', askAboutRooms: 'Pregunta por las salas',
      roomsTitle: 'Dos salas, cada una pensada para un uso',
      roomsSubtitle: 'Elige según el tipo de sesión: consulta privada 1 a 1 o clase en grupo reducido. Ambas con climatización independiente y todo el material incluido.',
      roomEquip: 'Equipamiento incluido', roomUses: 'Usos ideales', roomAsk: 'Consulta la sala', roomSeeRates: 'Ver tarifas',
      ratesTitle: 'Tarifas claras, sin sorpresas',
      ratesSubtitle: 'Todo incluido en el precio: equipamiento, limpieza, consumibles y climatización. Sin permanencia ni costes ocultos.',
      mostPopular: 'MÁS POPULAR',
      calcTitle: '¿Qué plan te sale más a cuenta?', calcQuestion: '¿Cuántas horas al mes prevés usar la sala?', calcHoursUnit: 'horas / mes',
      calcRecommended: 'Te recomendamos', calcMonthly: 'Coste aproximado al mes', calcPerHour: 'Precio por hora',
      calcSavingPre: 'Ahorras ', calcSavingPost: ' al mes respecto al pago por uso.',
      calcNote: 'Cálculo orientativo. Los bonos tienen una caducidad de 3-4 meses.', calcCta: 'Quiero este plan', calcConsult: 'A consultar',
      calcCustom: 'Para más de 8 h al mes te preparamos una franja completa a medida.',
      fixedSlotTitle: '¿Necesitas una franja fija semanal o uso intensivo?', fixedSlotDesc: 'Ofrecemos condiciones a medida para profesionales con horario estable. Incluye tu perfil en el directorio del espacio.', requestInfo: 'Solicitar información',
      stepsTitle: 'Cómo reservar una sala', stepsSubtitle: 'Disponibilidad en tiempo real, sincronizada con tu calendario personal.',
      calendarAlt: 'Calendario de reservas de salas de Espai Llibertat',
      testiTitle: 'Profesionales que han consolidado su carrera aquí',
      testiSubtitle: 'Gente que confió en Espai Llibertat para empezar y hoy tiene su consulta consolidada.',
      seeMore: 'Ver más', close: 'Cerrar',
      servicesTitle: 'Todo incluido, sin sorpresas', servicesSubtitle: 'Lo que normalmente pagan aparte las consultas propias, aquí ya está cubierto.', askAboutServices: 'Consulta qué incluyen las salas',
      galleryTitle: 'El espacio', gallerySubtitle: 'Diseñado para el bienestar y la profesionalidad.', prev: 'Anterior', next: 'Siguiente',
      faqTitle: 'Preguntas frecuentes', faqSubtitle: 'Precios, reservas y funcionamiento, explicados claro.', faqMore: '¿Tienes otra pregunta?',
      locationTitle: 'A minutos de tu casa',
      locationDesc: 'Ahorra tiempo y estrés. Deja de depender de los túneles del Garraf o los atascos de la C-32. Si vives en Vilanova, Sitges, Cubelles o Sant Pere de Ribes, Espai Llibertat es tu nuevo local de salud.',
      addressLabel: 'Dirección', nearTrain: 'Muy cerca de la estación de Renfe', mapTitle: 'mapa',
      finalCtaTitle: '¿Quieres visitar el espacio antes de decidir?', finalCtaDesc: 'La primera hora es totalmente gratuita y sin compromiso. Te enseñamos las salas y resolvemos tus dudas.',
      contactWhatsapp: 'Contactar por WhatsApp', sendEmail: 'Enviar un email',
      footerTagline: 'Coworking de salud en Vilanova i la Geltrú. Salas de consulta y sala grupal por horas para profesionales de la salud y el bienestar del Garraf.',
      footerRooms: 'Salas y tarifas', footerPros: 'Para profesionales', footerArea: 'Zona', footerContact: 'Contacto',
      footerSeo: 'Espai Llibertat es un coworking sanitario en Vilanova i la Geltrú (Garraf, Barcelona) donde fisioterapeutas, osteópatas, nutricionistas, psicólogos, terapeutas, profesionales de la estética y entrenadores pueden alquilar una sala de consulta por horas, con bonos de horas o con suscripción mensual. Disponemos de una sala individual con camilla para terapias 1 a 1 y de una sala grupal para clases de yoga, pilates y entrenamiento en grupo reducido, ambas equipadas y climatizadas, cerca de la estación de Renfe. Damos servicio a profesionales de Vilanova i la Geltrú, Sitges, Cubelles, Sant Pere de Ribes, Canyelles y todo el Garraf que buscan una consulta sin alquiler fijo.',
      footerCopy: 'Coworking de salud en Vilanova i la Geltrú',
      legalNotice: 'Aviso legal', privacyPolicy: 'Política de privacidad', cookiesPolicy: 'Política de cookies',
    },
  };

  quickData = {
    ca: [
      { icon: 'building-2', label: 'Què és', text: 'Un coworking de salut amb 2 sales equipades al centre de Vilanova i la Geltrú.', link: 'Veure les sales', href: '#sales' },
      { icon: 'users', label: 'Per a qui', text: "Fisioterapeutes, nutricionistes, estètica, terapeutes i entrenadors.", link: 'Troba el teu perfil', href: '#professionals' },
      { icon: 'euro', label: 'Quant costa', text: 'Des de 15€/h. Amb bons, des de 10€/h. Sense permanència.', link: 'Veure tarifes', href: '#tarifes' },
      { icon: 'calendar-check', label: 'Com es reserva', text: 'Calendari en temps real i confirmació immediata. Cancel·la fins 15 min abans.', link: 'Com funciona', href: '#com-funciona' },
    ],
    es: [
      { icon: 'building-2', label: 'Qué es', text: 'Un coworking de salud con 2 salas equipadas en el centro de Vilanova i la Geltrú.', link: 'Ver las salas', href: '#sales' },
      { icon: 'users', label: 'Para quién', text: 'Fisioterapeutas, nutricionistas, estética, terapeutas y entrenadores.', link: 'Encuentra tu perfil', href: '#professionals' },
      { icon: 'euro', label: 'Cuánto cuesta', text: 'Desde 15€/h. Con bonos, desde 10€/h. Sin permanencia.', link: 'Ver tarifas', href: '#tarifes' },
      { icon: 'calendar-check', label: 'Cómo se reserva', text: 'Calendario en tiempo real y confirmación inmediata. Cancela hasta 15 min antes.', link: 'Cómo funciona', href: '#com-funciona' },
    ],
  };

  roomsData = {
    ca: [
      { key: 'individual', img: 'uploads/slot-gallery-1.webp', icon: 'user', tag: '1 professional + pacient', title: 'Sala Individual', desc: 'Consulta privada i silenciosa per a sessions 1 a 1, llesta per treballar des del primer minut.', equip: ['Llitera de tractament', 'Taula i cadires de consulta', 'Bàscula', 'Material de teràpia manual', 'Paper de llitera i tovalloles', 'Climatització independent', 'WiFi gratuït'], uses: ['Fisioteràpia', 'Osteopatia', 'Nutrició i dietètica', 'Psicologia', 'Massatge terapèutic', 'Estètica i benestar'], price: '15€', priceNote: '/hora · bons des de 10€/h', mailSubject: 'Vull informació sobre la Sala Individual' },
      { key: 'grupal', img: 'uploads/slot-hero-photo.webp', icon: 'users', tag: 'Grups de 4 a 6 persones', title: 'Sala Grupal', desc: 'Sala diàfana per a classes i tallers en grup reduït, amb tot el material a punt.', equip: ['Estoretes', 'Bandes elàstiques', 'Material per a classes', 'Espai diàfan', 'Climatització independent', 'WiFi gratuït'], uses: ['Ioga', 'Pilates', 'Entrenament en grup reduït', 'Readaptació', 'Meditació', 'Tallers i formacions'], price: '25€', priceNote: '/hora · pack mensual a 15€/h', mailSubject: 'Vull informació sobre la Sala Grupal' },
    ],
    es: [
      { key: 'individual', img: 'uploads/slot-gallery-1.webp', icon: 'user', tag: '1 profesional + paciente', title: 'Sala Individual', desc: 'Consulta privada y silenciosa para sesiones 1 a 1, lista para trabajar desde el primer minuto.', equip: ['Camilla de tratamiento', 'Mesa y sillas de consulta', 'Báscula', 'Material de terapia manual', 'Papel de camilla y toallas', 'Climatización independiente', 'WiFi gratuito'], uses: ['Fisioterapia', 'Osteopatía', 'Nutrición y dietética', 'Psicología', 'Masaje terapéutico', 'Estética y bienestar'], price: '15€', priceNote: '/hora · bonos desde 10€/h', mailSubject: 'Quiero información sobre la Sala Individual' },
      { key: 'grupal', img: 'uploads/slot-hero-photo.webp', icon: 'users', tag: 'Grupos de 4 a 6 personas', title: 'Sala Grupal', desc: 'Sala diáfana para clases y talleres en grupo reducido, con todo el material a punto.', equip: ['Esterillas', 'Bandas elásticas', 'Material para clases', 'Espacio diáfano', 'Climatización independiente', 'WiFi gratuito'], uses: ['Yoga', 'Pilates', 'Entrenamiento en grupo reducido', 'Readaptación', 'Meditación', 'Talleres y formaciones'], price: '25€', priceNote: '/hora · pack mensual a 15€/h', mailSubject: 'Quiero información sobre la Sala Grupal' },
    ],
  };

  roomTabsData = {
    ca: [{ value: 'individual', label: 'Sala Individual' }, { value: 'grupal', label: 'Sala Grupal' }],
    es: [{ value: 'individual', label: 'Sala Individual' }, { value: 'grupal', label: 'Sala Grupal' }],
  };
  roomSummaryData = {
    ca: { individual: 'Consulta privada 1 a 1 · llitera, taula de consulta i material inclòs', grupal: 'Classes de 4 a 6 persones · estoretes i material inclòs' },
    es: { individual: 'Consulta privada 1 a 1 · camilla, mesa de consulta y material incluido', grupal: 'Clases de 4 a 6 personas · esterillas y material incluido' },
  };

  pricingByRoom = {
    ca: {
      individual: [
        { stage: 'Prova', title: 'Pagament per ús', prices: [{ price: '15€', unit: '/hora' }], note: '', badge: '', features: ['Sense permanència ni mínims', 'Cancel·lació gratuïta fins 15 min abans', 'Equipament i consumibles inclosos'], cta: 'Comença ara', variant: 'secondary', popular: false, mailSubject: "M'agradaria començar amb el pagament per ús (sala individual)" },
        { stage: 'Recurrent', title: "Bons d'hores", prices: [{ price: '120€', unit: 'Bo de 10 h' }, { price: '250€', unit: 'Bo de 25 h' }], note: '12€/h amb el bo de 10 h · 10€/h amb el de 25 h', badge: 'Fins a -33%', features: ['Caducitat de 3-4 mesos', 'Prioritat de reserva', 'Fes-les servir quan vulguis'], cta: 'Sol·licitar bo', variant: 'primary', popular: true, mailSubject: "Sol·licitud d'informació sobre els bons d'hores", info: 'Més informació sobre els bons', infoMsg: "Hola! M'agradaria més informació sobre els bons d'hores de la sala individual." },
        { stage: 'Estable', title: 'Subscripció mensual', prices: [{ price: '280€', unit: '/mes' }], note: 'Surt a compte a partir de 28 h al mes', badge: '', features: ['Franja fixa assegurada de matí o tarda', 'Presència al directori de professionals', 'Espai per guardar el teu material'], cta: 'Parlem-ne', variant: 'secondary', popular: false, mailSubject: "M'agradaria parlar sobre la subscripció mensual" },
      ],
      grupal: [
        { stage: 'Prova', title: 'Pagament per ús', prices: [{ price: '25€', unit: '/hora' }], note: '', badge: '', features: ['Per a grups de 4 a 6 persones', 'Estoretes i material inclosos', 'Sense permanència'], cta: 'Comença ara', variant: 'secondary', popular: false, mailSubject: "M'agradaria començar amb el pagament per ús (sala grupal)" },
        { stage: 'Recurrent', title: 'Pack mensual', prices: [{ price: '120€', unit: '/mes' }], note: '8 h al mes (2 h setmanals fixes) · 15€/h', badge: '-40%', features: ['Horari fix per a les teves classes setmanals', 'Franja assegurada cada setmana', 'Material inclòs'], cta: 'Sol·licitar pack', variant: 'primary', popular: true, mailSubject: "Sol·licitud d'informació sobre el pack mensual de la sala grupal", info: 'Més informació sobre el pack', infoMsg: "Hola! M'agradaria més informació sobre el pack mensual de la sala grupal." },
        { stage: 'Intensiu', title: 'Franja completa', prices: [{ price: 'A consultar', unit: '' }], note: '', badge: '', features: ["Per a ús intensiu o bloquejos d'alt volum", 'Condicions a mida', 'Ideal per a escoles i formacions'], cta: "Sol·licitar informació", variant: 'secondary', popular: false, mailSubject: "Sol·licitud d'informació sobre la franja completa" },
      ],
    },
    es: {
      individual: [
        { stage: 'Prueba', title: 'Pago por uso', prices: [{ price: '15€', unit: '/hora' }], note: '', badge: '', features: ['Sin permanencia ni mínimos', 'Cancelación gratuita hasta 15 min antes', 'Equipamiento y consumibles incluidos'], cta: 'Empieza ahora', variant: 'secondary', popular: false, mailSubject: 'Me gustaría empezar con el pago por uso (sala individual)' },
        { stage: 'Recurrente', title: 'Bonos de horas', prices: [{ price: '120€', unit: 'Bono de 10 h' }, { price: '250€', unit: 'Bono de 25 h' }], note: '12€/h con el bono de 10 h · 10€/h con el de 25 h', badge: 'Hasta -33%', features: ['Caducidad de 3-4 meses', 'Prioridad de reserva', 'Úsalas cuando quieras'], cta: 'Solicitar bono', variant: 'primary', popular: true, mailSubject: 'Solicitud de información sobre los bonos de horas', info: 'Más información sobre los bonos', infoMsg: '¡Hola! Me gustaría más información sobre los bonos de horas de la sala individual.' },
        { stage: 'Estable', title: 'Suscripción mensual', prices: [{ price: '280€', unit: '/mes' }], note: 'Sale a cuenta a partir de 28 h al mes', badge: '', features: ['Franja fija asegurada de mañana o tarde', 'Presencia en el directorio de profesionales', 'Espacio para guardar tu material'], cta: 'Hablemos', variant: 'secondary', popular: false, mailSubject: 'Me gustaría hablar sobre la suscripción mensual' },
      ],
      grupal: [
        { stage: 'Prueba', title: 'Pago por uso', prices: [{ price: '25€', unit: '/hora' }], note: '', badge: '', features: ['Para grupos de 4 a 6 personas', 'Esterillas y material incluidos', 'Sin permanencia'], cta: 'Empieza ahora', variant: 'secondary', popular: false, mailSubject: 'Me gustaría empezar con el pago por uso (sala grupal)' },
        { stage: 'Recurrente', title: 'Pack mensual', prices: [{ price: '120€', unit: '/mes' }], note: '8 h al mes (2 h semanales fijas) · 15€/h', badge: '-40%', features: ['Horario fijo para tus clases semanales', 'Franja asegurada cada semana', 'Material incluido'], cta: 'Solicitar pack', variant: 'primary', popular: true, mailSubject: 'Solicitud de información sobre el pack mensual de la sala grupal', info: 'Más información sobre el pack', infoMsg: '¡Hola! Me gustaría más información sobre el pack mensual de la sala grupal.' },
        { stage: 'Intensivo', title: 'Franja completa', prices: [{ price: 'A consultar', unit: '' }], note: '', badge: '', features: ['Para uso intensivo o bloqueos de alto volumen', 'Condiciones a medida', 'Ideal para escuelas y formaciones'], cta: 'Solicitar información', variant: 'secondary', popular: false, mailSubject: 'Solicitud de información sobre la franja completa' },
      ],
    },
  };

  planNames = {
    ca: { payg: 'Pagament per ús', bo10: 'Bo de 10 h', bo25: 'Bo de 25 h', sub: 'Subscripció mensual', pack: 'Pack mensual', full: 'Franja completa' },
    es: { payg: 'Pago por uso', bo10: 'Bono de 10 h', bo25: 'Bono de 25 h', sub: 'Suscripción mensual', pack: 'Pack mensual', full: 'Franja completa' },
  };

  computeCalc(lang, t) {
    const h = this.state.calcHours, room = this.state.roomType, n = this.planNames[lang];
    let best;
    if (room === 'individual') {
      const opts = [
        { id: 'payg', cost: 15 * h, ok: true },
        { id: 'bo10', cost: 12 * h, ok: h >= 4 },
        { id: 'bo25', cost: 10 * h, ok: h >= 8 },
        { id: 'sub', cost: 280, ok: h >= 20 },
      ].filter(o => o.ok);
      best = opts.reduce((a, b) => (b.cost < a.cost ? b : a));
    } else {
      best = h <= 4 ? { id: 'payg', cost: 25 * h } : h <= 8 ? { id: 'pack', cost: 120 } : { id: 'full', cost: null };
    }
    const base = (room === 'individual' ? 15 : 25) * h;
    const saving = best.cost != null ? base - best.cost : 0;
    const fmt = (v) => (Math.round(v * 10) / 10).toString().replace('.', ',') + '€';
    const subj = (lang === 'ca' ? `Interès en el pla ${n[best.id]} (${room === 'individual' ? 'sala individual' : 'sala grupal'}, ~${h} h/mes)` : `Interés en el plan ${n[best.id]} (${room === 'individual' ? 'sala individual' : 'sala grupal'}, ~${h} h/mes)`);
    return {
      planName: n[best.id],
      monthly: best.cost != null ? fmt(best.cost) : t.calcConsult,
      perHour: best.cost != null ? fmt(best.cost / h) + '/h' : '—',
      hasSaving: saving > 0,
      savingText: `${t.calcSavingPre}${fmt(saving)}${t.calcSavingPost}`,
      custom: best.cost == null,
      mailHref: this.buildMailto(subj),
    };
  }

  segmentsData = {
    ca: [
      { image: 'uploads/segment-entrenadors.png', title: 'Fisioterapeutes i osteòpates', desc: 'Sala amb llitera, espai per a mobilitat i material de teràpia manual disponible.', room: 'Sala individual' },
      { image: 'uploads/segment-fisio.png', title: 'Nutricionistes i psicòlegs', desc: 'Taula de consulta i bàscula disponible, ideal per a sessions curtes i seguiments.', room: 'Sala individual' },
      { image: 'uploads/segment-nutricio.png', title: 'Bellesa i cura personal', desc: 'Espai net i íntim, ideal per a tractaments estètics, massatges i benestar.', room: 'Sala individual' },
      { image: 'uploads/segment-beauty.png', title: 'Ioga, pilates i entrenadors', desc: 'Sala grupal amb estoretes, bandes elàstiques i espai per a fins a 6 persones.', room: 'Sala grupal' },
    ],
    es: [
      { image: 'uploads/segment-entrenadors.png', title: 'Fisioterapeutas y osteópatas', desc: 'Sala con camilla, espacio para movilidad y material de terapia manual disponible.', room: 'Sala individual' },
      { image: 'uploads/segment-fisio.png', title: 'Nutricionistas y psicólogos', desc: 'Mesa de consulta y báscula disponible, ideal para sesiones cortas y seguimientos.', room: 'Sala individual' },
      { image: 'uploads/segment-nutricio.png', title: 'Belleza y cuidado personal', desc: 'Espacio limpio e íntimo, ideal para tratamientos estéticos, masajes y bienestar.', room: 'Sala individual' },
      { image: 'uploads/segment-beauty.png', title: 'Yoga, pilates y entrenadores', desc: 'Sala grupal con esterillas, bandas elásticas y espacio para hasta 6 personas.', room: 'Sala grupal' },
    ],
  };

  stepsData = {
    ca: [
      { n: '01', title: 'Consulta la disponibilitat', desc: 'Calendari comú en temps real, des de qualsevol dispositiu. Tria la sala i la franja que et va bé.' },
      { n: '02', title: 'Reserva en 3 clics', desc: 'Paga per hora, amb bo o amb subscripció. Confirmació immediata i 15 min de pre-reserva gratuïta mentre confirmes amb el pacient.' },
      { n: '03', title: 'Arriba i treballa', desc: 'Sala neta, equipada i climatitzada. Cancel·la sense cost fins 15 min abans.' },
    ],
    es: [
      { n: '01', title: 'Consulta la disponibilidad', desc: 'Calendario común en tiempo real, desde cualquier dispositivo. Elige la sala y la franja que te va bien.' },
      { n: '02', title: 'Reserva en 3 clics', desc: 'Paga por hora, con bono o con suscripción. Confirmación inmediata y 15 min de pre-reserva gratuita mientras confirmas con el paciente.' },
      { n: '03', title: 'Llega y trabaja', desc: 'Sala limpia, equipada y climatizada. Cancela sin coste hasta 15 min antes.' },
    ],
  };

  servicesData = {
    ca: [
      { image: 'uploads/service-residus.png', title: 'Gestió de residus biosanitaris', desc: 'Tranquil·litat legal absoluta amb recollida professional inclosa.' },
      { image: 'uploads/service-consumibles.png', title: 'Consumibles llestos', desc: 'Paper de llitera, tovalloles netes i cremes de massatge disponibles.' },
      { image: 'uploads/service-sala-grupal.png', title: 'Sala grupal equipada', desc: 'Espai per a 4–6 alumnes amb estoretes i material inclòs.' },
      { image: 'uploads/service-climatitzacio.png', title: 'Climatització independent', desc: 'Control individual de fred i calor a cada sala.' },
      { image: 'uploads/service-entorn.png', title: 'Entorn col·laboratiu', desc: "Forma part d'una comunitat de salut activa que genera derivacions entre professionals." },
      { image: 'uploads/service-wifi.png', title: 'WiFi gratuït', desc: 'Connexió WiFi a totes les sales per gestionar agenda, cobraments o classes online.' },
    ],
    es: [
      { image: 'uploads/service-residus.png', title: 'Gestión de residuos biosanitarios', desc: 'Tranquilidad legal absoluta con recogida profesional incluida.' },
      { image: 'uploads/service-consumibles.png', title: 'Consumibles listos', desc: 'Papel de camilla, toallas limpias y cremas de masaje disponibles.' },
      { image: 'uploads/service-sala-grupal.png', title: 'Sala grupal equipada', desc: 'Espacio para 4–6 alumnos con esterillas y material incluido.' },
      { image: 'uploads/service-climatitzacio.png', title: 'Climatización independiente', desc: 'Control individual de frío y calor en cada sala.' },
      { image: 'uploads/service-entorn.png', title: 'Entorno colaborativo', desc: 'Forma parte de una comunidad de salud activa que genera derivaciones entre profesionales.' },
      { image: 'uploads/service-wifi.png', title: 'WiFi gratuito', desc: 'Conexión WiFi en todas las salas para gestionar agenda, cobros o clases online.' },
    ],
  };

  galleryPhotosData = {
    ca: [
      { id: 'gallery-1', placeholder: 'Sala individual' }, { id: 'gallery-2', placeholder: 'Sala grupal' }, { id: 'gallery-3', placeholder: 'Recepció' },
      { id: 'gallery-4', placeholder: 'Llitera de teràpia' }, { id: 'gallery-5', placeholder: "Zona d'espera" }, { id: 'gallery-6', placeholder: 'Material i consumibles' },
      { id: 'gallery-7', placeholder: 'Sala amb llum natural' }, { id: 'gallery-8', placeholder: "Entrada de l'espai" }, { id: 'gallery-9', placeholder: 'Detall de decoració' },
      { id: 'gallery-10', placeholder: 'Sala grupal en ús' }, { id: 'gallery-11', placeholder: 'Passadís' }, { id: 'gallery-12', placeholder: 'Vista exterior' },
    ],
    es: [
      { id: 'gallery-1', placeholder: 'Sala individual' }, { id: 'gallery-2', placeholder: 'Sala grupal' }, { id: 'gallery-3', placeholder: 'Recepción' },
      { id: 'gallery-4', placeholder: 'Camilla de terapia' }, { id: 'gallery-5', placeholder: 'Zona de espera' }, { id: 'gallery-6', placeholder: 'Material y consumibles' },
      { id: 'gallery-7', placeholder: 'Sala con luz natural' }, { id: 'gallery-8', placeholder: 'Entrada del espacio' }, { id: 'gallery-9', placeholder: 'Detalle de decoración' },
      { id: 'gallery-10', placeholder: 'Sala grupal en uso' }, { id: 'gallery-11', placeholder: 'Pasillo' }, { id: 'gallery-12', placeholder: 'Vista exterior' },
    ],
  };

  faqsData = {
    ca: [
      { q: 'Quant costa llogar una sala per hores?', a: "La sala individual costa 15€/hora i la grupal 25€/hora. Amb els bons d'hores la individual baixa fins a 10€/h, i amb el pack mensual la grupal queda a 15€/h. Tot inclòs: equipament, neteja, consumibles i climatització." },
      { q: 'Com reservo una sala?', a: "Escriu-nos per WhatsApp o email amb el dia i l'hora que vols. Et confirmem la disponibilitat i, a partir d'aquí, pots gestionar les teves reserves des del calendari compartit en temps real." },
      { q: "Com funcionen els bons d'hores?", a: "Compres un paquet de 10 h (120€) o de 25 h (250€) i el vas gastant quan vulguis durant 3-4 mesos. A més, tens prioritat de reserva." },
      { q: 'Quina diferència hi ha entre la sala individual i la grupal?', a: "La individual és una consulta privada amb llitera i taula per a sessions 1 a 1. La grupal és una sala diàfana per a classes de 4 a 6 persones, amb estoretes i material." },
      { q: "Puc visitar l'espai abans de decidir?", a: "Sí. La primera hora de visita és gratuïta i sense compromís. T'ensenyem les sales i resolem els teus dubtes." },
      { q: 'Puc cancel·lar sense cost?', a: 'Sí. Pots cancel·lar o modificar la teva reserva fins a 15 minuts abans sense cap penalització.' },
      { q: 'Hi ha permanència o compromís mínim?', a: 'No. El pagament per hores no té cap permanència. Els bons tenen una caducitat de 3-4 mesos per fer-los servir amb flexibilitat.' },
      { q: "Qui s'encarrega de la neteja i el material fungible?", a: 'Nosaltres. Paper de llitera, tovalloles i consumibles estan sempre disponibles, i la neteja és diària.' },
      { q: 'Puc portar el meu propi material?', a: 'Sí, pots guardar material propi si tens una subscripció estable; per a reserves puntuals, tot el necessari ja hi és.' },
      { q: "Com sincronitzo l'agenda amb els meus pacients?", a: "Vincula el calendari de sales amb Outlook, Google Calendar o Apple Calendar i gestiona les teves cites des d'un sol lloc." },
    ],
    es: [
      { q: '¿Cuánto cuesta alquilar una sala por horas?', a: 'La sala individual cuesta 15€/hora y la grupal 25€/hora. Con los bonos de horas la individual baja hasta 10€/h, y con el pack mensual la grupal queda a 15€/h. Todo incluido: equipamiento, limpieza, consumibles y climatización.' },
      { q: '¿Cómo reservo una sala?', a: 'Escríbenos por WhatsApp o email con el día y la hora que quieres. Te confirmamos la disponibilidad y, a partir de ahí, puedes gestionar tus reservas desde el calendario compartido en tiempo real.' },
      { q: '¿Cómo funcionan los bonos de horas?', a: 'Compras un paquete de 10 h (120€) o de 25 h (250€) y lo vas gastando cuando quieras durante 3-4 meses. Además, tienes prioridad de reserva.' },
      { q: '¿Qué diferencia hay entre la sala individual y la grupal?', a: 'La individual es una consulta privada con camilla y mesa para sesiones 1 a 1. La grupal es una sala diáfana para clases de 4 a 6 personas, con esterillas y material.' },
      { q: '¿Puedo visitar el espacio antes de decidir?', a: 'Sí. La primera hora de visita es gratuita y sin compromiso. Te enseñamos las salas y resolvemos tus dudas.' },
      { q: '¿Puedo cancelar sin coste?', a: 'Sí. Puedes cancelar o modificar tu reserva hasta 15 minutos antes sin ninguna penalización.' },
      { q: '¿Hay permanencia o compromiso mínimo?', a: 'No. El pago por horas no tiene ninguna permanencia. Los bonos tienen una caducidad de 3-4 meses para usarlos con flexibilidad.' },
      { q: '¿Quién se encarga de la limpieza y el material fungible?', a: 'Nosotros. Papel de camilla, toallas y consumibles están siempre disponibles, y la limpieza es diaria.' },
      { q: '¿Puedo traer mi propio material?', a: 'Sí, puedes guardar material propio si tienes una suscripción estable; para reservas puntuales, todo lo necesario ya está.' },
      { q: '¿Cómo sincronizo la agenda con mis pacientes?', a: 'Vincula el calendario de salas con Outlook, Google Calendar o Apple Calendar y gestiona tus citas desde un solo lugar.' },
    ],
  };

  footerData = {
    ca: {
      rooms: [{ label: 'Sala individual per hores', href: '#sales' }, { label: 'Sala grupal per a classes', href: '#sales' }, { label: "Tarifes i bons d'hores", href: '#tarifes' }, { label: 'Com reservar una sala', href: '#com-funciona' }, { label: 'Preguntes freqüents', href: '#faq' }],
      pros: [{ label: 'Consulta per a fisioterapeutes', href: '#professionals' }, { label: 'Sala per a osteòpates', href: '#professionals' }, { label: 'Despatx per a nutricionistes', href: '#professionals' }, { label: "Cabina d'estètica i massatge", href: '#professionals' }, { label: 'Sala de ioga i pilates', href: '#professionals' }],
      area: ['Vilanova i la Geltrú', 'Sitges', 'Cubelles', 'Sant Pere de Ribes', 'Garraf, Barcelona'],
    },
    es: {
      rooms: [{ label: 'Sala individual por horas', href: '#sales' }, { label: 'Sala grupal para clases', href: '#sales' }, { label: 'Tarifas y bonos de horas', href: '#tarifes' }, { label: 'Cómo reservar una sala', href: '#com-funciona' }, { label: 'Preguntas frecuentes', href: '#faq' }],
      pros: [{ label: 'Consulta para fisioterapeutas', href: '#professionals' }, { label: 'Sala para osteópatas', href: '#professionals' }, { label: 'Despacho para nutricionistas', href: '#professionals' }, { label: 'Cabina de estética y masaje', href: '#professionals' }, { label: 'Sala de yoga y pilates', href: '#professionals' }],
      area: ['Vilanova i la Geltrú', 'Sitges', 'Cubelles', 'Sant Pere de Ribes', 'Garraf, Barcelona'],
    },
  };

  testimonialsData = {
    ca: [
      { quote: "Espai Llibertat va ser una etapa important en el desenvolupament del meu projecte professional. Em va permetre disposar d'un espai acollidor on començar a donar forma a la meva manera de treballar, créixer com a fisioterapeuta i consolidar progressivament la meva pràctica. En guardo un record molt positiu, tant per l'entorn com pel tracte humà rebut. Crec que és una molt bona opció per a professionals que vulguin iniciar o fer créixer el seu projecte amb llibertat i confiança.", name: 'Àngels Monedero', role: 'Fisioterapeuta integrativa', avatarId: 'avatar-angels', linkedin: 'https://www.linkedin.com/in/angelsmonedero/' },
      { quote: "Durant més de tres anys, vaig col·laborar amb la Libi a l'Espai Llibertat, on vaig adquirir molta experiència i vaig desenvolupar la meva pràctica amb total flexibilitat i disponibilitat a l'espai.\n\nEn aquella etapa em van sorgir noves oportunitats laborals, com la d'incorporar-me com a fisioterapeuta esportiu al futbol formatiu del FC Barcelona.\n\nEstic molt agraït a la Libi per haver pogut treballar al seu espai, que va ser una gran oportunitat per créixer a nivell professional. Recomano a qualsevol professional col·laborar amb ella per la seva proximitat i professionalitat.", name: 'Martí Soler Torrella', role: 'Fisioterapeuta esportiu i musculoesquelètic', avatarId: 'avatar-marti', linkedin: 'https://www.linkedin.com/in/mart%C3%AD-soler-torrella-414982ba/' },
      { quote: "El ioga va arribar a la meva vida el 2015, en un moment de gran esgotament, i em va permetre redescobrir el meu centre i la meva pròpia essència. Després de formar-me en diversos estils, va ser amb l'Ashtanga Vinyasa que vaig sentir una connexió profunda: la seva disciplina i precisió em van oferir el marc perfecte per a la reconnexió física, mental i emocional. Fa més de deu anys que em dedico exclusivament a ensenyar ioga: he impartit classes a diverses escoles, he creat el meu propi centre i he dirigit formacions per a futurs professors. Per a mi, el ioga no és una pràctica de perfecció, sinó de presència i curiositat.", name: 'Ramon Moles i Domènech', role: 'Instructor de ioga (Ashtanga Vinyasa)', avatarId: 'ramon', avatarSrcOverride: 'uploads/WhatsApp Image 2026-07-28 at 17.45.24.jpeg', linkedin: '' },
    ],
    es: [
      { quote: 'Espai Llibertat fue una etapa importante en el desarrollo de mi proyecto profesional. Me permitió disponer de un espacio acogedor donde empezar a dar forma a mi manera de trabajar, crecer como fisioterapeuta y consolidar progresivamente mi práctica. Guardo un recuerdo muy positivo, tanto por el entorno como por el trato humano recibido. Creo que es una muy buena opción para profesionales que quieran iniciar o hacer crecer su proyecto con libertad y confianza.', name: 'Àngels Monedero', role: 'Fisioterapeuta integrativa', avatarId: 'avatar-angels', linkedin: 'https://www.linkedin.com/in/angelsmonedero/' },
      { quote: 'Durante más de tres años, colaboré con Libi en Espai Llibertat, donde adquirí mucha experiencia y desarrollé mi práctica con total flexibilidad y disponibilidad en el espacio.\n\nEn aquella etapa me surgieron nuevas oportunidades laborales, como incorporarme como fisioterapeuta deportivo al fútbol formativo del FC Barcelona.\n\nEstoy muy agradecido a Libi por haber podido trabajar en su espacio, que fue una gran oportunidad para crecer a nivel profesional. Recomiendo a cualquier profesional colaborar con ella por su cercanía y profesionalidad.', name: 'Martí Soler Torrella', role: 'Fisioterapeuta deportivo y musculoesquelético', avatarId: 'avatar-marti', linkedin: 'https://www.linkedin.com/in/mart%C3%AD-soler-torrella-414982ba/' },
      { quote: 'El yoga llegó a mi vida en 2015, en un momento de gran agotamiento, y me permitió redescubrir mi centro y mi propia esencia. Tras formarme en varios estilos, fue con el Ashtanga Vinyasa donde sentí una conexión profunda: su disciplina y precisión me ofrecieron el marco perfecto para la reconexión física, mental y emocional. Hace más de diez años que me dedico exclusivamente a enseñar yoga: he impartido clases en distintas escuelas, he creado mi propio centro y he dirigido formaciones para futuros profesores. Para mí, el yoga no es una práctica de perfección, sino de presencia y curiosidad.', name: 'Ramon Moles i Domènech', role: 'Instructor de yoga (Ashtanga Vinyasa)', avatarId: 'ramon', avatarSrcOverride: 'uploads/WhatsApp Image 2026-07-28 at 17.45.24.jpeg', linkedin: '' },
    ],
  };

  renderVals() {
    const lang = this.state.lang;
    const t = this.T[lang];
    const galleryPhotos = this.galleryPhotosData[lang];
    const testimonials = this.testimonialsData[lang];
    const imgBox = (src, size) => `width:${size}px; height:${size}px; background-image:url(${this.resolveAsset(src)}); background-size:contain; background-repeat:no-repeat; background-position:center;`;
    const showLi = this.props.showLinkedinIcon ?? true;
    const shape = this.props.testimonialPhotoShape === 'square' ? 'var(--radius-md)' : '50%';
    const roomType = this.state.roomType;

    return {
      lang, t,
      isMobile: this.state.isMobile,
      mobileBtnStyle: this.state.isMobileOnly ? 'width:100%;' : '',
      mobileLinkStyle: this.state.isMobileOnly ? 'display:grid; width:100%;' : '',
      segmentsCols: this.state.isMobileOnly ? 'repeat(1, 1fr)' : (this.state.isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
      servicesCols: this.state.isMobileOnly ? 'repeat(1, 1fr)' : (this.state.isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
      showDesktopNav: !this.state.isMobile,
      mobileMenuOpen: this.state.mobileMenuOpen,
      mobileMenuIcon: this.state.mobileMenuOpen ? 'x' : 'menu',
      toggleMobileMenu: this.toggleMobileMenu,
      closeMobileMenu: this.closeMobileMenu,
      galleryArrowOffset: this.state.isMobile ? '4px' : '-20px',
      setLangCa: () => this.setState({ lang: 'ca' }),
      setLangEs: () => this.setState({ lang: 'es' }),
      caBg: lang === 'ca' ? 'var(--color-primary)' : 'var(--color-canvas)',
      caColor: lang === 'ca' ? 'var(--color-on-primary)' : 'var(--color-ink-muted)',
      esBg: lang === 'es' ? 'var(--color-primary)' : 'var(--color-canvas)',
      esColor: lang === 'es' ? 'var(--color-on-primary)' : 'var(--color-ink-muted)',
      quick: this.quickData[lang],
      segments: this.segmentsData[lang].map((s) => ({ ...s, imgStyle: imgBox(s.image, 72) })),
      rooms: this.roomsData[lang].map((r) => ({
        ...r,
        imgStyle: `width:100%; aspect-ratio:16/9; background-image:url(${this.resolveAsset(r.img)}); background-size:cover; background-position:center;`,
        mailHref: this.buildMailto(r.mailSubject),
        seeRates: () => this.setRoomType(r.key),
      })),
      services: this.servicesData[lang].map((sv) => ({ ...sv, hasIcon: !!sv.icon, hasImage: !!sv.image, imgStyle: sv.image ? imgBox(sv.image, 72) : '' })),
      steps: this.stepsData[lang].map((st, i) => ({
        ...st,
        expanded: this.state.expandedStep === i,
        chevronIcon: this.state.expandedStep === i ? 'chevron-up' : 'chevron-down',
        toggle: () => this.setState(s => ({ expandedStep: s.expandedStep === i ? -1 : i })),
      })),
      galleryPhotos: galleryPhotos.map((g, i) => ({ ...g, imgStyle: `width:100%; height:100%; border-radius:12px; background-image:url(${this.slotImage(g.id)}); background-size:cover; background-position:center;`, open: () => this.setState({ lightboxIndex: i }) })),
      galleryRef: this.galleryRef,
      scrollGalleryLeft: this.scrollGalleryLeft,
      scrollGalleryRight: this.scrollGalleryRight,
      lightboxOpen: this.state.lightboxIndex !== null,
      lightboxImgStyle: this.state.lightboxIndex !== null ? `width:100%; height:100%; border-radius:12px; background-image:url(${this.slotImage(galleryPhotos[this.state.lightboxIndex].id)}); background-size:contain; background-repeat:no-repeat; background-position:center;` : '',
      lightboxPlaceholder: this.state.lightboxIndex !== null ? galleryPhotos[this.state.lightboxIndex].placeholder : '',
      closeLightbox: this.closeLightbox,
      stopPropagation: this.stopPropagation,
      roomTabs: this.roomTabsData[lang],
      roomType,
      roomSummary: this.roomSummaryData[lang][roomType],
      setRoomType: this.setRoomType,
      pricing: this.pricingByRoom[lang][roomType].map((p) => ({
        ...p,
        mailHref: this.buildMailto(p.mailSubject),
        infoLabel: p.info || '',
        infoHref: p.infoMsg ? this.buildWa(p.infoMsg) : '',
        cardProps: { style: { height: '100%', boxSizing: 'border-box', border: p.popular ? '2px solid var(--color-primary)' : undefined } },
      })),
      calcHours: this.state.calcHours,
      calcMax: roomType === 'grupal' ? 16 : 40,
      calcMaxLabel: (roomType === 'grupal' ? 16 : 40) + ' h',
      setCalcHours: this.setCalcHours,
      calc: this.computeCalc(lang, t),
      mailtoReserva: this.buildMailto(lang === 'ca' ? "M'agradaria reservar una hora" : 'Me gustaría reservar una hora'),
      mailtoVisita: this.buildMailto(lang === 'ca' ? "M'agradaria visitar l'espai" : 'Me gustaría visitar el espacio'),
      mailtoFranjaFixa: this.buildMailto(lang === 'ca' ? "Sol·licitud d'informació sobre franja fixa setmanal o ús intensiu" : 'Solicitud de información sobre franja fija semanal o uso intensivo'),
      mailtoDubtesSales: this.buildMailto(lang === 'ca' ? "Tinc dubtes sobre les sales d'Espai Llibertat" : 'Tengo dudas sobre las salas de Espai Llibertat'),
      waLink: this.buildWa(lang === 'ca' ? "M'agradaria sol·licitar més informació de l'espai Llibertat" : 'Me gustaría solicitar más información del espacio Llibertat'),
      footerRooms: this.footerData[lang].rooms,
      footerPros: this.footerData[lang].pros,
      footerArea: this.footerData[lang].area,
      testimonialPhotoColWidth: (this.props.testimonialPhotoWidth ?? 96) + 'px',
      testimonialsTrackStyle: 'display:flex; gap:20px; animation: testimonial-scroll 30s linear infinite; width:max-content;',
      testimonialsDisplay: [...testimonials, ...testimonials].map((tm, i) => ({
        ...tm,
        showLi: showLi && !!tm.linkedin,
        avatarStyle: `width:100%; aspect-ratio:1; border-radius:${shape}; background-image:url(${this.avatarSrcFor(tm)}); background-size:cover; background-position:center;`,
        needsExpand: tm.quote.length > 150,
        openModal: () => this.setState({ activeTestimonialIndex: i % testimonials.length }),
      })),
      activeTestimonial: this.state.activeTestimonialIndex !== null ? { ...testimonials[this.state.activeTestimonialIndex], avatarStyle: `width:52px; height:52px; flex-shrink:0; border-radius:50%; background-image:url(${this.avatarSrcFor(testimonials[this.state.activeTestimonialIndex])}); background-size:cover; background-position:center;` } : { name: '', role: '', quote: '', avatarStyle: '' },
      testimonialModalOpen: this.state.activeTestimonialIndex !== null,
      closeTestimonialModal: () => this.setState({ activeTestimonialIndex: null }),
      faqs: this.faqsData[lang].map((f, i) => ({
        ...f,
        open: this.state.openFaq === i,
        symbol: this.state.openFaq === i ? '−' : '+',
        toggle: () => this.setState(s => ({ openFaq: s.openFaq === i ? -1 : i })),
      })),
    };
  }
}
