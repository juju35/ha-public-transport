var TRANSPORT_CARD_VERSION = '1.6.1';

// ── Header icon: tinted round icon in the integration's accent (the integration keeps its brand/icon.png) ──────
var TRANSPORT_ACCENT = '#00897b';

// ── i18n ──────────────────────────────────────────────────────────────────────
var TransportI18n = {
  en: {
    default_title: 'Next departures',
    now: 'Now',
    min: '{n} min',
    realtime: 'Real time',
    timetable: 'Timetable',
    timetable_hint: 'Timetable time: no real-time data for this departure yet',
    late: '+{n} min late',
    early: '{n} min early',
    no_departures: 'No departure announced for now',
    no_departures_short: 'No departure',
    offline: 'Offline',
    no_entity: 'No stop found. Add a stop in the Public Transport integration or set “entities”.',
    unavailable: 'Departures are unavailable. They will show after the next successful update.',
    stale: 'Network unreachable: departures of the last update',
    alerts: 'Traffic alerts',
    alerts_count: 'Alerts: {n}',
    until: 'until {date}',
    since: 'since {date}',
    more: 'More information',
    level_1: 'Information',
    level_2: 'Disruption',
    level_3: 'Major disruption',
    refresh: 'Refresh',
    refresh_failed: 'Refresh failed:',
    show_full: 'Show the full card',
    show_compact: 'Back to the compact view',
    departures_count: '{n} departures',
    realtime_share: '{n}% real time',
    next_departure: 'Next departure',
    following: 'Then',
    then_times: 'then {list}',
    all: 'All',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Bus',
    mode_metro: 'Metro',
    mode_tram: 'Tram',
    editor: {
      entities: 'Stop sensors',
      title: 'Title',
      show_title: 'Show the title',
      show_scene: 'Show the animated scene',
      illustration_theme: 'Illustration theme',
      theme_auto: 'Automatic (follows the theme)',
      theme_day: 'Day',
      theme_night: 'Night',
      show_alerts: 'Show traffic alerts',
      show_refresh: 'Show the refresh button',
      max_departures: 'Departures per stop',
      time_format: 'Time format',
      time_relative: 'Countdown',
      time_absolute: 'Clock time',
      language: 'Language',
      lang_auto: 'Automatic',
    },
  },
  fr: {
    default_title: 'Prochains départs',
    now: 'À l\'approche',
    min: '{n} min',
    realtime: 'Temps réel',
    timetable: 'Horaire théorique',
    timetable_hint: 'Horaire théorique : pas encore de donnée temps réel pour ce départ',
    late: '+{n} min de retard',
    early: '{n} min d\'avance',
    no_departures: 'Aucun départ annoncé pour l\'instant',
    no_departures_short: 'Aucun départ',
    offline: 'Hors ligne',
    no_entity: 'Aucun arrêt trouvé. Ajoutez un arrêt dans l\'intégration Public Transport ou renseignez « entities ».',
    unavailable: 'Départs indisponibles. Ils s\'afficheront après la prochaine mise à jour réussie.',
    stale: 'Réseau injoignable : départs de la dernière mise à jour',
    alerts: 'Alertes trafic',
    alerts_count: 'Alertes : {n}',
    until: 'jusqu\'au {date}',
    since: 'depuis le {date}',
    more: 'Plus d\'informations',
    level_1: 'Information',
    level_2: 'Perturbation',
    level_3: 'Perturbation majeure',
    refresh: 'Actualiser',
    refresh_failed: 'Échec de l\'actualisation :',
    show_full: 'Afficher la carte complète',
    show_compact: 'Revenir à la vue compacte',
    departures_count: '{n} départs',
    realtime_share: '{n} % en temps réel',
    next_departure: 'Prochain passage',
    following: 'Ensuite',
    then_times: 'puis {list}',
    all: 'Tous',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Bus',
    mode_metro: 'Métro',
    mode_tram: 'Tram',
    editor: {
      entities: 'Capteurs d\'arrêt',
      title: 'Titre',
      show_title: 'Afficher le titre',
      show_scene: 'Afficher la scène animée',
      illustration_theme: 'Thème de l’illustration',
      theme_auto: 'Automatique (suit le thème)',
      theme_day: 'Jour',
      theme_night: 'Nuit',
      show_alerts: 'Afficher les alertes trafic',
      show_refresh: 'Afficher le bouton Actualiser',
      max_departures: 'Départs par arrêt',
      time_format: 'Format de l\'heure',
      time_relative: 'Compte à rebours',
      time_absolute: 'Heure',
      language: 'Langue',
      lang_auto: 'Automatique',
    },
  },
  de: {
    default_title: 'Nächste Abfahrten',
    now: 'Jetzt',
    min: '{n} Min.',
    realtime: 'Echtzeit',
    timetable: 'Fahrplan',
    timetable_hint: 'Fahrplanzeit: noch keine Echtzeitdaten für diese Abfahrt',
    late: '+{n} Min. Verspätung',
    early: '{n} Min. früher',
    no_departures: 'Derzeit keine Abfahrt angekündigt',
    no_departures_short: 'Keine Abfahrt',
    offline: 'Offline',
    no_entity: 'Keine Haltestelle gefunden. Fügen Sie in der Integration Public Transport eine Haltestelle hinzu oder setzen Sie „entities“.',
    unavailable: 'Abfahrten nicht verfügbar. Sie erscheinen nach der nächsten erfolgreichen Aktualisierung.',
    stale: 'Netz nicht erreichbar: Abfahrten der letzten Aktualisierung',
    alerts: 'Verkehrsmeldungen',
    alerts_count: 'Meldungen: {n}',
    until: 'bis {date}',
    since: 'seit {date}',
    more: 'Weitere Informationen',
    level_1: 'Information',
    level_2: 'Störung',
    level_3: 'Schwere Störung',
    refresh: 'Aktualisieren',
    refresh_failed: 'Aktualisierung fehlgeschlagen:',
    show_full: 'Vollständige Karte anzeigen',
    show_compact: 'Zurück zur kompakten Ansicht',
    departures_count: '{n} Abfahrten',
    realtime_share: '{n} % in Echtzeit',
    next_departure: 'Nächste Abfahrt',
    following: 'Danach',
    then_times: 'dann {list}',
    all: 'Alle',
    late_short: '+{n} Min.',
    early_short: '−{n} Min.',
    mode_bus: 'Bus',
    mode_metro: 'U-Bahn',
    mode_tram: 'Tram',
    editor: {
      entities: 'Haltestellensensoren',
      title: 'Titel',
      show_title: 'Titel anzeigen',
      show_scene: 'Animierte Szene anzeigen',
      illustration_theme: 'Thema der Illustration',
      theme_auto: 'Automatisch (folgt dem Thema)',
      theme_day: 'Tag',
      theme_night: 'Nacht',
      show_alerts: 'Verkehrsmeldungen anzeigen',
      show_refresh: 'Aktualisieren-Schaltfläche anzeigen',
      max_departures: 'Abfahrten pro Haltestelle',
      time_format: 'Zeitformat',
      time_relative: 'Countdown',
      time_absolute: 'Uhrzeit',
      language: 'Sprache',
      lang_auto: 'Automatisch',
    },
  },
  es: {
    default_title: 'Próximas salidas',
    now: 'Ahora',
    min: '{n} min',
    realtime: 'Tiempo real',
    timetable: 'Horario',
    timetable_hint: 'Hora del horario: aún no hay datos en tiempo real para esta salida',
    late: '+{n} min de retraso',
    early: '{n} min de adelanto',
    no_departures: 'Ninguna salida anunciada por ahora',
    no_departures_short: 'Sin salidas',
    offline: 'Sin conexión',
    no_entity: 'No se encontró ninguna parada. Añada una parada en la integración Public Transport o indique «entities».',
    unavailable: 'Salidas no disponibles. Se mostrarán tras la próxima actualización correcta.',
    stale: 'Red inaccesible: salidas de la última actualización',
    alerts: 'Avisos de tráfico',
    alerts_count: 'Avisos: {n}',
    until: 'hasta el {date}',
    since: 'desde el {date}',
    more: 'Más información',
    level_1: 'Información',
    level_2: 'Incidencia',
    level_3: 'Incidencia grave',
    refresh: 'Actualizar',
    refresh_failed: 'Error al actualizar:',
    show_full: 'Mostrar la tarjeta completa',
    show_compact: 'Volver a la vista compacta',
    departures_count: '{n} salidas',
    realtime_share: '{n} % en tiempo real',
    next_departure: 'Próxima salida',
    following: 'Después',
    then_times: 'luego {list}',
    all: 'Todos',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobús',
    mode_metro: 'Metro',
    mode_tram: 'Tranvía',
    editor: {
      entities: 'Sensores de parada',
      title: 'Título',
      show_title: 'Mostrar el título',
      show_scene: 'Mostrar la escena animada',
      illustration_theme: 'Tema de la ilustración',
      theme_auto: 'Automático (sigue el tema)',
      theme_day: 'Día',
      theme_night: 'Noche',
      show_alerts: 'Mostrar los avisos de tráfico',
      show_refresh: 'Mostrar el botón Actualizar',
      max_departures: 'Salidas por parada',
      time_format: 'Formato de hora',
      time_relative: 'Cuenta atrás',
      time_absolute: 'Hora',
      language: 'Idioma',
      lang_auto: 'Automático',
    },
  },
  it: {
    default_title: 'Prossime partenze',
    now: 'In arrivo',
    min: '{n} min',
    realtime: 'Tempo reale',
    timetable: 'Orario',
    timetable_hint: 'Orario programmato: ancora nessun dato in tempo reale per questa partenza',
    late: '+{n} min di ritardo',
    early: '{n} min di anticipo',
    no_departures: 'Nessuna partenza annunciata per ora',
    no_departures_short: 'Nessuna partenza',
    offline: 'Non in linea',
    no_entity: 'Nessuna fermata trovata. Aggiungi una fermata nell\'integrazione Public Transport o imposta «entities».',
    unavailable: 'Partenze non disponibili. Appariranno dopo il prossimo aggiornamento riuscito.',
    stale: 'Rete non raggiungibile: partenze dell\'ultimo aggiornamento',
    alerts: 'Avvisi traffico',
    alerts_count: 'Avvisi: {n}',
    until: 'fino al {date}',
    since: 'dal {date}',
    more: 'Maggiori informazioni',
    level_1: 'Informazione',
    level_2: 'Disservizio',
    level_3: 'Disservizio grave',
    refresh: 'Aggiorna',
    refresh_failed: 'Aggiornamento non riuscito:',
    show_full: 'Mostra la scheda completa',
    show_compact: 'Torna alla vista compatta',
    departures_count: '{n} partenze',
    realtime_share: '{n}% in tempo reale',
    next_departure: 'Prossima partenza',
    following: 'Poi',
    then_times: 'poi {list}',
    all: 'Tutti',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Bus',
    mode_metro: 'Metro',
    mode_tram: 'Tram',
    editor: {
      entities: 'Sensori di fermata',
      title: 'Titolo',
      show_title: 'Mostra il titolo',
      show_scene: 'Mostra la scena animata',
      illustration_theme: 'Tema dell’illustrazione',
      theme_auto: 'Automatico (segue il tema)',
      theme_day: 'Giorno',
      theme_night: 'Notte',
      show_alerts: 'Mostra gli avvisi traffico',
      show_refresh: 'Mostra il pulsante Aggiorna',
      max_departures: 'Partenze per fermata',
      time_format: 'Formato orario',
      time_relative: 'Conto alla rovescia',
      time_absolute: 'Orario',
      language: 'Lingua',
      lang_auto: 'Automatica',
    },
  },
  nl: {
    default_title: 'Volgende vertrekken',
    now: 'Nu',
    min: '{n} min',
    realtime: 'Realtime',
    timetable: 'Dienstregeling',
    timetable_hint: 'Tijd volgens dienstregeling: nog geen realtime-gegevens voor dit vertrek',
    late: '+{n} min vertraging',
    early: '{n} min te vroeg',
    no_departures: 'Momenteel geen vertrek aangekondigd',
    no_departures_short: 'Geen vertrek',
    offline: 'Offline',
    no_entity: 'Geen halte gevonden. Voeg een halte toe in de integratie Public Transport of stel “entities” in.',
    unavailable: 'Vertrekken niet beschikbaar. Ze verschijnen na de volgende geslaagde update.',
    stale: 'Netwerk onbereikbaar: vertrekken van de laatste update',
    alerts: 'Verkeersmeldingen',
    alerts_count: 'Meldingen: {n}',
    until: 'tot {date}',
    since: 'sinds {date}',
    more: 'Meer informatie',
    level_1: 'Informatie',
    level_2: 'Storing',
    level_3: 'Grote storing',
    refresh: 'Vernieuwen',
    refresh_failed: 'Vernieuwen mislukt:',
    show_full: 'Volledige kaart tonen',
    show_compact: 'Terug naar de compacte weergave',
    departures_count: '{n} vertrekken',
    realtime_share: '{n}% realtime',
    next_departure: 'Volgend vertrek',
    following: 'Daarna',
    then_times: 'dan {list}',
    all: 'Alle',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Bus',
    mode_metro: 'Metro',
    mode_tram: 'Tram',
    editor: {
      entities: 'Haltesensoren',
      title: 'Titel',
      show_title: 'Titel tonen',
      show_scene: 'Geanimeerde scène tonen',
      illustration_theme: 'Thema van de illustratie',
      theme_auto: 'Automatisch (volgt het thema)',
      theme_day: 'Dag',
      theme_night: 'Nacht',
      show_alerts: 'Verkeersmeldingen tonen',
      show_refresh: 'Vernieuwknop tonen',
      max_departures: 'Vertrekken per halte',
      time_format: 'Tijdnotatie',
      time_relative: 'Aftellen',
      time_absolute: 'Kloktijd',
      language: 'Taal',
      lang_auto: 'Automatisch',
    },
  },
  pt: {
    default_title: 'Próximas partidas',
    now: 'A chegar',
    min: '{n} min',
    realtime: 'Tempo real',
    timetable: 'Horário',
    timetable_hint: 'Hora do horário: ainda sem dados em tempo real para esta partida',
    late: '+{n} min de atraso',
    early: '{n} min adiantado',
    no_departures: 'Nenhuma partida anunciada por agora',
    no_departures_short: 'Sem partidas',
    offline: 'Sem ligação',
    no_entity: 'Nenhuma paragem encontrada. Adicione uma paragem na integração Public Transport ou defina «entities».',
    unavailable: 'Partidas indisponíveis. Aparecerão após a próxima atualização bem-sucedida.',
    stale: 'Rede inacessível: partidas da última atualização',
    alerts: 'Alertas de tráfego',
    alerts_count: 'Alertas: {n}',
    until: 'até {date}',
    since: 'desde {date}',
    more: 'Mais informações',
    level_1: 'Informação',
    level_2: 'Perturbação',
    level_3: 'Perturbação grave',
    refresh: 'Atualizar',
    refresh_failed: 'Falha ao atualizar:',
    show_full: 'Mostrar o cartão completo',
    show_compact: 'Voltar à vista compacta',
    departures_count: '{n} partidas',
    realtime_share: '{n}% em tempo real',
    next_departure: 'Próxima partida',
    following: 'Depois',
    then_times: 'depois {list}',
    all: 'Todos',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autocarro',
    mode_metro: 'Metro',
    mode_tram: 'Elétrico',
    editor: {
      entities: 'Sensores de paragem',
      title: 'Título',
      show_title: 'Mostrar o título',
      show_scene: 'Mostrar a cena animada',
      illustration_theme: 'Tema da ilustração',
      theme_auto: 'Automático (segue o tema)',
      theme_day: 'Dia',
      theme_night: 'Noite',
      show_alerts: 'Mostrar os alertas de tráfego',
      show_refresh: 'Mostrar o botão Atualizar',
      max_departures: 'Partidas por paragem',
      time_format: 'Formato da hora',
      time_relative: 'Contagem decrescente',
      time_absolute: 'Hora',
      language: 'Idioma',
      lang_auto: 'Automático',
    },
  },
  pl: {
    default_title: 'Najbliższe odjazdy',
    now: 'Teraz',
    min: '{n} min',
    realtime: 'Czas rzeczywisty',
    timetable: 'Rozkład',
    timetable_hint: 'Czas z rozkładu: brak jeszcze danych w czasie rzeczywistym dla tego odjazdu',
    late: '+{n} min opóźnienia',
    early: '{n} min przed czasem',
    no_departures: 'Na razie brak zapowiedzianych odjazdów',
    no_departures_short: 'Brak odjazdów',
    offline: 'Offline',
    no_entity: 'Nie znaleziono przystanku. Dodaj przystanek w integracji Public Transport lub ustaw „entities”.',
    unavailable: 'Odjazdy niedostępne. Pojawią się po następnej udanej aktualizacji.',
    stale: 'Sieć nieosiągalna: odjazdy z ostatniej aktualizacji',
    alerts: 'Komunikaty o utrudnieniach',
    alerts_count: 'Komunikaty: {n}',
    until: 'do {date}',
    since: 'od {date}',
    more: 'Więcej informacji',
    level_1: 'Informacja',
    level_2: 'Utrudnienie',
    level_3: 'Poważne utrudnienie',
    refresh: 'Odśwież',
    refresh_failed: 'Odświeżenie nie powiodło się:',
    show_full: 'Pokaż pełną kartę',
    show_compact: 'Wróć do widoku kompaktowego',
    departures_count: 'Odjazdy: {n}',
    realtime_share: '{n}% w czasie rzeczywistym',
    next_departure: 'Najbliższy odjazd',
    following: 'Następnie',
    then_times: 'potem {list}',
    all: 'Wszystkie',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobus',
    mode_metro: 'Metro',
    mode_tram: 'Tramwaj',
    editor: {
      entities: 'Czujniki przystanków',
      title: 'Tytuł',
      show_title: 'Pokaż tytuł',
      show_scene: 'Pokaż animowaną scenę',
      illustration_theme: 'Motyw ilustracji',
      theme_auto: 'Automatycznie (według motywu)',
      theme_day: 'Dzień',
      theme_night: 'Noc',
      show_alerts: 'Pokaż komunikaty o utrudnieniach',
      show_refresh: 'Pokaż przycisk Odśwież',
      max_departures: 'Odjazdy na przystanek',
      time_format: 'Format czasu',
      time_relative: 'Odliczanie',
      time_absolute: 'Godzina',
      language: 'Język',
      lang_auto: 'Automatyczny',
    },
  },
  sr: {
    default_title: 'Следећи поласци',
    now: 'Сада',
    min: '{n} мин',
    realtime: 'Реално време',
    timetable: 'Ред вожње',
    timetable_hint: 'Време по реду вожње: још нема података у реалном времену за овај полазак',
    late: '+{n} мин кашњења',
    early: '{n} мин раније',
    no_departures: 'Тренутно нема најављених полазака',
    no_departures_short: 'Нема полазака',
    offline: 'Ван мреже',
    no_entity: 'Није пронађена ниједна станица. Додајте станицу у интеграцији Public Transport или подесите „entities“.',
    unavailable: 'Поласци нису доступни. Појавиће се после следећег успешног ажурирања.',
    stale: 'Мрежа није доступна: поласци са последњег ажурирања',
    alerts: 'Саобраћајна упозорења',
    alerts_count: 'Упозорења: {n}',
    until: 'до {date}',
    since: 'од {date}',
    more: 'Више информација',
    level_1: 'Информација',
    level_2: 'Сметња',
    level_3: 'Озбиљна сметња',
    refresh: 'Освежи',
    refresh_failed: 'Освежавање није успело:',
    show_full: 'Прикажи целу картицу',
    show_compact: 'Назад на сажети приказ',
    departures_count: 'Поласци: {n}',
    realtime_share: '{n}% у реалном времену',
    next_departure: 'Следећи полазак',
    following: 'Затим',
    then_times: 'затим {list}',
    all: 'Све',
    late_short: '+{n} мин',
    early_short: '−{n} мин',
    mode_bus: 'Аутобус',
    mode_metro: 'Метро',
    mode_tram: 'Трамвај',
    editor: {
      entities: 'Сензори станица',
      title: 'Наслов',
      show_title: 'Прикажи наслов',
      show_scene: 'Прикажи анимирану сцену',
      illustration_theme: 'Тема илустрације',
      theme_auto: 'Аутоматски (прати тему)',
      theme_day: 'Дан',
      theme_night: 'Ноћ',
      show_alerts: 'Прикажи саобраћајна упозорења',
      show_refresh: 'Прикажи дугме Освежи',
      max_departures: 'Поласци по станици',
      time_format: 'Формат времена',
      time_relative: 'Одбројавање',
      time_absolute: 'Сат',
      language: 'Језик',
      lang_auto: 'Аутоматски',
    },
  },
  'sr-Latn': {
    default_title: 'Sledeći polasci',
    now: 'Sada',
    min: '{n} min',
    realtime: 'Realno vreme',
    timetable: 'Red vožnje',
    timetable_hint: 'Vreme po redu vožnje: još nema podataka u realnom vremenu za ovaj polazak',
    late: '+{n} min kašnjenja',
    early: '{n} min ranije',
    no_departures: 'Trenutno nema najavljenih polazaka',
    no_departures_short: 'Nema polazaka',
    offline: 'Van mreže',
    no_entity: 'Nije pronađena nijedna stanica. Dodajte stanicu u integraciji Public Transport ili podesite „entities“.',
    unavailable: 'Polasci nisu dostupni. Pojaviće se posle sledećeg uspešnog ažuriranja.',
    stale: 'Mreža nije dostupna: polasci sa poslednjeg ažuriranja',
    alerts: 'Saobraćajna upozorenja',
    alerts_count: 'Upozorenja: {n}',
    until: 'do {date}',
    since: 'od {date}',
    more: 'Više informacija',
    level_1: 'Informacija',
    level_2: 'Smetnja',
    level_3: 'Ozbiljna smetnja',
    refresh: 'Osveži',
    refresh_failed: 'Osvežavanje nije uspelo:',
    show_full: 'Prikaži celu karticu',
    show_compact: 'Nazad na sažeti prikaz',
    departures_count: 'Polasci: {n}',
    realtime_share: '{n}% u realnom vremenu',
    next_departure: 'Sledeći polazak',
    following: 'Zatim',
    then_times: 'zatim {list}',
    all: 'Sve',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobus',
    mode_metro: 'Metro',
    mode_tram: 'Tramvaj',
    editor: {
      entities: 'Senzori stanica',
      title: 'Naslov',
      show_title: 'Prikaži naslov',
      show_scene: 'Prikaži animiranu scenu',
      illustration_theme: 'Tema ilustracije',
      theme_auto: 'Automatski (prati temu)',
      theme_day: 'Dan',
      theme_night: 'Noć',
      show_alerts: 'Prikaži saobraćajna upozorenja',
      show_refresh: 'Prikaži dugme Osveži',
      max_departures: 'Polasci po stanici',
      time_format: 'Format vremena',
      time_relative: 'Odbrojavanje',
      time_absolute: 'Sat',
      language: 'Jezik',
      lang_auto: 'Automatski',
    },
  },
  ro: {
    default_title: 'Următoarele plecări',
    now: 'Acum',
    min: '{n} min',
    realtime: 'Timp real',
    timetable: 'Orar',
    timetable_hint: 'Ora din orar: încă nu există date în timp real pentru această plecare',
    late: '+{n} min întârziere',
    early: '{n} min mai devreme',
    no_departures: 'Nicio plecare anunțată deocamdată',
    no_departures_short: 'Nicio plecare',
    offline: 'Offline',
    no_entity: 'Nu s-a găsit nicio stație. Adăugați o stație în integrarea Public Transport sau setați „entities”.',
    unavailable: 'Plecări indisponibile. Vor apărea după următoarea actualizare reușită.',
    stale: 'Rețea inaccesibilă: plecările ultimei actualizări',
    alerts: 'Alerte de trafic',
    alerts_count: 'Alerte: {n}',
    until: 'până la {date}',
    since: 'din {date}',
    more: 'Mai multe informații',
    level_1: 'Informare',
    level_2: 'Perturbare',
    level_3: 'Perturbare majoră',
    refresh: 'Reîmprospătare',
    refresh_failed: 'Reîmprospătarea a eșuat:',
    show_full: 'Afișați cardul complet',
    show_compact: 'Înapoi la vizualizarea compactă',
    departures_count: '{n} plecări',
    realtime_share: '{n}% în timp real',
    next_departure: 'Următoarea plecare',
    following: 'Apoi',
    then_times: 'apoi {list}',
    all: 'Toate',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobuz',
    mode_metro: 'Metrou',
    mode_tram: 'Tramvai',
    editor: {
      entities: 'Senzori de stație',
      title: 'Titlu',
      show_title: 'Afișați titlul',
      show_scene: 'Afișați scena animată',
      illustration_theme: 'Tema ilustrației',
      theme_auto: 'Automat (urmează tema)',
      theme_day: 'Zi',
      theme_night: 'Noapte',
      show_alerts: 'Afișați alertele de trafic',
      show_refresh: 'Afișați butonul Reîmprospătare',
      max_departures: 'Plecări per stație',
      time_format: 'Format oră',
      time_relative: 'Numărătoare inversă',
      time_absolute: 'Ora',
      language: 'Limbă',
      lang_auto: 'Automat',
    },
  },
  da: {
    default_title: 'Næste afgange',
    now: 'Nu',
    min: '{n} min',
    realtime: 'Realtid',
    timetable: 'Køreplan',
    timetable_hint: 'Køreplanstid: endnu ingen realtidsdata for denne afgang',
    late: '+{n} min forsinket',
    early: '{n} min før tid',
    no_departures: 'Ingen afgang annonceret lige nu',
    no_departures_short: 'Ingen afgang',
    offline: 'Offline',
    no_entity: 'Intet stoppested fundet. Tilføj et stoppested i integrationen Public Transport, eller angiv “entities”.',
    unavailable: 'Afgange er ikke tilgængelige. De vises efter næste vellykkede opdatering.',
    stale: 'Netværket kan ikke nås: afgange fra sidste opdatering',
    alerts: 'Trafikmeddelelser',
    alerts_count: 'Meddelelser: {n}',
    until: 'indtil {date}',
    since: 'siden {date}',
    more: 'Flere oplysninger',
    level_1: 'Information',
    level_2: 'Forstyrrelse',
    level_3: 'Større forstyrrelse',
    refresh: 'Opdater',
    refresh_failed: 'Opdatering mislykkedes:',
    show_full: 'Vis hele kortet',
    show_compact: 'Tilbage til kompakt visning',
    departures_count: '{n} afgange',
    realtime_share: '{n} % i realtid',
    next_departure: 'Næste afgang',
    following: 'Derefter',
    then_times: 'derefter {list}',
    all: 'Alle',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Bus',
    mode_metro: 'Metro',
    mode_tram: 'Sporvogn',
    editor: {
      entities: 'Stoppestedssensorer',
      title: 'Titel',
      show_title: 'Vis titlen',
      show_scene: 'Vis den animerede scene',
      illustration_theme: 'Illustrationens tema',
      theme_auto: 'Automatisk (følger temaet)',
      theme_day: 'Dag',
      theme_night: 'Nat',
      show_alerts: 'Vis trafikmeddelelser',
      show_refresh: 'Vis knappen Opdater',
      max_departures: 'Afgange pr. stoppested',
      time_format: 'Tidsformat',
      time_relative: 'Nedtælling',
      time_absolute: 'Klokkeslæt',
      language: 'Sprog',
      lang_auto: 'Automatisk',
    },
  },
  sv: {
    default_title: 'Nästa avgångar',
    now: 'Nu',
    min: '{n} min',
    realtime: 'Realtid',
    timetable: 'Tidtabell',
    timetable_hint: 'Tidtabellstid: ännu inga realtidsdata för denna avgång',
    late: '+{n} min sen',
    early: '{n} min tidig',
    no_departures: 'Ingen avgång annonserad just nu',
    no_departures_short: 'Ingen avgång',
    offline: 'Offline',
    no_entity: 'Ingen hållplats hittades. Lägg till en hållplats i integrationen Public Transport eller ange ”entities”.',
    unavailable: 'Avgångarna är inte tillgängliga. De visas efter nästa lyckade uppdatering.',
    stale: 'Nätverket kan inte nås: avgångar från senaste uppdateringen',
    alerts: 'Trafikstörningar',
    alerts_count: 'Störningar: {n}',
    until: 'till {date}',
    since: 'sedan {date}',
    more: 'Mer information',
    level_1: 'Information',
    level_2: 'Störning',
    level_3: 'Större störning',
    refresh: 'Uppdatera',
    refresh_failed: 'Uppdateringen misslyckades:',
    show_full: 'Visa hela kortet',
    show_compact: 'Tillbaka till kompakt vy',
    departures_count: '{n} avgångar',
    realtime_share: '{n} % i realtid',
    next_departure: 'Nästa avgång',
    following: 'Sedan',
    then_times: 'sedan {list}',
    all: 'Alla',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Buss',
    mode_metro: 'Tunnelbana',
    mode_tram: 'Spårvagn',
    editor: {
      entities: 'Hållplatssensorer',
      title: 'Titel',
      show_title: 'Visa titeln',
      show_scene: 'Visa den animerade scenen',
      illustration_theme: 'Illustrationens tema',
      theme_auto: 'Automatiskt (följer temat)',
      theme_day: 'Dag',
      theme_night: 'Natt',
      show_alerts: 'Visa trafikstörningar',
      show_refresh: 'Visa knappen Uppdatera',
      max_departures: 'Avgångar per hållplats',
      time_format: 'Tidsformat',
      time_relative: 'Nedräkning',
      time_absolute: 'Klockslag',
      language: 'Språk',
      lang_auto: 'Automatiskt',
    },
  },
  bg: {
    default_title: 'Следващи тръгвания',
    now: 'Сега',
    min: '{n} мин',
    realtime: 'Реално време',
    timetable: 'Разписание',
    timetable_hint: 'Час по разписание: все още няма данни в реално време за това тръгване',
    late: '+{n} мин закъснение',
    early: '{n} мин по-рано',
    no_departures: 'Засега няма обявени тръгвания',
    no_departures_short: 'Няма тръгвания',
    offline: 'Офлайн',
    no_entity: 'Не е намерена спирка. Добавете спирка в интеграцията Public Transport или задайте „entities“.',
    unavailable: 'Тръгванията не са налични. Ще се покажат след следващото успешно обновяване.',
    stale: 'Мрежата е недостъпна: тръгвания от последното обновяване',
    alerts: 'Пътни известия',
    alerts_count: 'Известия: {n}',
    until: 'до {date}',
    since: 'от {date}',
    more: 'Повече информация',
    level_1: 'Информация',
    level_2: 'Смущение',
    level_3: 'Сериозно смущение',
    refresh: 'Обнови',
    refresh_failed: 'Неуспешно обновяване:',
    show_full: 'Покажи пълната карта',
    show_compact: 'Обратно към компактния изглед',
    departures_count: 'Тръгвания: {n}',
    realtime_share: '{n}% в реално време',
    next_departure: 'Следващо тръгване',
    following: 'След това',
    then_times: 'след това {list}',
    all: 'Всички',
    late_short: '+{n} мин',
    early_short: '−{n} мин',
    mode_bus: 'Автобус',
    mode_metro: 'Метро',
    mode_tram: 'Трамвай',
    editor: {
      entities: 'Сензори на спирки',
      title: 'Заглавие',
      show_title: 'Покажи заглавието',
      show_scene: 'Покажи анимираната сцена',
      illustration_theme: 'Тема на илюстрацията',
      theme_auto: 'Автоматично (следва темата)',
      theme_day: 'Ден',
      theme_night: 'Нощ',
      show_alerts: 'Покажи пътните известия',
      show_refresh: 'Покажи бутона Обнови',
      max_departures: 'Тръгвания на спирка',
      time_format: 'Формат на часа',
      time_relative: 'Обратно броене',
      time_absolute: 'Час',
      language: 'Език',
      lang_auto: 'Автоматично',
    },
  },
  ru: {
    default_title: 'Ближайшие отправления',
    now: 'Сейчас',
    min: '{n} мин',
    realtime: 'Реальное время',
    timetable: 'Расписание',
    timetable_hint: 'Время по расписанию: данных в реальном времени для этого отправления пока нет',
    late: '+{n} мин опоздание',
    early: 'на {n} мин раньше',
    no_departures: 'Пока отправлений не объявлено',
    no_departures_short: 'Нет отправлений',
    offline: 'Нет связи',
    no_entity: 'Остановка не найдена. Добавьте остановку в интеграции Public Transport или укажите «entities».',
    unavailable: 'Отправления недоступны. Они появятся после следующего успешного обновления.',
    stale: 'Сеть недоступна: отправления последнего обновления',
    alerts: 'Транспортные оповещения',
    alerts_count: 'Оповещения: {n}',
    until: 'до {date}',
    since: 'с {date}',
    more: 'Подробнее',
    level_1: 'Информация',
    level_2: 'Нарушение движения',
    level_3: 'Серьёзное нарушение',
    refresh: 'Обновить',
    refresh_failed: 'Не удалось обновить:',
    show_full: 'Показать полную карточку',
    show_compact: 'Вернуться к компактному виду',
    departures_count: 'Отправления: {n}',
    realtime_share: '{n}% в реальном времени',
    next_departure: 'Ближайшее отправление',
    following: 'Далее',
    then_times: 'затем {list}',
    all: 'Все',
    late_short: '+{n} мин',
    early_short: '−{n} мин',
    mode_bus: 'Автобус',
    mode_metro: 'Метро',
    mode_tram: 'Трамвай',
    editor: {
      entities: 'Датчики остановок',
      title: 'Заголовок',
      show_title: 'Показывать заголовок',
      show_scene: 'Показывать анимированную сцену',
      illustration_theme: 'Тема иллюстрации',
      theme_auto: 'Автоматически (по теме)',
      theme_day: 'День',
      theme_night: 'Ночь',
      show_alerts: 'Показывать транспортные оповещения',
      show_refresh: 'Показывать кнопку «Обновить»',
      max_departures: 'Отправлений на остановку',
      time_format: 'Формат времени',
      time_relative: 'Обратный отсчёт',
      time_absolute: 'Время',
      language: 'Язык',
      lang_auto: 'Автоматически',
    },
  },
  uk: {
    default_title: 'Найближчі відправлення',
    now: 'Зараз',
    min: '{n} хв',
    realtime: 'Реальний час',
    timetable: 'Розклад',
    timetable_hint: 'Час за розкладом: даних у реальному часі для цього відправлення ще немає',
    late: '+{n} хв запізнення',
    early: 'на {n} хв раніше',
    no_departures: 'Поки що відправлень не оголошено',
    no_departures_short: 'Немає відправлень',
    offline: 'Немає зв’язку',
    no_entity: 'Зупинку не знайдено. Додайте зупинку в інтеграції Public Transport або вкажіть «entities».',
    unavailable: 'Відправлення недоступні. Вони з\'являться після наступного успішного оновлення.',
    stale: 'Мережа недоступна: відправлення останнього оновлення',
    alerts: 'Транспортні сповіщення',
    alerts_count: 'Сповіщення: {n}',
    until: 'до {date}',
    since: 'з {date}',
    more: 'Докладніше',
    level_1: 'Інформація',
    level_2: 'Порушення руху',
    level_3: 'Серйозне порушення',
    refresh: 'Оновити',
    refresh_failed: 'Не вдалося оновити:',
    show_full: 'Показати повну картку',
    show_compact: 'Повернутися до компактного вигляду',
    departures_count: 'Відправлення: {n}',
    realtime_share: '{n}% у реальному часі',
    next_departure: 'Найближче відправлення',
    following: 'Далі',
    then_times: 'потім {list}',
    all: 'Усі',
    late_short: '+{n} хв',
    early_short: '−{n} хв',
    mode_bus: 'Автобус',
    mode_metro: 'Метро',
    mode_tram: 'Трамвай',
    editor: {
      entities: 'Датчики зупинок',
      title: 'Заголовок',
      show_title: 'Показувати заголовок',
      show_scene: 'Показувати анімовану сцену',
      illustration_theme: 'Тема ілюстрації',
      theme_auto: 'Автоматично (за темою)',
      theme_day: 'День',
      theme_night: 'Ніч',
      show_alerts: 'Показувати транспортні сповіщення',
      show_refresh: 'Показувати кнопку «Оновити»',
      max_departures: 'Відправлень на зупинку',
      time_format: 'Формат часу',
      time_relative: 'Зворотний відлік',
      time_absolute: 'Час',
      language: 'Мова',
      lang_auto: 'Автоматично',
    },
  },
  hu: {
    default_title: 'Következő indulások',
    now: 'Most',
    min: '{n} perc',
    realtime: 'Valós idő',
    timetable: 'Menetrend',
    timetable_hint: 'Menetrendi idő: ehhez az induláshoz még nincs valós idejű adat',
    late: '+{n} perc késés',
    early: '{n} perccel korábban',
    no_departures: 'Jelenleg nincs bejelentett indulás',
    no_departures_short: 'Nincs indulás',
    offline: 'Offline',
    no_entity: 'Nem található megálló. Adjon hozzá megállót a Public Transport integrációban, vagy adja meg az „entities” opciót.',
    unavailable: 'Az indulások nem érhetők el. A következő sikeres frissítés után jelennek meg.',
    stale: 'A hálózat nem érhető el: a legutóbbi frissítés indulásai',
    alerts: 'Forgalmi riasztások',
    alerts_count: 'Riasztások: {n}',
    until: 'eddig: {date}',
    since: 'ettől: {date}',
    more: 'További információ',
    level_1: 'Információ',
    level_2: 'Fennakadás',
    level_3: 'Súlyos fennakadás',
    refresh: 'Frissítés',
    refresh_failed: 'A frissítés sikertelen:',
    show_full: 'Teljes kártya megjelenítése',
    show_compact: 'Vissza a kompakt nézethez',
    departures_count: '{n} indulás',
    realtime_share: '{n}% valós idejű',
    next_departure: 'Következő indulás',
    following: 'Utána',
    then_times: 'majd {list}',
    all: 'Összes',
    late_short: '+{n} perc',
    early_short: '−{n} perc',
    mode_bus: 'Busz',
    mode_metro: 'Metró',
    mode_tram: 'Villamos',
    editor: {
      entities: 'Megálló-érzékelők',
      title: 'Cím',
      show_title: 'Cím megjelenítése',
      show_scene: 'Animált jelenet megjelenítése',
      illustration_theme: 'Az illusztráció témája',
      theme_auto: 'Automatikus (a témát követi)',
      theme_day: 'Nappal',
      theme_night: 'Éjszaka',
      show_alerts: 'Forgalmi riasztások megjelenítése',
      show_refresh: 'Frissítés gomb megjelenítése',
      max_departures: 'Indulások megállónként',
      time_format: 'Időformátum',
      time_relative: 'Visszaszámlálás',
      time_absolute: 'Pontos idő',
      language: 'Nyelv',
      lang_auto: 'Automatikus',
    },
  },
  sk: {
    default_title: 'Najbližšie odchody',
    now: 'Teraz',
    min: '{n} min',
    realtime: 'Reálny čas',
    timetable: 'Cestovný poriadok',
    timetable_hint: 'Čas podľa cestovného poriadku: pre tento odchod zatiaľ nie sú údaje v reálnom čase',
    late: '+{n} min meškanie',
    early: 'o {n} min skôr',
    no_departures: 'Zatiaľ nie je ohlásený žiadny odchod',
    no_departures_short: 'Žiadny odchod',
    offline: 'Offline',
    no_entity: 'Nenašla sa žiadna zastávka. Pridajte zastávku v integrácii Public Transport alebo nastavte „entities“.',
    unavailable: 'Odchody nie sú dostupné. Zobrazia sa po ďalšej úspešnej aktualizácii.',
    stale: 'Sieť je nedostupná: odchody z poslednej aktualizácie',
    alerts: 'Dopravné upozornenia',
    alerts_count: 'Upozornenia: {n}',
    until: 'do {date}',
    since: 'od {date}',
    more: 'Viac informácií',
    level_1: 'Informácia',
    level_2: 'Obmedzenie',
    level_3: 'Vážne obmedzenie',
    refresh: 'Obnoviť',
    refresh_failed: 'Obnovenie zlyhalo:',
    show_full: 'Zobraziť celú kartu',
    show_compact: 'Späť na kompaktné zobrazenie',
    departures_count: 'Odchody: {n}',
    realtime_share: '{n} % v reálnom čase',
    next_departure: 'Najbližší odchod',
    following: 'Potom',
    then_times: 'potom {list}',
    all: 'Všetky',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobus',
    mode_metro: 'Metro',
    mode_tram: 'Električka',
    editor: {
      entities: 'Snímače zastávok',
      title: 'Názov',
      show_title: 'Zobraziť názov',
      show_scene: 'Zobraziť animovanú scénu',
      illustration_theme: 'Téma ilustrácie',
      theme_auto: 'Automaticky (podľa témy)',
      theme_day: 'Deň',
      theme_night: 'Noc',
      show_alerts: 'Zobraziť dopravné upozornenia',
      show_refresh: 'Zobraziť tlačidlo Obnoviť',
      max_departures: 'Odchody na zastávku',
      time_format: 'Formát času',
      time_relative: 'Odpočítavanie',
      time_absolute: 'Čas',
      language: 'Jazyk',
      lang_auto: 'Automaticky',
    },
  },
  cs: {
    default_title: 'Nejbližší odjezdy',
    now: 'Teď',
    min: '{n} min',
    realtime: 'Reálný čas',
    timetable: 'Jízdní řád',
    timetable_hint: 'Čas podle jízdního řádu: pro tento odjezd zatím nejsou data v reálném čase',
    late: '+{n} min zpoždění',
    early: 'o {n} min dříve',
    no_departures: 'Zatím není ohlášen žádný odjezd',
    no_departures_short: 'Žádný odjezd',
    offline: 'Offline',
    no_entity: 'Nebyla nalezena žádná zastávka. Přidejte zastávku v integraci Public Transport nebo nastavte „entities“.',
    unavailable: 'Odjezdy nejsou dostupné. Zobrazí se po další úspěšné aktualizaci.',
    stale: 'Síť je nedostupná: odjezdy z poslední aktualizace',
    alerts: 'Dopravní upozornění',
    alerts_count: 'Upozornění: {n}',
    until: 'do {date}',
    since: 'od {date}',
    more: 'Více informací',
    level_1: 'Informace',
    level_2: 'Omezení',
    level_3: 'Vážné omezení',
    refresh: 'Obnovit',
    refresh_failed: 'Obnovení selhalo:',
    show_full: 'Zobrazit celou kartu',
    show_compact: 'Zpět na kompaktní zobrazení',
    departures_count: 'Odjezdy: {n}',
    realtime_share: '{n} % v reálném čase',
    next_departure: 'Nejbližší odjezd',
    following: 'Potom',
    then_times: 'potom {list}',
    all: 'Vše',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobus',
    mode_metro: 'Metro',
    mode_tram: 'Tramvaj',
    editor: {
      entities: 'Senzory zastávek',
      title: 'Název',
      show_title: 'Zobrazit název',
      show_scene: 'Zobrazit animovanou scénu',
      illustration_theme: 'Motiv ilustrace',
      theme_auto: 'Automaticky (podle motivu)',
      theme_day: 'Den',
      theme_night: 'Noc',
      show_alerts: 'Zobrazit dopravní upozornění',
      show_refresh: 'Zobrazit tlačítko Obnovit',
      max_departures: 'Odjezdy na zastávku',
      time_format: 'Formát času',
      time_relative: 'Odpočet',
      time_absolute: 'Čas',
      language: 'Jazyk',
      lang_auto: 'Automaticky',
    },
  },
  sl: {
    default_title: 'Naslednji odhodi',
    now: 'Zdaj',
    min: '{n} min',
    realtime: 'Realni čas',
    timetable: 'Vozni red',
    timetable_hint: 'Čas po voznem redu: za ta odhod še ni podatkov v realnem času',
    late: '+{n} min zamude',
    early: '{n} min prej',
    no_departures: 'Trenutno ni napovedanih odhodov',
    no_departures_short: 'Ni odhodov',
    offline: 'Brez povezave',
    no_entity: 'Ni najdenega postajališča. Dodajte postajališče v integraciji Public Transport ali nastavite »entities«.',
    unavailable: 'Odhodi niso na voljo. Prikazali se bodo po naslednji uspešni posodobitvi.',
    stale: 'Omrežje ni dosegljivo: odhodi zadnje posodobitve',
    alerts: 'Prometna opozorila',
    alerts_count: 'Opozorila: {n}',
    until: 'do {date}',
    since: 'od {date}',
    more: 'Več informacij',
    level_1: 'Informacija',
    level_2: 'Motnja',
    level_3: 'Večja motnja',
    refresh: 'Osveži',
    refresh_failed: 'Osvežitev ni uspela:',
    show_full: 'Prikaži celotno kartico',
    show_compact: 'Nazaj na strnjen pogled',
    departures_count: 'Odhodi: {n}',
    realtime_share: '{n} % v realnem času',
    next_departure: 'Naslednji odhod',
    following: 'Nato',
    then_times: 'nato {list}',
    all: 'Vse',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Avtobus',
    mode_metro: 'Metro',
    mode_tram: 'Tramvaj',
    editor: {
      entities: 'Senzorji postajališč',
      title: 'Naslov',
      show_title: 'Prikaži naslov',
      show_scene: 'Prikaži animirano sceno',
      illustration_theme: 'Tema ilustracije',
      theme_auto: 'Samodejno (sledi temi)',
      theme_day: 'Dan',
      theme_night: 'Noč',
      show_alerts: 'Prikaži prometna opozorila',
      show_refresh: 'Prikaži gumb Osveži',
      max_departures: 'Odhodi na postajališče',
      time_format: 'Oblika časa',
      time_relative: 'Odštevanje',
      time_absolute: 'Ura',
      language: 'Jezik',
      lang_auto: 'Samodejno',
    },
  },
  lv: {
    default_title: 'Nākamās atiešanas',
    now: 'Tagad',
    min: '{n} min',
    realtime: 'Reāllaiks',
    timetable: 'Saraksts',
    timetable_hint: 'Laiks pēc saraksta: šai atiešanai vēl nav reāllaika datu',
    late: '+{n} min kavējums',
    early: '{n} min agrāk',
    no_departures: 'Pagaidām nav paziņotu atiešanu',
    no_departures_short: 'Nav atiešanu',
    offline: 'Bezsaistē',
    no_entity: 'Pietura nav atrasta. Pievienojiet pieturu integrācijā Public Transport vai iestatiet “entities”.',
    unavailable: 'Atiešanas laiki nav pieejami. Tie parādīsies pēc nākamās veiksmīgās atjaunināšanas.',
    stale: 'Tīkls nav sasniedzams: pēdējās atjaunināšanas atiešanas',
    alerts: 'Satiksmes brīdinājumi',
    alerts_count: 'Brīdinājumi: {n}',
    until: 'līdz {date}',
    since: 'kopš {date}',
    more: 'Vairāk informācijas',
    level_1: 'Informācija',
    level_2: 'Traucējums',
    level_3: 'Nopietns traucējums',
    refresh: 'Atsvaidzināt',
    refresh_failed: 'Atsvaidzināšana neizdevās:',
    show_full: 'Rādīt pilno kartīti',
    show_compact: 'Atpakaļ uz kompakto skatu',
    departures_count: 'Atiešanas: {n}',
    realtime_share: '{n}% reāllaikā',
    next_departure: 'Nākamā atiešana',
    following: 'Pēc tam',
    then_times: 'pēc tam {list}',
    all: 'Visi',
    late_short: '+{n} min',
    early_short: '−{n} min',
    mode_bus: 'Autobuss',
    mode_metro: 'Metro',
    mode_tram: 'Tramvajs',
    editor: {
      entities: 'Pieturu sensori',
      title: 'Virsraksts',
      show_title: 'Rādīt virsrakstu',
      show_scene: 'Rādīt animēto ainu',
      illustration_theme: 'Ilustrācijas motīvs',
      theme_auto: 'Automātiski (seko tēmai)',
      theme_day: 'Diena',
      theme_night: 'Nakts',
      show_alerts: 'Rādīt satiksmes brīdinājumus',
      show_refresh: 'Rādīt pogu Atsvaidzināt',
      max_departures: 'Atiešanas uz pieturu',
      time_format: 'Laika formāts',
      time_relative: 'Atpakaļskaitīšana',
      time_absolute: 'Pulksteņa laiks',
      language: 'Valoda',
      lang_auto: 'Automātiski',
    },
  },
  el: {
    default_title: 'Επόμενες αναχωρήσεις',
    now: 'Τώρα',
    min: '{n} λεπ.',
    realtime: 'Πραγματικός χρόνος',
    timetable: 'Δρομολόγιο',
    timetable_hint: 'Ώρα δρομολογίου: δεν υπάρχουν ακόμη δεδομένα πραγματικού χρόνου για αυτή την αναχώρηση',
    late: '+{n} λεπ. καθυστέρηση',
    early: '{n} λεπ. νωρίτερα',
    no_departures: 'Δεν έχει ανακοινωθεί αναχώρηση προς το παρόν',
    no_departures_short: 'Καμία αναχώρηση',
    offline: 'Εκτός σύνδεσης',
    no_entity: 'Δεν βρέθηκε στάση. Προσθέστε μια στάση στην ενσωμάτωση Public Transport ή ορίστε «entities».',
    unavailable: 'Οι αναχωρήσεις δεν είναι διαθέσιμες. Θα εμφανιστούν μετά την επόμενη επιτυχή ενημέρωση.',
    stale: 'Το δίκτυο δεν είναι προσβάσιμο: αναχωρήσεις της τελευταίας ενημέρωσης',
    alerts: 'Ειδοποιήσεις κυκλοφορίας',
    alerts_count: 'Ειδοποιήσεις: {n}',
    until: 'έως {date}',
    since: 'από {date}',
    more: 'Περισσότερες πληροφορίες',
    level_1: 'Πληροφορία',
    level_2: 'Διαταραχή',
    level_3: 'Σοβαρή διαταραχή',
    refresh: 'Ανανέωση',
    refresh_failed: 'Η ανανέωση απέτυχε:',
    show_full: 'Εμφάνιση πλήρους κάρτας',
    show_compact: 'Επιστροφή στη συμπαγή προβολή',
    departures_count: 'Αναχωρήσεις: {n}',
    realtime_share: '{n}% σε πραγματικό χρόνο',
    next_departure: 'Επόμενη αναχώρηση',
    following: 'Στη συνέχεια',
    then_times: 'μετά {list}',
    all: 'Όλα',
    late_short: '+{n} λεπ.',
    early_short: '−{n} λεπ.',
    mode_bus: 'Λεωφορείο',
    mode_metro: 'Μετρό',
    mode_tram: 'Τραμ',
    editor: {
      entities: 'Αισθητήρες στάσεων',
      title: 'Τίτλος',
      show_title: 'Εμφάνιση τίτλου',
      show_scene: 'Εμφάνιση κινούμενης σκηνής',
      illustration_theme: 'Θέμα εικονογράφησης',
      theme_auto: 'Αυτόματο (ακολουθεί το θέμα)',
      theme_day: 'Ημέρα',
      theme_night: 'Νύχτα',
      show_alerts: 'Εμφάνιση ειδοποιήσεων κυκλοφορίας',
      show_refresh: 'Εμφάνιση κουμπιού Ανανέωση',
      max_departures: 'Αναχωρήσεις ανά στάση',
      time_format: 'Μορφή ώρας',
      time_relative: 'Αντίστροφη μέτρηση',
      time_absolute: 'Ώρα',
      language: 'Γλώσσα',
      lang_auto: 'Αυτόματη',
    },
  },
};

// Single source of the config defaults, shared by the card (setConfig) and the editor.
var TRANSPORT_DEFAULTS = {
  show_title: true,
  show_scene: true,
  show_alerts: true,
  show_refresh: true,
  illustration_theme: 'auto',
  max_departures: 5,
  time_format: 'relative',
};

// Material Design Icons (@mdi/js), drawn inline like the other cards: no dependency on <ha-icon> loading.
var TRANSPORT_ICONS = {
  header: 'M16.5,4V8.25L19.36,9.94L18.61,11.16L15,9V4H16.5M16,13C17.36,13 18.54,12.5 19.5,11.53C20.5,10.56 21,9.39 21,8C21,6.64 20.5,5.46 19.5,4.5C18.54,3.5 17.36,3 16,3C14.61,3 13.44,3.5 12.47,4.5C11.5,5.46 11,6.64 11,8C11,9.39 11.5,10.56 12.47,11.53C13.44,12.5 14.61,13 16,13M13.5,19C13.94,19 14.3,18.84 14.58,18.54C14.86,18.24 15,17.89 15,17.5C15,17.08 14.86,16.73 14.58,16.43C14.3,16.13 13.94,16 13.5,16C13.06,16 12.7,16.13 12.42,16.43C12.14,16.73 12,17.08 12,17.5C12,17.89 12.14,18.24 12.42,18.54C12.7,18.84 13.06,19 13.5,19M3,13H11.11C9.7,11.64 9,10 9,8H3V13M4.5,19C4.94,19 5.3,18.84 5.58,18.54C5.86,18.24 6,17.89 6,17.5C6,17.08 5.86,16.73 5.58,16.43C5.3,16.13 4.94,16 4.5,16C4.06,16 3.7,16.13 3.42,16.43C3.14,16.73 3,17.08 3,17.5C3,17.89 3.14,18.24 3.42,18.54C3.7,18.84 4.06,19 4.5,19M16,1C17.92,1 19.58,1.67 20.95,3.05C22.33,4.42 23,6.08 23,8C23,9.77 22.44,11.29 21.28,12.59C20.13,13.88 18.7,14.66 17,14.91V18C17,18.84 16.67,19.58 16,20.2V22C16,22.27 15.89,22.5 15.7,22.71C15.5,22.91 15.28,23 15,23H14C13.73,23 13.5,22.91 13.29,22.71C13.09,22.5 13,22.27 13,22V21H5V22C5,22.27 4.91,22.5 4.71,22.71C4.5,22.91 4.27,23 4,23H3C2.72,23 2.5,22.91 2.3,22.71C2.11,22.5 2,22.27 2,22V20.2C1.33,19.58 1,18.84 1,18V8C1,6.42 1.67,5.35 3.05,4.8C4.42,4.26 6.41,4 9,4C9.13,4 9.33,4 9.61,4C9.89,4 10.09,4.03 10.22,4.03C11.63,2 13.55,1 16,1Z',
  bus: 'M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z',
  metro: 'M18,11H13V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M11,11H6V6H11M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M12,2C7.58,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2Z',
  tram: 'M19,16.94V8.5C19,5.71 16.39,5.1 13,5L13.75,3.5H17V2H7V3.5H11.75L11,5C7.86,5.11 5,5.73 5,8.5V16.94C5,18.39 6.19,19.6 7.59,19.91L6,21.5V22H8.23L10.23,20H14L16,22H18V21.5L16.5,20H16.42C18.11,20 19,18.63 19,16.94M12,18.5A1.5,1.5 0 0,1 10.5,17A1.5,1.5 0 0,1 12,15.5A1.5,1.5 0 0,1 13.5,17A1.5,1.5 0 0,1 12,18.5M17,14H7V9H17V14Z',
  realtime: 'M4.93,4.93C3.12,6.74 2,9.24 2,12C2,14.76 3.12,17.26 4.93,19.07L6.34,17.66C4.89,16.22 4,14.22 4,12C4,9.79 4.89,7.78 6.34,6.34L4.93,4.93M19.07,4.93L17.66,6.34C19.11,7.78 20,9.79 20,12C20,14.22 19.11,16.22 17.66,17.66L19.07,19.07C20.88,17.26 22,14.76 22,12C22,9.24 20.88,6.74 19.07,4.93M7.76,7.76C6.67,8.85 6,10.35 6,12C6,13.65 6.67,15.15 7.76,16.24L9.17,14.83C8.45,14.11 8,13.11 8,12C8,10.89 8.45,9.89 9.17,9.17L7.76,7.76M16.24,7.76L14.83,9.17C15.55,9.89 16,10.89 16,12C16,13.11 15.55,14.11 14.83,14.83L16.24,16.24C17.33,15.15 18,13.65 18,12C18,10.35 17.33,8.85 16.24,7.76M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z',
  clock: 'M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z',
  marker: 'M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z',
  info: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z',
  alert: 'M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16',
  refresh: 'M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z',
  chevron: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  expand: 'M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z',
  collapse: 'M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z',
  link: 'M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z',
  offline: 'M19.8 22.6L17.15 20H6.5Q4.2 20 2.6 18.4T1 14.5Q1 12.58 2.19 11.08 3.38 9.57 5.25 9.15 5.33 8.95 5.4 8.76 5.5 8.57 5.55 8.35L1.4 4.2L2.8 2.8L21.2 21.2M6.5 18H15.15L7.1 9.95Q7.05 10.23 7.03 10.5 7 10.73 7 11H6.5Q5.05 11 4.03 12.03 3 13.05 3 14.5 3 15.95 4.03 17 5.05 18 6.5 18M11.13 14M21.6 18.75L20.15 17.35Q20.58 17 20.79 16.54 21 16.08 21 15.5 21 14.45 20.27 13.73 19.55 13 18.5 13H17V11Q17 8.93 15.54 7.46 14.08 6 12 6 11.33 6 10.7 6.16 10.07 6.33 9.5 6.68L8.05 5.23Q8.93 4.63 9.91 4.31 10.9 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 16.5 22.63 17.31 22.25 18.15 21.6 18.75M14.83 12.03Z',
  night: 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z',
};

// Approaching: the scene's vehicle drives in and the countdown pulses below this many minutes.
var TRANSPORT_SOON = 2;

function transportEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

// The whole width of an element's text, in fractional pixels, even when it is cut with an ellipsis.
function transportTextWidth(el) {
  var range = document.createRange();
  range.selectNodeContents(el);
  return Math.max(el.scrollWidth, range.getBoundingClientRect().width);
}

function transportIcon(name, cls) {
  return `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${TRANSPORT_ICONS[name] || ''}"/></svg>`;
}

function transportFill(text, values) {
  return String(text).replace(/\{(\w+)\}/g, (m, k) => (values[k] == null ? m : values[k]));
}

// A #rrggbb color, else the fallback: line colors come from the network and end up in style attributes.
function transportColor(value, fallback) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? value : fallback;
}

// The card's `language` option wins over the Home Assistant language. A full code the card knows (sr-Latn) is
// kept, otherwise its part before the dash (fr-FR gives fr, pt-BR gives the European Portuguese pt), else English.
function transportLang(hass, config) {
  var lang = String(config?.language || (hass && (hass.locale?.language || hass.language)) || navigator.language || 'en');
  if (TransportI18n[lang]) return lang;
  lang = lang.split('-')[0];
  return TransportI18n[lang] ? lang : 'en';
}

// Locale for Intl: the full code of the option or of Home Assistant when its base is the resolved language.
// Plain "pt" is European Portuguese in Home Assistant but Brazilian in Intl, so it becomes pt-PT.
function transportLocale(hass, config) {
  var lang = transportLang(hass, config);
  var full = String(config?.language || (hass && (hass.locale?.language || hass.language)) || '');
  var sameScript = /-Latn\b/i.test(full) === /-Latn\b/i.test(lang);
  var locale = full && full.split('-')[0] === lang.split('-')[0] && sameScript ? full : lang;
  return locale === 'pt' ? 'pt-PT' : locale;
}

// Whole minutes left before a departure (0 when it is due or just gone), NaN for an unreadable time.
function transportMinutes(iso, now) {
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) return NaN;
  return Math.max(0, Math.floor((ms - now) / 60000));
}

// The departures of a stop sensor (`departures`) or of a line sensor (`next_departures`) of the integration.
function transportDepartures(a) {
  return Array.isArray(a?.departures) ? a.departures : Array.isArray(a?.next_departures) ? a.next_departures : null;
}

// A stop sensor of the integration (found automatically; line sensors can be picked in the configuration).
function transportIsSensor(id, st) {
  var a = st?.attributes;
  return id.indexOf('sensor.') === 0 && !!a && !!a.config_entry_id && Array.isArray(a.departures) && !!a.stop_name;
}

// A click inside Home Assistant's dialogs (more-info, confirmations) is not "outside" the card.
function transportInDialog(ev) {
  return ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].includes(n.localName));
}

// ── The banner's illustration ─────────────────────────────────────────────────
// A city stop at the right of the banner, drawn in a 200 × 80 box (bottom right aligned): pale buildings with
// their windows, the platform, the stop's pole with its departure display (line, countdown) and the vehicle of the
// next departure in its line color (a bus, two metro cars, or a tram under its wire). The road or the track is not
// part of the picture: it is a 10px strip of the banner (CSS) that runs under the text too. Generic shapes, no
// operator livery. The display and its sign tell the state: on time, delayed (+n'), or disrupted (a red sign).

// Approach bar: the vehicle reaches the stop when the countdown reaches zero, from this many minutes away.
var TRANSPORT_APPROACH = 10;

// Delayed: the next departure runs this many minutes late or more (real time).
var TRANSPORT_LATE = 2;

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day picture after sunset).
function transportIsNight(hass, config) {
  var theme = config?.illustration_theme;
  if (theme === 'day') return false;
  if (theme === 'night') return true;
  return !!hass?.themes?.darkMode;
}

function transportMode(mode) {
  return mode === 'metro' || mode === 'tram' ? mode : 'bus';
}

// The bus, front to the right (70 × 26, wheels on the platform), the line on its front display.
function transportBusSvg(color, label) {
  return `<rect x="0" y="-26" width="70" height="24" rx="5" fill="${color}"/><rect x="0" y="-26" width="70" height="5" rx="3" fill="${color}" opacity=".7"/>` +
    [6, 20, 34, 48].map((x) => `<rect class="bwin" x="${x}" y="-20" width="11" height="9" rx="1.5"/>`).join('') +
    '<rect class="bwin" x="60" y="-20" width="8" height="15" rx="1"/><rect x="4" y="-7" width="52" height="2" fill="#fff" opacity=".6"/>' +
    '<g class="wheel"><circle cx="14" cy="-1" r="4.4"/><circle cx="56" cy="-1" r="4.4"/></g>' +
    `<rect x="2" y="-24" width="14" height="5" rx="1" fill="#1a1d22"/><text class="gtext" x="9" y="-20.2" text-anchor="middle">${label}</text>` +
    '<path class="beam" d="M70 -8 L92 -12 V-2Z"/><g class="puff"><circle cx="-3" cy="-4" r="3"/></g>';
}

// Two metro cars (46 each), or a tram with a pantograph on each car; the line's tag on the first car.
function transportTrainSvg(mode, color, text, label) {
  var car = (k) => `<g transform="translate(${k * 46} 0)"><path class="body" d="M0 -22 q0 -6 6 -6 h34 q6 0 6 6 v18 h-46z"/>` +
    `<rect x="0" y="-11" width="46" height="4" fill="${color}"/>` +
    [5, 17, 29].map((x) => `<rect class="win" x="${x}" y="-24" width="9" height="9" rx="1.5"/>`).join('') +
    `<g class="wheel"><circle cx="10" cy="-2" r="2.8"/><circle cx="36" cy="-2" r="2.8"/></g>` +
    (mode === 'tram' ? '<path class="pa" d="M20 -28 L26 -34 L20 -38 M15 -38 H27"/>' : '') + '</g>';
  return (mode === 'tram' ? '<g class="panto">' : '<g>') + car(0) + car(1) + '</g>' +
    '<circle class="lamp" cx="91" cy="-18" r="2"/>' +
    `<rect x="2" y="-26" width="12" height="5" rx="1" fill="${color}"/><text class="disc" x="8" y="-22.2" text-anchor="middle" fill="${text}">${label}</text>`;
}

// mode: bus | metro | tram; state: arriving | waiting | empty; board: the display's countdown; status: ontime | late
// | disrupted | none; delay: minutes late (shown on a tag under the display when late).
function transportSceneSvg(mode, state, color, text, line, live, board, status, delay) {
  var label = transportEsc(String(line).slice(0, 3));
  var vehicle = mode === 'bus' ? transportBusSvg(color, label) : transportTrainSvg(mode, color, text, label);
  var at = mode === 'bus' ? 'translate(92 75)' : 'translate(80 80)';
  var windows = Array.from({ length: 26 }, (_, i) => `<rect x="${83 + (i * 17) % 116}" y="${22 + (i * 11) % 46}" width="2" height="2"/>`).join('');
  var wire = mode === 'tram' ? '<g class="catenary"><path d="M60 42H200"/></g>' : '';
  var tag = status === 'late' && delay > 0
    ? `<g class="late"><rect x="1.6" y="-13" width="12" height="6" rx="1.2"/><text x="7.6" y="-8.6" text-anchor="middle">+${transportEsc(String(Math.min(delay, 99)))}'</text></g>`
    : '';
  var sign = status === 'disrupted'
    ? '<g class="alert"><path d="M8 -13.6 l5.6 9.6 h-11.2z"/><text x="8" y="-5.2" text-anchor="middle">!</text></g>'
    : '';
  var waves = live && state !== 'empty'
    ? '<g class="waves" transform="translate(-13 -20)"><circle class="wave" r="5"/><circle class="wave d1" r="5"/><circle class="wave d2" r="5"/></g>'
    : '';
  return '<svg class="scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">' +
    '<g transform="translate(200 80) scale(1.3) translate(-200 -80)">' +
    '<g class="stars"><circle cx="110" cy="8" r=".6"/><circle cx="150" cy="5" r=".6"/><circle class="tw" cx="186" cy="10" r=".6"/></g>' +
    '<g class="far"><rect x="80" y="28" width="16" height="44"/><rect x="98" y="16" width="14" height="56"/><rect x="114" y="34" width="20" height="38"/>' +
    '<rect x="136" y="22" width="14" height="50"/><rect x="152" y="30" width="18" height="42"/><rect x="172" y="18" width="14" height="54"/><rect x="188" y="34" width="14" height="38"/></g>' +
    `<g class="lit">${windows}</g>${wire}<rect class="walk" x="76" y="74" width="124" height="6"/>` +
    `<g transform="translate(186 74)"><rect class="pole" x="-1" y="-28" width="2" height="28"/><rect class="pole" x="-15" y="-28" width="30" height="2.4" rx="1"/>` +
    `${waves}<rect class="board" x="-13" y="-25.6" width="26" height="11" rx="1.5"/><text class="bline" x="-11" y="-18.2" fill="${color}">${label}</text>` +
    `<text class="bmin${state === 'arriving' ? ' blink' : ''}" x="11" y="-18.2" text-anchor="end">${transportEsc(board)}</text>${tag}${sign}</g>` +
    `<g class="veh ${state}"><g transform="${at}">${vehicle}</g></g></g></svg>`;
}

// ── public-transport-card ─────────────────────────────────────────────────────
// A banner (sky, the street or the track, the stop's scene and its vehicle), the next departure with its approach
// bar, tabs (all the stops, then each one) and the following departures, one row per line and destination.
class TransportCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement('public-transport-card-editor');
  }

  static getStubConfig(hass) {
    var found = TransportCard._findEntities(hass);
    return found.length ? { entities: found } : {};
  }

  static _findEntities(hass) {
    if (!hass?.states) return [];
    var found = Object.keys(hass.states).filter((id) => transportIsSensor(id, hass.states[id]));
    // An unavailable sensor (failed update) has no attributes: fall back to the entity registry.
    var entities = hass.entities || {};
    Object.keys(entities).forEach((id) => {
      var e = entities[id];
      if (e.platform === 'public_transport' && e.translation_key === 'next_departure' && hass.states[id] && found.indexOf(id) === -1) found.push(id);
    });
    return found.sort();
  }

  setConfig(config) {
    this._config = Object.assign({}, TRANSPORT_DEFAULTS, config || {});
    this.toggleAttribute?.('hide-title', config?.show_title === false);
    this._open = this._open || {};
    this._lastStates = null;
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Redraw only when a stop sensor or the dark mode (day / night picture) changed; the countdown ticks on its own timer.
    var states = this._entityIds().map((id) => hass.states[id]).concat([!!hass.themes?.darkMode]);
    var changed = !this._lastStates || states.length !== this._lastStates.length || states.some((s, i) => s !== this._lastStates[i]);
    if (changed) {
      this._lastStates = states;
      this._render();
    }
  }

  connectedCallback() {
    this._onOutside = this._onOutside || ((ev) => {
      if (!Object.keys(this._open).some((k) => this._open[k])) return;
      if (ev.composedPath().includes(this) || transportInDialog(ev)) return;
      // Like the other cards: a click outside folds the open sections.
      this._open = {};
      this._render();
    });
    document.addEventListener('click', this._onOutside, true);
    // The countdown follows the clock between two sensor updates.
    if (!this._timer) this._timer = setInterval(() => this._render(), 15000);
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === 'function') {
      this._resize = this._resize || new ResizeObserver((entries) => {
        var w = Math.round(entries[entries.length - 1].contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutside, true);
    clearInterval(this._timer);
    this._timer = null;
    this._resize?.disconnect();
    this._fitWidth = null;
  }

  // The banner's status pill goes right after the title only when the whole title (for the next departure's line: its
  // badge and its whole destination) and the whole label fit there; otherwise it takes a line of its own under the
  // other lines (.titles.below, those kept to one line). When the label does not fit that line either, or the banner
  // has no room for the lines above its ground strip, the pill keeps its dot only (.titles.dot-only, back beside the
  // title when the dot fits there). Measured after render, so that it holds in every language.
  _fitPill() {
    if (typeof getComputedStyle !== 'function') return;
    (this._root?.querySelectorAll?.('.banner .titles') || []).forEach((t) => {
      var pill = t.querySelector('.trow > .hpill');
      t.classList.remove('below', 'dot-only');
      if (!pill?.getClientRects().length) return;
      var row = pill.parentElement;
      var head = row.firstElementChild;
      var text = head?.classList.contains('mline') ? head.querySelector('.dest') : head;
      var fits = () => {
        var title = 0;
        if (head && head !== pill && text && getComputedStyle(head).display !== 'none') {
          var lead = head === text ? 0 : text.getBoundingClientRect().left - head.getBoundingClientRect().left;
          title = lead + transportTextWidth(text) + (parseFloat(getComputedStyle(row).columnGap) || 0);
        }
        return title + pill.getBoundingClientRect().width <= row.getBoundingClientRect().width + 0.5;
      };
      if (fits()) return;
      t.classList.add('below');
      for (var line of t.querySelectorAll(':scope > .stats')) line.title = line.scrollWidth > line.clientWidth ? line.textContent.trim() : '';
      var label = pill.querySelector('.t');
      var banner = t.closest('.banner');
      var tb = t.getBoundingClientRect();
      var bb = banner.getBoundingClientRect();
      var ground = banner.querySelector('.ground') ? parseFloat(getComputedStyle(banner).getPropertyValue('--g')) || 0 : 0;
      var tall = tb.top < bb.top - 0.5 || tb.bottom > bb.bottom - ground + 0.5;
      if (!tall && !(label && label.scrollWidth > label.clientWidth + 0.5)) return;
      t.classList.add('dot-only');
      t.classList.remove('below');
      if (!fits()) t.classList.add('below');
    });
  }

  getCardSize() {
    return 5 + (this._config?.max_departures || 5);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  // Without configured entities, the stop sensors found are kept until one of them disappears.
  _entityIds() {
    var c = this._config || {};
    if (Array.isArray(c.entities) && c.entities.length) return c.entities.map((e) => (typeof e === 'string' ? e : e.entity)).filter(Boolean);
    if (c.entity) return [c.entity];
    var hass = this._hass;
    if (!this._auto || this._auto.some((id) => !hass?.states[id])) this._auto = TransportCard._findEntities(hass);
    return this._auto;
  }

  _t() {
    return TransportI18n[transportLang(this._hass, this._config)];
  }

  _now() {
    return Date.now();
  }

  _stops() {
    return this._entityIds().map((id) => ({ id: id, st: this._hass.states[id] }));
  }

  _ensureShell() {
    if (this._root) return;
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `<style>${TransportCard._styles()}</style><ha-card><div class="body"></div></ha-card>`;
    this._root.querySelector('ha-card').addEventListener('click', this._onClick.bind(this));
    this._root.querySelector('ha-card').addEventListener('keydown', (ev) => {
      if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest?.('[role="button"]')) {
        ev.preventDefault();
        this._onClick(ev);
      }
    });
  }

  _render() {
    if (!this._config || !this._hass) return;
    this._ensureShell();
    var t = this._t();
    var stops = this._stops();
    var body = this._root.querySelector('.body');
    // The whole card is redrawn: the focused control gets the keyboard focus back, without scrolling the page.
    var focused = this._root.activeElement?.getAttribute?.('data-focus');
    body.innerHTML = !stops.length
      ? `<div class="empty">${transportEsc(t.no_entity)}</div>`
      : this._compact() ? this._renderCompact(stops, t) : this._renderFull(stops, t);
    this._root.querySelector('ha-card').classList.toggle('mini', this._compact());
    this._fitPill();
    if (focused) this._root.querySelector(`[data-focus="${CSS?.escape ? CSS.escape(focused) : focused}"]`)?.focus?.({ preventScroll: true });
  }

  // The network's logo (served by the integration) when every stop of the card belongs to the same network.
  _logo(stops) {
    var logos = stops.map((s) => s.st?.attributes?.logo || '');
    return logos.length && logos.every((l) => l && l === logos[0]) ? logos[0] : '';
  }

  // Alerts first (their level), then real time or timetable, from what every stop shows.
  _status(stops, t) {
    var alerts = {};
    var level = 0;
    var departures = [];
    stops.forEach((s) => {
      var a = s.st?.attributes || {};
      (a.alerts || []).forEach((al) => {
        alerts[al.id] = true;
        level = Math.max(level, al.level || 1);
      });
      departures = departures.concat(transportDepartures(a) || []);
    });
    var count = Object.keys(alerts).length;
    if (count && this._config.show_alerts) return { cls: level >= 3 ? 'crit' : 'warn', text: transportFill(t.alerts_count, { n: count }), n: count };
    if (!departures.length) return stops.some((s) => s.st) ? { cls: 'idle', text: t.no_departures_short } : null;
    return departures.some((d) => d.realtime) ? { cls: 'ok live', text: t.realtime } : { cls: 'idle', text: t.timetable };
  }

  // Overridden by the mini card: compact view, and its detail button at the top right.
  _compact() {
    return false;
  }

  _detailButton() {
    return '';
  }

  _valid(a, now) {
    return (transportDepartures(a) || []).filter((d) => !Number.isNaN(transportMinutes(d.departure, now)));
  }

  _usable(s) {
    return !!s.st && s.st.state !== 'unavailable' && !!transportDepartures(s.st.attributes);
  }

  // The departures of the given stops, in time order, each with the mode of its stop.
  _merged(stops, now) {
    var all = [];
    stops.forEach((s) => {
      if (!this._usable(s)) return;
      var mode = transportMode(s.st.attributes.mode);
      this._valid(s.st.attributes, now).forEach((d) => {
        all.push(Object.assign({}, d, { _mode: mode }));
      });
    });
    return all.sort((x, y) => Date.parse(x.departure) - Date.parse(y.departure));
  }

  // Several stops: the "All" tab, then one per stop, named after its mode when each stop has its own.
  _tabs(stops, t) {
    if (stops.length < 2) return [];
    var modes = stops.map((s) => transportMode(s.st?.attributes?.mode));
    var distinct = modes.every((m, i) => modes.indexOf(m) === i);
    return [{ key: 'all', label: t.all }].concat(stops.map((s, i) => ({
      key: s.id,
      mode: modes[i],
      label: distinct ? t[`mode_${modes[i]}`] : s.st?.attributes?.stop_name || s.id,
    })));
  }

  _selected(stops) {
    if (stops.length < 2 || !this._tab || this._tab === 'all') return stops;
    var picked = stops.filter((s) => s.id === this._tab);
    return picked.length ? picked : stops;
  }

  _renderFull(stops, t) {
    var now = this._now();
    var tabs = this._tabs(stops, t);
    var sel = this._selected(stops);
    var deps = this._merged(sel, now);
    var next = deps[0];
    var html = this._renderBanner(sel, next, t, now, false);
    html += this._renderNext(sel, next, t, now);
    var tabKey = sel.length === stops.length ? 'all' : sel[0].id;
    var status = this._status(sel, t);
    var bar = tabs.length
      ? `<div class="tabs" role="tablist">${tabs.map((tab) => `<span class="tab${tab.key === tabKey ? ' active' : ''}" role="tab" tabindex="0" aria-selected="${tab.key === tabKey}" ` +
        `data-action="tab" data-tab="${transportEsc(tab.key)}" data-focus="tab:${transportEsc(tab.key)}">${tab.mode ? transportIcon(tab.mode) : ''}<span>${transportEsc(tab.label)}</span></span>`).join('')}</div>`
      : `<span class="then">${transportEsc(t.following)}</span>`;
    html += `<div class="toolbar">${bar}${status ? `<span class="chip ${status.cls}${status.n ? ' has-alerts' : ''}" title="${transportEsc(status.text)}"><span class="dot"></span>${transportIcon('alert', 'cicon')}<span class="t">${transportEsc(status.text)}</span></span>` : ''}</div>`;
    html += this._notes(sel, t);
    var rest = deps.slice(1);
    html += rest.length
      ? `<div class="departures">${this._groups(rest, Math.max(1, this._config.max_departures), 3).map((g) => this._renderRow(g, t, now)).join('')}</div>`
      : '';
    if (this._config.show_alerts) {
      html += sel.filter((s) => this._usable(s) && (s.st.attributes.alerts || []).length).map((s) => this._renderAlerts(s.id, s.st.attributes, t)).join('');
    }
    return html;
  }

  // Stale data and unavailable stops, named when the card shows several.
  _notes(stops, t) {
    var many = stops.length > 1;
    return stops.map((s) => {
      var name = many ? `${s.st?.attributes?.stop_name || s.id} · ` : '';
      if (!this._usable(s)) return `<div class="note crit">${transportIcon('offline')}<span>${transportEsc(name + (s.st ? t.unavailable : t.no_entity))}</span></div>`;
      return s.st.attributes.stale ? `<div class="note warn">${transportIcon('offline')}<span>${transportEsc(name + t.stale)}</span></div>` : '';
    }).join('');
  }

  // The coming departures of a stop, one row per line and destination with its next times, in the order of the first one.
  _groups(departures, rows, per) {
    var groups = [];
    var byKey = {};
    departures.forEach((d) => {
      var key = `${d._mode || ''}\u0000${d.line_id || d.line}\u0000${d.destination || ''}`;
      var g = byKey[key];
      if (!g) {
        if (groups.length >= rows) return;
        g = byKey[key] = { first: d, deps: [] };
        groups.push(g);
      }
      if (g.deps.length < per) g.deps.push(d);
    });
    return groups;
  }

  // The header's status, for the icon's color and the stop's display: disrupted (a grave alert, stale or unavailable
  // data), late (the next departure runs late), on time, or none (nothing announced).
  // The highest level of the stops' traffic alerts (0 without any, or when they are hidden).
  _alertLevel(stops) {
    var level = 0;
    if (this._config.show_alerts) {
      stops.forEach((s) => {
        (s.st?.attributes?.alerts || []).forEach((al) => {
          level = Math.max(level, al.level || 1);
        });
      });
    }
    return level;
  }

  _headerStatus(stops, next) {
    var level = this._alertLevel(stops);
    var down = !stops.some((s) => this._usable(s));
    if (level >= 2 || down || stops.some((s) => s.st?.attributes?.stale)) return 'disrupted';
    if (!next) return 'none';
    return next.realtime && (Number(next.delay) || 0) >= TRANSPORT_LATE ? 'late' : 'ontime';
  }

  // The stop's display: the vehicle at the stop (▶), the minutes (n'), the hours (nh), or -- with nothing announced.
  _board(next, minutes) {
    if (!next) return '--';
    if (minutes <= TRANSPORT_SOON) return '▶';
    return minutes < 60 ? `${minutes}'` : `${Math.floor(minutes / 60)}h`;
  }

  // The banner: sky, the street or the track (a 10px strip under the whole width), the stop's scene with the vehicle
  // of the next departure, and the text at the left: the stop and its figures (full card) or the next departure (mini).
  _renderBanner(stops, next, t, now, mini) {
    var c = this._config;
    var first = stops.find((s) => s.st?.attributes) || stops[0];
    var mode = next ? next._mode : transportMode(first?.st?.attributes?.mode);
    var minutes = next ? transportMinutes(next.departure, now) : NaN;
    var state = !next ? 'empty' : minutes <= TRANSPORT_SOON ? 'arriving' : 'waiting';
    var status = this._headerStatus(stops, next);
    var illustrated = c.show_scene && c.illustration !== false;
    var scene = illustrated
      ? transportSceneSvg(mode, state, transportColor(next?.color, TRANSPORT_ACCENT), transportColor(next?.text_color, '#ffffff'), next ? next.line : '',
        !!next?.realtime, this._board(next, minutes), status, next ? Number(next.delay) || 0 : 0)
      : '';
    var logo = this._logo(stops);
    var icon = `<div class="logo">${transportIcon(mode)}${logo ? `<span class="net"><img src="${transportEsc(logo)}" alt=""></span>` : ''}</div>`;
    var tools = '';
    if (mini) {
      var chip = this._status(stops, t);
      if (chip?.n) tools += `<span class="chip short ${chip.cls} has-alerts" title="${transportEsc(chip.text)}"><span class="dot"></span>${transportIcon('alert', 'cicon')}<span class="t">${chip.n}</span></span>`;
    } else if (c.show_refresh) {
      tools += `<button class="iconbtn refresh${this._refreshing ? ' spinning' : ''}" data-action="refresh" data-focus="refresh" title="${transportEsc(t.refresh)}" aria-label="${transportEsc(t.refresh)}">${transportIcon('refresh')}</button>`;
    }
    tools += this._detailButton(t);
    // The text keeps clear of the buttons at the top right (24 px each, 4 px apart; the alert chip about 44 px).
    var tw = (tools.match(/<button /g) || []).length * 28 + (tools.includes('class="chip') ? 48 : 0);
    var pill = this._headerPill(stops, next, status, t);
    var text = mini ? this._miniText(next, t, now, pill, status === 'late') : this._bannerText(stops, t, now, pill);
    return `<div class="banner ${mode}${transportIsNight(this._hass, c) ? ' night' : ''}${scene ? '' : ' plain'} st-${status}" style="--tw:${tw + 9}px">` +
      `${scene ? `<div class="ground g-${mode === 'bus' ? 'road' : 'rail'}"></div>` : ''}${scene}<div class="htext">${icon}<div class="titles">${text}</div></div>` +
      `${tools ? `<div class="tools">${tools}</div>` : ''}</div>`;
  }

  // The status pill on the banner's title row, in the colour of the header icon (see _headerStatus): the disruption,
  // the delay of the next departure, real time or timetable only, or no departure.
  _headerPill(stops, next, status, t) {
    var text;
    if (status === 'disrupted') {
      var level = this._alertLevel(stops);
      text = level >= 2 ? t[`level_${Math.min(3, level)}`] : t.offline;
    } else if (status === 'late') text = transportFill(t.late_short, { n: Number(next.delay) || 0 });
    else if (status === 'none') text = t.no_departures_short;
    else text = next.realtime ? t.realtime : t.timetable;
    return `<span class="hpill" title="${transportEsc(text)}"><span class="dot"></span><span class="t">${transportEsc(text)}</span></span>`;
  }

  // The stop's name (or the title) and its status pill, then the number of departures and the share in real time.
  _bannerText(stops, t, now, pill = '') {
    var c = this._config;
    var names = stops.map((s) => s.st?.attributes?.stop_name).filter(Boolean);
    var stopName = names.length && names.every((n) => n === names[0]) ? names[0] : '';
    var deps = this._merged(stops, now);
    var live = deps.filter((d) => d.realtime).length;
    var first = [deps.length ? transportFill(t.departures_count, { n: deps.length }) : t.no_departures_short, c.title ? stopName : stops.length === 1 ? stops[0].st?.attributes?.network : ''];
    var second = this._refreshError || (deps.length ? transportFill(t.realtime_share, { n: Math.round((live * 100) / deps.length) }) : '');
    return `<div class="trow"><div class="name">${transportEsc(c.title || stopName || t.default_title)}</div>${pill}</div>` +
      `<div class="stats">${transportEsc(first.filter(Boolean).join(' · '))}</div>` +
      (second ? `<div class="stats${this._refreshError ? ' error' : ''}">${transportEsc(second)}</div>` : '');
  }

  // Mini card: the line and its destination with the status pill, the countdown with the real-time sign, then the
  // delay (unless the pill already says it) and the times.
  _miniText(next, t, now, pill = '', delayInPill = false) {
    if (!next) return `<div class="trow"><div class="name">${transportEsc(this._config.title || t.default_title)}</div>${pill}</div><div class="stats">${transportEsc(t.no_departures_short)}</div>`;
    var soon = transportMinutes(next.departure, now) <= TRANSPORT_SOON;
    var sign = next.realtime
      ? `<span class="rt ok live" title="${transportEsc(t.realtime)}">${transportIcon('realtime')}</span>`
      : `<span class="rt idle" title="${transportEsc(t.timetable_hint)}">${transportIcon('clock')}</span>`;
    return `<div class="trow"><div class="mline">${this._badge(next)}<span class="dest">${transportEsc(next.destination)}</span></div>${pill}</div>` +
      `<div class="mwhen"><span class="count${soon ? ' soon' : ''}">${transportEsc(this._when(next, t, now))}</span>${sign}</div>` +
      `<div class="stats">${this._delayTimes(next, t, delayInPill)}</div>`;
  }

  // "+2 min 08:07 08:05": the delay, the expected time, the timetable time struck through.
  _delayTimes(d, t, delayInPill = false) {
    var delay = d.realtime ? Number(d.delay) || 0 : 0;
    var html = delay > 0 && delayInPill ? '' : delay > 0 ? `<span class="delay warn">${transportEsc(transportFill(t.late_short, { n: delay }))}</span>`
      : delay < 0 ? `<span class="delay active">${transportEsc(transportFill(t.early_short, { n: -delay }))}</span>` : '';
    html += `<span class="at">${transportEsc(this._clock(d.departure))}</span>`;
    if (delay && d.scheduled && !Number.isNaN(Date.parse(d.scheduled))) html += `<span class="was">${transportEsc(this._clock(d.scheduled))}</span>`;
    return html;
  }

  // The next departure: its line, destination and precision, the countdown and its state, then the approach bar.
  _renderNext(stops, next, t, now) {
    if (!next) {
      var down = stops.every((s) => !this._usable(s));
      return `<div class="next quiet">${transportIcon(down ? 'offline' : 'night')}<span>${transportEsc(down ? t.unavailable : t.no_departures)}</span></div>`;
    }
    var soon = transportMinutes(next.departure, now) <= TRANSPORT_SOON;
    return `<div class="next"><div class="next-row">${this._badge(next, 'big')}` +
      `<div class="next-what"><span class="cap">${transportEsc(t.next_departure)}</span><span class="dest">${transportEsc(next.destination)}</span>` +
      `<span class="next-sub">${this._precision(next, t)}</span></div>` +
      `<div class="next-when"><span class="count${soon ? ' soon' : ''}">${transportEsc(this._when(next, t, now))}</span>${this._pill(next, t, now)}</div></div>` +
      `${this._approach(next, now)}</div>`;
  }

  // The vehicle (a dot in its line color) on its way to the stop: at the stop when the countdown reaches zero.
  _approach(d, now) {
    var minutes = transportMinutes(d.departure, now);
    var share = Math.max(0, Math.min(1, 1 - minutes / TRANSPORT_APPROACH));
    var pos = Math.round(4 + share * 88);
    return `<div class="approach" style="--lc:${transportColor(d.color, TRANSPORT_ACCENT)};--p:${pos}%" aria-hidden="true">` +
      `<span class="fill"></span><span class="vdot${minutes <= TRANSPORT_SOON ? ' soon' : ''}"></span><span class="smark">${transportIcon(d._mode || 'bus')}</span></div>`;
  }

  _badge(d, size) {
    var bg = transportColor(d.color, TRANSPORT_ACCENT);
    var fg = transportColor(d.text_color, '#ffffff');
    var round = d._mode === 'metro' && String(d.line).length <= 2;
    return `<span class="lb${round ? ' round' : ''}${size ? ` ${size}` : ''}" style="--lc:${bg};--lt:${fg}">${transportEsc(d.line)}</span>`;
  }

  // The state of a departure, as a pill: approaching, late or early, real time, or timetable only.
  _pill(d, t, now) {
    var delay = d.realtime ? Number(d.delay) || 0 : 0;
    var p = transportMinutes(d.departure, now) <= TRANSPORT_SOON ? { cls: 'active', text: t.now, title: t.realtime }
      : delay > 0 ? { cls: 'warn', text: transportFill(t.late_short, { n: delay }), title: transportFill(t.late, { n: delay }) }
        : delay < 0 ? { cls: 'active', text: transportFill(t.early_short, { n: -delay }), title: transportFill(t.early, { n: -delay }) }
          : d.realtime ? { cls: 'ok', text: t.realtime, title: t.realtime } : { cls: 'idle', text: t.timetable, title: t.timetable_hint };
    return `<span class="pill ${p.cls}" title="${transportEsc(p.title)}"><span class="dot"></span><span class="t">${transportEsc(p.text)}</span></span>`;
  }

  _when(d, t, now) {
    var minutes = transportMinutes(d.departure, now);
    var clock = this._clock(d.departure);
    if (this._config.time_format === 'absolute' || minutes >= 60) return clock;
    return minutes < 1 ? t.now : transportFill(t.min, { n: minutes });
  }

  // Real time or timetable only, like the * of the stop displays; then the time (and the timetable one it replaces).
  _precision(d, t) {
    var at = this._config.time_format === 'absolute' ? '' : `<span class="at">${transportEsc(this._clock(d.departure))}</span>`;
    if (!d.realtime) return `<span class="prec idle" title="${transportEsc(t.timetable_hint)}">${transportIcon('clock')}${transportEsc(t.timetable)}</span>${at}`;
    // The delay is the pill's; the timetable time it replaces, struck through.
    var was = Number(d.delay) && d.scheduled && !Number.isNaN(Date.parse(d.scheduled)) ? `<span class="was">${transportEsc(this._clock(d.scheduled))}</span>` : '';
    return `<span class="prec ok live">${transportIcon('realtime')}${transportEsc(t.realtime)}</span>${at}${was}`;
  }

  _clock(iso) {
    return new Date(iso).toLocaleTimeString(transportLocale(this._hass, this._config), { hour: '2-digit', minute: '2-digit' });
  }

  // The next times of a row after the first: "then 12, 27 min", or clock times after an hour or in clock mode.
  _then(deps, t, now) {
    if (deps.length < 2) return '';
    var rest = deps.slice(1);
    var clock = this._config.time_format === 'absolute' || rest.some((d) => transportMinutes(d.departure, now) >= 60);
    var list = clock ? rest.map((d) => this._clock(d.departure)).join(', ') : transportFill(t.min, { n: rest.map((d) => transportMinutes(d.departure, now)).join(', ') });
    return transportFill(t.then_times, { list: list });
  }

  _renderRow(g, t, now) {
    var d = g.first;
    var soon = transportMinutes(d.departure, now) <= TRANSPORT_SOON;
    var sub = [this._config.time_format === 'absolute' ? '' : this._clock(d.departure), this._then(g.deps, t, now)].filter(Boolean).join(' · ');
    return `<div class="dep${soon ? ' soon' : ''}"><span class="when">${transportEsc(this._when(d, t, now))}</span>${this._badge(d)}` +
      `<div class="what"><span class="dest">${transportEsc(d.destination)}</span>${sub ? `<span class="sub">${transportEsc(sub)}</span>` : ''}</div>` +
      `${this._pill(d, t, now)}</div>`;
  }

  _renderAlerts(stopId, a, t) {
    var open = !!this._open[stopId];
    var alerts = a.alerts;
    var level = Math.max.apply(null, alerts.map((al) => al.level || 1));
    var cls = level >= 3 ? 'crit' : level >= 2 ? 'warn' : 'active';
    var locale = transportLocale(this._hass, this._config);
    var day = (iso) => new Date(iso).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    var html = `<div class="alerts ${cls}"><div class="section-title toggle" role="button" tabindex="0" aria-expanded="${open}" data-action="alerts" data-stop="${transportEsc(stopId)}" data-focus="alerts:${transportEsc(stopId)}">` +
      `${transportIcon('alert', `alert-icon${level >= 3 ? ' shake' : ' glow'}`)}<span>${transportEsc(t.alerts)}</span><span class="count-pill">${alerts.length}</span>${transportIcon('chevron', 'chevron')}</div>`;
    if (open) {
      html += '<div class="alert-list">' + alerts.map((al) => {
        var lcls = (al.level || 1) >= 3 ? 'crit' : (al.level || 1) >= 2 ? 'warn' : 'active';
        var lines = (al.lines || []).map((name) => `<span class="tag">${transportEsc(name)}</span>`).join('');
        var when = al.end ? transportFill(t.until, { date: day(al.end) }) : al.start ? transportFill(t.since, { date: day(al.start) }) : '';
        return `<div class="alert ${lcls}"><div class="alert-head"><span class="chip ${lcls}"><span class="dot"></span><span class="t">${transportEsc(t[`level_${Math.min(3, Math.max(1, al.level || 1))}`])}</span></span>${lines}</div>` +
          `<div class="alert-title">${transportEsc(al.title)}</div>` +
          (al.description ? `<div class="alert-desc">${transportEsc(al.description)}</div>` : '') +
          `<div class="alert-foot">${when ? `<span>${transportEsc(when)}</span>` : ''}` +
          (/^https?:\/\//.test(al.url || '') ? `<a href="${transportEsc(al.url)}" target="_blank" rel="noreferrer">${transportEsc(t.more)}${transportIcon('link')}</a>` : '') +
          '</div></div>';
      }).join('') + '</div>';
    }
    return `${html}</div>`;
  }

  _onClick(ev) {
    var el = ev.target.closest?.('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    if (action === 'refresh') this._refresh();
    else if (action === 'detail') this._toggleDetail(ev);
    else if (action === 'tab') {
      this._tab = el.getAttribute('data-tab');
      this._render();
    } else if (action === 'alerts') {
      var id = el.getAttribute('data-stop');
      this._open[id] = !this._open[id];
      this._render();
    }
  }

  _refresh() {
    if (this._refreshing) return;
    var entries = {};
    this._stops().forEach((s) => {
      var id = s.st?.attributes?.config_entry_id;
      if (id) entries[id] = true;
    });
    var ids = Object.keys(entries);
    var t = this._t();
    this._refreshing = true;
    this._refreshError = null;
    this._render();
    var calls = ids.length ? ids.map((id) => this._hass.callService('public_transport', 'refresh', { config_entry_id: id })) : [this._hass.callService('public_transport', 'refresh', {})];
    Promise.all(calls).catch((err) => {
      this._refreshError = `${t.refresh_failed} ${String(err?.message || err || '')}`;
    }).finally(() => {
      this._refreshing = false;
      this._render();
    });
  }

  static _styles() {
    return `
  :host { --tp-ok: var(--success-color, #43a047); --tp-warn: var(--warning-color, #ffa600); --tp-crit: var(--error-color, #db4437);
          --tp-idle: var(--disabled-text-color, #9e9e9e); --tp-active: var(--info-color, #039be5); --tp-accent: ${TRANSPORT_ACCENT};
          display: grid; grid-template-columns: minmax(0, 1fr); min-width: 0; }
  /* A preferred width without a minimum: the card keeps a width in auto-sized parents and still shrinks in a 1fr grid. */
  :host::before { content: ""; width: 340px; max-width: 100%; height: 0; }
  :host([mini])::before { width: 260px; }
  ha-card { overflow: hidden; container: tp-card / inline-size; position: relative; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .ok { --c: var(--tp-ok); } .warn { --c: var(--tp-warn); } .crit { --c: var(--tp-crit); } .idle { --c: var(--tp-idle); } .active { --c: var(--tp-active); }
  /* State colors stay on dots, icons and backgrounds; texts are mixed with the text color to read at 4.5:1. */
  .ok, .warn, .crit, .idle, .active { --ink: color-mix(in srgb, var(--c) 40%, var(--primary-text-color, #212121)); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--tp-ok)); flex: none; display: inline-block; }
  .chip, .pill { display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px; border-radius: 12px; font-size: 12px; font-weight: 500; line-height: 18px;
          white-space: nowrap; background: color-mix(in srgb, var(--c, var(--tp-ok)) 15%, transparent); color: var(--ink, var(--c));
          box-sizing: border-box; flex: 0 1 auto; min-width: 0; overflow: hidden; }
  .chip .t, .pill .t { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .chip.live .dot, .pill.active .dot { animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .chip .cicon { display: none; width: 13px; height: 13px; color: var(--c); }
  .chip.has-alerts .dot { display: none; } .chip.has-alerts .cicon { display: block; }
  /* Mini card: the alert sign and the count, or the dot alone. */
  .chip.short.has-alerts .cicon { display: block; }
  .chip.short:not(.has-alerts) { padding: 4px; } .chip.short:not(.has-alerts) .t { display: none; }
  [role="button"]:focus-visible, [role="tab"]:focus-visible, .iconbtn:focus-visible { outline: 2px solid var(--tp-accent); outline-offset: 2px; }

  /* ── Banner (90px): the sky, a 10px strip for the street or the track under the whole width, the scene at the right. ── */
  .banner { --g: 10px; --sw: min(calc((90px - var(--g)) * 2.5), 62%);
            --sky1: #eef5fd; --sky2: #cfe3f7; --ink-h: #10283f; --ink-s: #3d5670;
            --far: #b9cfe4; --lit: #e6f1fb; --lit-o: .9; --walk: #dfe3e8; --body: #f6f8fa; --win: #4a5a6e; --bwin: #dff1fb; --lamp: #fff;
            --si-ontime: #2e8b3a; --si-late: #c77700; --si-disrupted: #d93025; --si-none: #7d8794;
            position: relative; height: 90px; overflow: hidden; color: var(--ink-h);
            background: linear-gradient(115deg, var(--sky1), var(--sky2)); }
  .banner.night { --sky1: #17233a; --sky2: #26385c; --ink-h: #eef3fa; --ink-s: rgba(255,255,255,.8);
                  --far: #2b3b59; --lit: #ffcf6e; --lit-o: .7; --walk: #4b525c; --body: #d8dce2; --win: #ffe9a8; --bwin: #ffe9a8; --lamp: #ffe9a8;
                  --si-ontime: #7fdc8a; --si-late: #f5c062; --si-disrupted: #ff8a80; --si-none: #9aa3ad; }
  .ground { position: absolute; left: 0; right: 0; bottom: 0; height: var(--g); }
  .g-road { background: #858c94; box-shadow: inset 0 1px 0 #6f767d; }
  .g-road::after { content: ""; position: absolute; left: 0; right: 0; top: calc(50% - .8px); height: 1.6px;
                   background: repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 9px, transparent 9px 18px); }
  .banner.night .g-road { background: #2c323b; }
  .g-rail { background: #9aa1a9 repeating-linear-gradient(90deg, #7d6a58 0 3px, transparent 3px 10px); box-shadow: inset 0 2px 0 #6f767d, inset 0 -2px 0 #6f767d; }
  .banner.night .g-rail { background-color: #2c323b; }
  .scene { position: absolute; right: 0; bottom: var(--g); width: var(--sw); height: calc(100% - var(--g)); overflow: visible; }
  .scene .stars { display: none; fill: #fff; opacity: .8; } .banner.night .scene .stars { display: inline; }
  .scene .tw { animation: tp-glow 2.4s ease-in-out infinite alternate; }
  .scene .far rect { fill: var(--far); opacity: .9; } .scene .lit rect { fill: var(--lit); opacity: var(--lit-o); }
  .scene .walk { fill: var(--walk); } .scene .pole { fill: #5f6b7a; } .scene .board { fill: #101418; }
  .scene .bline, .scene .bmin { font: 700 5.4px ui-monospace, monospace; } .scene .bmin { fill: #ffb02e; }
  .banner.st-disrupted .scene .bmin { fill: #ff6b6b; }
  .scene .late rect { fill: #ffb02e; } .scene .late text { font: 700 4.6px ui-monospace, monospace; fill: #1a1d22; }
  .scene .alert path { fill: #e5484d; stroke: #fff; stroke-width: .6; stroke-linejoin: round; } .scene .alert text { font: 700 6px Roboto, sans-serif; fill: #fff; }
  .scene .alert { animation: tp-glow .8s ease-in-out infinite alternate; }
  .scene .catenary path { stroke: #6c757d; stroke-width: .6; fill: none; }
  .scene .body { fill: var(--body); stroke: #9aa3ae; stroke-width: .6; } .scene .win { fill: var(--win); } .scene .bwin { fill: var(--bwin); }
  .scene .wheel circle { fill: #22262b; } .scene .lamp { fill: var(--lamp); }
  .scene .gtext { font: 700 4.4px ui-monospace, monospace; fill: #ffd65a; } .scene .disc { font: 700 4.4px Roboto, sans-serif; }
  .scene .pa { stroke: #4b5560; stroke-width: .8; fill: none; }
  .scene .beam { display: none; fill: #ffe9a8; opacity: .3; } .banner.night .scene .beam { display: inline; }
  .scene .puff circle { fill: rgba(140,150,160,.5); opacity: 0; }
  .scene .blink { animation: tp-blink 1.2s steps(2) infinite; }
  .scene .wave { fill: none; stroke: var(--tp-ok); stroke-width: .8; transform-box: fill-box; transform-origin: center; animation: tp-wave 1.8s ease-out infinite; }
  .scene .wave.d1 { animation-delay: -.6s; } .scene .wave.d2 { animation-delay: -1.2s; }
  .scene .veh.empty { display: none; }
  /* Arriving: the vehicle drives in and stops at the stop (at rest, in stills and with reduced motion: at the stop). */
  .scene .veh.arriving { animation: tp-arrive 4s cubic-bezier(.25,.7,.3,1) infinite; }
  /* Waiting: the vehicle idles at the stop, engine running. */
  .scene .veh.waiting { animation: tp-idle 1.6s ease-in-out infinite; }
  .scene .veh.waiting .puff circle { animation: tp-puff 1.6s ease-out infinite; }
  /* The text, on the sky at the left of the scene: the round icon (its color tells the status) with the network's logo. */
  .htext { position: absolute; left: 14px; top: 0; bottom: var(--g); right: calc(var(--sw) + 4px);
           display: flex; align-items: center; gap: 10px; min-width: 0; }
  .banner.plain .htext { bottom: 0; right: 48px; }
  .logo { position: relative; flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
          color: var(--si-ontime); background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(16,40,63,.1); }
  .banner.night .logo { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.16); }
  .banner.st-late .logo { color: var(--si-late); } .banner.st-disrupted .logo { color: var(--si-disrupted); } .banner.st-none .logo { color: var(--si-none); }
  .logo .icon { width: 24px; height: 24px; }
  /* The network's logo on a white tile at the icon's bottom right, readable by day and by night. */
  .net { position: absolute; right: -6px; bottom: -4px; height: 16px; min-width: 16px; max-width: 30px; padding: 2px 3px; box-sizing: border-box;
         border-radius: 5px; background: #fff; display: grid; place-items: center; box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }
  .net img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
  .titles { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 0; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  :host([hide-title]) .banner:not(.mini) .name { display: none; }
  .stats { display: flex; align-items: center; gap: 6px; font-size: 13px; line-height: 17px; color: var(--ink-s); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .stats.error { color: color-mix(in srgb, var(--tp-crit) 70%, var(--ink-h)); white-space: normal; }
  /* The header buttons (refresh, expand / collapse) on one line in the top right corner: 24 px frosted rounds. */
  .tools { position: absolute; z-index: 2; top: 5px; right: 5px; display: flex; align-items: center; gap: 4px; }
  .iconbtn { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; box-sizing: border-box;
             color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); backdrop-filter: blur(4px); }
  .banner.night .iconbtn { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .iconbtn .icon { width: 16px; height: 16px; }
  .iconbtn:hover { background: rgba(255,255,255,.75); } .banner.night .iconbtn:hover { background: rgba(255,255,255,.22); }
  /* The text may run 16 px over the pale left edge of the skyline, so that a short title keeps its pill beside it. */
  .htext { right: max(calc(var(--sw) - 16px), var(--tw, 0px)); container: tp-head / inline-size; }
  .banner.plain .htext { right: var(--tw, 48px); }
  /* The status pill right after the title, centred on it, when the whole title and the whole label fit there. */
  .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .trow > .name, .trow > .mline { flex: 0 1 auto; min-width: 0; }
  .trow .mline .dest { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  .hpill { flex: none; display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;
           line-height: 16px; white-space: nowrap; box-sizing: border-box; max-width: none; overflow: hidden; --c: var(--si-ontime);
           background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
  .hpill .t { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .hpill .dot { background: var(--c); }
  .banner.night .hpill { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
  .banner.st-late .hpill { --c: var(--si-late); } .banner.st-disrupted .hpill { --c: var(--si-disrupted); } .banner.st-none .hpill { --c: var(--si-none); }
  /* Not enough room beside the whole title for the whole pill (measured by the card, see _fitPill): the pill on its own
     line under the other lines (kept to one line); still no room, or very narrow: its dot only. */
  .titles.below { display: grid; grid-template-columns: minmax(0, 1fr); justify-items: start; }
  .titles.below .trow { display: contents; } .titles.below .trow > .name, .titles.below .trow > .mline { max-width: 100%; }
  .titles.below > :not(.trow) { justify-self: stretch; }
  .titles.below .hpill { order: 9; max-width: 100%; margin-top: 2px; }
  .titles.below > .stats { white-space: nowrap; }
  .titles.dot-only .hpill { padding: 4px; }
  .titles.dot-only .hpill .t { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  @container tp-card (max-width: 200px) { .hpill { padding: 4px; } .hpill .t { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); } }
  .iconbtn.spinning .icon { animation: tp-spin 1s linear infinite; }
  .tools .chip { background: rgba(255,255,255,.75); } .banner.night .tools .chip { background: rgba(10,20,40,.5); color: color-mix(in srgb, var(--c) 45%, #fff); }

  /* ── The next departure, its approach bar. ── */
  .next { padding: 12px 16px 14px; border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.15));
          background: color-mix(in srgb, var(--primary-text-color, #212121) 3%, transparent); }
  .next.quiet { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--secondary-text-color); }
  .next.quiet .icon { color: var(--tp-idle); }
  .next-row { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .next-what { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .cap { font-size: 12px; color: var(--secondary-text-color); }
  .next-what .dest { font-size: 16px; font-weight: 500; line-height: 1.3; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .next-sub, .banner .stats { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12px; color: var(--secondary-text-color); }
  .banner .stats { color: var(--ink-s); flex-wrap: nowrap; }
  .next-when { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .count { font-size: 28px; font-weight: 500; line-height: 1.05; color: var(--primary-text-color); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .count.soon { color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .prec { display: inline-flex; align-items: center; gap: 4px; color: var(--ink); }
  .prec .icon, .rt .icon { width: 14px; height: 14px; color: var(--c); }
  .prec.live .icon, .rt.live .icon { animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .delay { font-weight: 500; color: var(--ink); white-space: nowrap; }
  .was { text-decoration: line-through; white-space: nowrap; opacity: .8; }
  .at { white-space: nowrap; }
  .approach { position: relative; height: 4px; margin: 12px 8px 2px 0; border-radius: 2px; background: color-mix(in srgb, var(--secondary-text-color) 22%, transparent); }
  .approach .fill { position: absolute; left: 0; top: 0; bottom: 0; width: var(--p); border-radius: 2px; background: var(--lc); }
  .approach .vdot { position: absolute; left: var(--p); top: 50%; width: 12px; height: 12px; border-radius: 50%; transform: translate(-50%, -50%);
                    background: var(--lc); box-shadow: 0 0 0 2px var(--card-background-color, #fff); }
  .approach .vdot.soon { animation: tp-glow .9s ease-in-out infinite alternate; }
  .approach .smark { position: absolute; right: -8px; top: 50%; width: 16px; height: 16px; border-radius: 4px; transform: translateY(-50%);
                     display: grid; place-items: center; background: var(--tp-accent); color: #fff; }
  .approach .smark .icon { width: 11px; height: 11px; }
  .lb { display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-width: 32px; height: 24px; padding: 0 6px; flex: none;
        border-radius: 7px; font-size: 13px; font-weight: 700; letter-spacing: .01em; background: var(--lc); color: var(--lt);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); white-space: nowrap; }
  .lb.round { min-width: 24px; width: 24px; padding: 0; border-radius: 50%; text-transform: uppercase; }
  .lb.big { min-width: 40px; height: 36px; font-size: 16px; border-radius: 9px; }
  .lb.big.round { min-width: 36px; width: 36px; border-radius: 50%; }

  /* ── Tabs (several stops) or the "Then" label, the status chip; then the following departures. ── */
  .toolbar { display: flex; align-items: center; gap: 12px; padding: 0 16px; min-height: 42px; border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.15)); }
  .tabs { display: flex; gap: 20px; flex: 1 1 auto; min-width: 0; align-self: stretch; overflow: hidden; }
  .tab { cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 0 0 0; font-size: 14px; font-weight: 500; color: var(--secondary-text-color);
         border-bottom: 3px solid transparent; margin-bottom: -1px; white-space: nowrap; user-select: none; }
  .tab .icon { width: 16px; height: 16px; }
  .tab.active { color: var(--primary-text-color); border-bottom-color: var(--tp-accent); }
  .tab:hover { color: var(--primary-text-color); }
  .then { flex: 1; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
  .departures { display: flex; flex-direction: column; padding: 0 16px 4px; }
  /* Each row owns its columns (no subgrid, a WebKit hover bug): countdown, line badge, destination, state. */
  .dep { display: grid; grid-template-columns: 4em 40px minmax(0, 1fr) auto; align-items: center; column-gap: 10px; padding: 9px 0;
         border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.15)); font-size: 14px; }
  .dep:last-child { border-bottom: none; }
  .dep .lb { justify-self: start; }
  .when { font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--primary-text-color); white-space: nowrap; }
  .dep.soon .when { color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .what { display: flex; flex-direction: column; min-width: 0; }
  .dest { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--primary-text-color); }
  .what .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
  .empty { padding: 16px; color: var(--secondary-text-color); font-size: 13px; }
  .note { display: flex; align-items: center; gap: 6px; margin: 8px 16px 0; font-size: 12px; color: var(--ink); }
  .note .icon { width: 16px; height: 16px; color: var(--c); }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); min-width: 0; }
  .section-title > span:not(.count-pill) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .alerts { display: flex; flex-direction: column; gap: 8px; margin: 8px 12px 12px; padding: 8px 10px; border-radius: 12px; background: color-mix(in srgb, var(--c) 9%, transparent); }
  .alerts + .alerts { margin-top: 0; }
  .alerts > .section-title { color: var(--ink); }
  .alerts .alert-icon { color: var(--c); transform-box: fill-box; transform-origin: center; }
  .alert-icon.glow { animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .alert-icon.shake { animation: tp-shake .6s ease-in-out infinite; }
  .count-pill { flex: none; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; display: inline-grid; place-items: center;
                font-size: 11px; letter-spacing: 0; background: color-mix(in srgb, var(--c) 20%, transparent); color: var(--ink); }
  .alert-list { display: flex; flex-direction: column; gap: 10px; }
  .alert { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .alert + .alert { padding-top: 10px; border-top: 1px solid var(--divider-color, rgba(127,127,127,.15)); }
  .alert-head { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
  .alert-head .chip { font-size: 11px; padding: 0 8px; }
  .tag { display: inline-flex; align-items: center; font-size: 11px; font-weight: 500; padding: 1px 6px; border-radius: 8px;
         background: var(--secondary-background-color, rgba(127,127,127,.12)); color: var(--primary-text-color); white-space: nowrap; }
  .alert-title { font-size: 13px; font-weight: 500; color: var(--primary-text-color); overflow-wrap: anywhere; }
  .alert-desc { font-size: 12px; color: var(--secondary-text-color); overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .alert-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11px; color: var(--secondary-text-color); }
  .alert-foot a { display: inline-flex; align-items: center; gap: 3px; color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); text-decoration: none; }
  .alert-foot a .icon { width: 12px; height: 12px; }
  .departures:last-child, .toolbar:last-child { border-bottom: none; }
  .body > :last-child.departures { padding-bottom: 8px; }

  /* ── Mini card: the banner tells the next departure; the approach bar under it. ── */
  ha-card.mini .banner { --sw: min(calc((90px - var(--g)) * 2.5), 52%); }
  ha-card.mini .htext { left: 12px; }
  .mline { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 14px; font-weight: 500; }
  .mline .dest { color: inherit; }
  .mline .lb { height: 22px; min-width: 28px; font-size: 12px; } .mline .lb.round { min-width: 22px; width: 22px; }
  .mwhen { display: flex; align-items: center; gap: 6px; }
  .mwhen .count { font-size: 20px; color: inherit; }
  .mwhen .count.soon { color: inherit; }
  .banner .rt { display: inline-flex; } .banner .rt.ok .icon { color: #2e8b3a; } .banner.night .rt.ok .icon { color: #7fdc8a; }
  .banner .delay.warn { color: #9a6200; } .banner.night .delay.warn { color: #f5c062; }
  .banner .delay.active { color: #0b6aa8; } .banner.night .delay.active { color: #8fd0ff; }
  .mini-bar { padding: 2px 18px 12px 12px; }
  .mini-bar .approach { margin-top: 10px; }
  .mini-notes .note { margin: 0 12px 10px; }
  /* Narrow cards: the icon gives way, then the scene. */
  @container tp-card (max-width: 360px) { .logo { display: none; } .dep { grid-template-columns: 3.4em 34px minmax(0, 1fr) auto; column-gap: 8px; } .pill .t { max-width: 7em; } }
  @container tp-card (max-width: 250px) { .scene { display: none; } .htext { right: var(--tw, 44px); } }
  @keyframes tp-arrive { 0% { transform: translateX(-90px); opacity: 0; } 15% { opacity: 1; } 60%, 100% { transform: translateX(0); } }
  @keyframes tp-idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-.5px); } }
  @keyframes tp-blink { 50% { opacity: .2; } }
  @keyframes tp-puff { 0% { opacity: .9; transform: translate(0, 0) scale(.6); } 100% { opacity: 0; transform: translate(-6px, -4px) scale(1.6); } }
  @keyframes tp-wave { from { transform: scale(.55); opacity: .9; } to { transform: scale(1.35); opacity: 0; } }
  @keyframes tp-glow { from { opacity: .45; } to { opacity: 1; } }
  @keyframes tp-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
  @keyframes tp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`;
  }
}

// ── public-transport-mini-card ────────────────────────────────────────────────
// The next departure of all the stops in the banner, with its approach bar. Its detail button (top right) switches
// to the full card and back; a click outside the card folds it back to the compact view.
class TransportMiniCard extends TransportCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onOutsideMini = (ev) => {
      if (this._zoomed && !ev.composedPath().includes(this) && !transportInDialog(ev)) this._setZoom(false);
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutsideMini, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutsideMini, true);
  }

  setConfig(config) {
    // The host attribute behind the mini card's styles; never set in the constructor.
    this.setAttribute?.('mini', '');
    super.setConfig(config);
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 3;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 4, rows: 'auto' };
  }

  _compact() {
    return !this._zoomed;
  }

  _detailButton(t) {
    var label = this._zoomed ? t.show_compact : t.show_full;
    return `<button class="iconbtn zoom" data-action="detail" data-focus="detail" title="${transportEsc(label)}" aria-label="${transportEsc(label)}">${transportIcon(this._zoomed ? 'collapse' : 'expand')}</button>`;
  }

  _toggleDetail(ev) {
    ev.stopPropagation();
    this._setZoom(!this._zoomed);
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    if (!zoomed) this._open = {};
    this._render();
  }

  // The banner for the next departure of all the stops, its approach bar, and what keeps a stop from showing.
  _renderCompact(stops, t) {
    var now = this._now();
    var next = this._merged(stops, now)[0];
    var html = this._renderBanner(stops, next, t, now, true).replace('class="banner ', 'class="banner mini ');
    if (next) html += `<div class="mini-bar">${this._approach(next, now)}</div>`;
    var notes = this._notes(stops, t);
    return html + (notes ? `<div class="mini-notes">${notes}</div>` : '');
  }
}

// ── public-transport-card-editor ──────────────────────────────────────────────
var TRANSPORT_LANGUAGES = [
  ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['sr', 'Српски'], ['sr-Latn', 'Srpski (latinica)'],
  ['it', 'Italiano'], ['nl', 'Nederlands'], ['pt', 'Português (Portugal)'], ['pl', 'Polski'], ['ro', 'Română'], ['da', 'Dansk'],
  ['sv', 'Svenska'], ['bg', 'Български'], ['ru', 'Русский'], ['uk', 'Українська'], ['hu', 'Magyar'], ['sk', 'Slovenčina'],
  ['cs', 'Čeština'], ['sl', 'Slovenščina'], ['lv', 'Latviešu'], ['el', 'Ελληνικά'],
];

function transportEditorSchema(t) {
  return [
    { name: 'entities', selector: { entity: { multiple: true, filter: { domain: 'sensor', integration: 'public_transport', device_class: 'timestamp' } } } },
    { name: 'title', selector: { text: {} } },
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'show_title', selector: { boolean: {} } },
        { name: 'show_scene', selector: { boolean: {} } },
        { name: 'show_alerts', selector: { boolean: {} } },
        { name: 'show_refresh', selector: { boolean: {} } },
      ],
    },
    {
      name: 'illustration_theme',
      selector: { select: { mode: 'dropdown', options: ['auto', 'day', 'night'].map((v) => ({ value: v, label: t[`theme_${v}`] })) } },
    },
    { name: 'max_departures', selector: { number: { min: 1, max: 20, mode: 'box' } } },
    {
      name: 'time_format',
      selector: { select: { mode: 'dropdown', options: [{ value: 'relative', label: t.time_relative }, { value: 'absolute', label: t.time_absolute }] } },
    },
    {
      name: 'language',
      selector: { select: { mode: 'dropdown', options: [{ value: '', label: t.lang_auto }].concat(TRANSPORT_LANGUAGES.map((l) => ({ value: l[0], label: l[1] }))) } },
    },
  ];
}

class TransportCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    else this._render();
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', this._valueChanged.bind(this));
      this.appendChild(this._form);
    }
    // The labels follow the language picked in the editor: rebuilt only when it changes.
    var lang = transportLang(this._hass, this._config);
    if (lang !== this._lang) {
      this._lang = lang;
      var t = TransportI18n[lang].editor;
      this._form.schema = transportEditorSchema(t);
      this._form.computeLabel = (field) => t[field.name] || field.name;
    }
    this._form.hass = this._hass;
    var data = Object.assign({}, TRANSPORT_DEFAULTS, this._config);
    if (!data.entities && data.entity) data.entities = [data.entity];
    this._form.data = data;
  }

  _valueChanged(ev) {
    var value = Object.assign({}, ev.detail.value);
    // Keep the YAML short: drop options left at their default.
    Object.keys(TRANSPORT_DEFAULTS).forEach((key) => {
      if (value[key] === TRANSPORT_DEFAULTS[key]) delete value[key];
    });
    delete value.entity;
    ['title', 'language'].forEach((key) => {
      if (!value[key]) delete value[key];
    });
    if (!value.entities?.length) delete value.entities;
    this._config = value;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('public-transport-card-editor')) {
  customElements.define('public-transport-card-editor', TransportCardEditor);
}

var transportDefined = false;
if (!customElements.get('public-transport-card')) {
  customElements.define('public-transport-card', TransportCard);
  transportDefined = true;
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'public-transport-card',
    name: 'Public transport',
    description: 'Next departures at your stops: illustrated banner, approach bar, line colors, countdown, real time and traffic alerts.',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-public-transport',
  });
}
if (!customElements.get('public-transport-mini-card')) {
  customElements.define('public-transport-mini-card', TransportMiniCard);
  transportDefined = true;
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'public-transport-mini-card',
    name: 'Public transport mini',
    description: 'The next departure of your stops in an illustrated banner, with a button to show the full card.',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-public-transport',
  });
}
if (transportDefined) {
  console.info(`%c PUBLIC-TRANSPORT-CARD %c v${TRANSPORT_CARD_VERSION} `, 'color:#fff;background:#00897b;font-weight:700', 'color:#00897b;background:#fff');
}
