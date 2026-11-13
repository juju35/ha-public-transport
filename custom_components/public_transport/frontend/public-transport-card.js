var TRANSPORT_CARD_VERSION = '1.0.0';

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
    stops: 'Stops: {n}',
    editor: {
      entities: 'Stop sensors',
      title: 'Title',
      show_title: 'Show the title',
      show_scene: 'Show the animated scene',
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
    stops: 'Arrêts : {n}',
    editor: {
      entities: 'Capteurs d\'arrêt',
      title: 'Titre',
      show_title: 'Afficher le titre',
      show_scene: 'Afficher la scène animée',
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
    stops: 'Haltestellen: {n}',
    editor: {
      entities: 'Haltestellensensoren',
      title: 'Titel',
      show_title: 'Titel anzeigen',
      show_scene: 'Animierte Szene anzeigen',
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
    stops: 'Paradas: {n}',
    editor: {
      entities: 'Sensores de parada',
      title: 'Título',
      show_title: 'Mostrar el título',
      show_scene: 'Mostrar la escena animada',
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
    stops: 'Fermate: {n}',
    editor: {
      entities: 'Sensori di fermata',
      title: 'Titolo',
      show_title: 'Mostra il titolo',
      show_scene: 'Mostra la scena animata',
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
    stops: 'Haltes: {n}',
    editor: {
      entities: 'Haltesensoren',
      title: 'Titel',
      show_title: 'Titel tonen',
      show_scene: 'Geanimeerde scène tonen',
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
    stops: 'Paragens: {n}',
    editor: {
      entities: 'Sensores de paragem',
      title: 'Título',
      show_title: 'Mostrar o título',
      show_scene: 'Mostrar a cena animada',
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
    stops: 'Przystanki: {n}',
    editor: {
      entities: 'Czujniki przystanków',
      title: 'Tytuł',
      show_title: 'Pokaż tytuł',
      show_scene: 'Pokaż animowaną scenę',
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
    stops: 'Станице: {n}',
    editor: {
      entities: 'Сензори станица',
      title: 'Наслов',
      show_title: 'Прикажи наслов',
      show_scene: 'Прикажи анимирану сцену',
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
    stops: 'Stanice: {n}',
    editor: {
      entities: 'Senzori stanica',
      title: 'Naslov',
      show_title: 'Prikaži naslov',
      show_scene: 'Prikaži animiranu scenu',
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
    stops: 'Stații: {n}',
    editor: {
      entities: 'Senzori de stație',
      title: 'Titlu',
      show_title: 'Afișați titlul',
      show_scene: 'Afișați scena animată',
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
    stops: 'Stoppesteder: {n}',
    editor: {
      entities: 'Stoppestedssensorer',
      title: 'Titel',
      show_title: 'Vis titlen',
      show_scene: 'Vis den animerede scene',
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
    stops: 'Hållplatser: {n}',
    editor: {
      entities: 'Hållplatssensorer',
      title: 'Titel',
      show_title: 'Visa titeln',
      show_scene: 'Visa den animerade scenen',
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
    stops: 'Спирки: {n}',
    editor: {
      entities: 'Сензори на спирки',
      title: 'Заглавие',
      show_title: 'Покажи заглавието',
      show_scene: 'Покажи анимираната сцена',
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
    stops: 'Остановки: {n}',
    editor: {
      entities: 'Датчики остановок',
      title: 'Заголовок',
      show_title: 'Показывать заголовок',
      show_scene: 'Показывать анимированную сцену',
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
    stops: 'Зупинки: {n}',
    editor: {
      entities: 'Датчики зупинок',
      title: 'Заголовок',
      show_title: 'Показувати заголовок',
      show_scene: 'Показувати анімовану сцену',
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
    stops: 'Megállók: {n}',
    editor: {
      entities: 'Megálló-érzékelők',
      title: 'Cím',
      show_title: 'Cím megjelenítése',
      show_scene: 'Animált jelenet megjelenítése',
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
    stops: 'Zastávky: {n}',
    editor: {
      entities: 'Snímače zastávok',
      title: 'Názov',
      show_title: 'Zobraziť názov',
      show_scene: 'Zobraziť animovanú scénu',
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
    stops: 'Zastávky: {n}',
    editor: {
      entities: 'Senzory zastávek',
      title: 'Název',
      show_title: 'Zobrazit název',
      show_scene: 'Zobrazit animovanou scénu',
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
    stops: 'Postajališča: {n}',
    editor: {
      entities: 'Senzorji postajališč',
      title: 'Naslov',
      show_title: 'Prikaži naslov',
      show_scene: 'Prikaži animirano sceno',
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
    stops: 'Pieturas: {n}',
    editor: {
      entities: 'Pieturu sensori',
      title: 'Virsraksts',
      show_title: 'Rādīt virsrakstu',
      show_scene: 'Rādīt animēto ainu',
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
    stops: 'Στάσεις: {n}',
    editor: {
      entities: 'Αισθητήρες στάσεων',
      title: 'Τίτλος',
      show_title: 'Εμφάνιση τίτλου',
      show_scene: 'Εμφάνιση κινούμενης σκηνής',
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

// ── public-transport-card ─────────────────────────────────────────────────────
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
    var states = this._entityIds().map((id) => hass.states[id]);
    // Redraw only when one of the stop sensors changed (the countdown ticks on its own timer).
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
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutside, true);
    clearInterval(this._timer);
    this._timer = null;
  }

  getCardSize() {
    return 2 + this._entityIds().length * (1 + (this._config?.max_departures || 5));
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
    this._root.innerHTML = `<style>${TransportCard._styles()}</style><ha-card><div class="header"></div><div class="body"></div></ha-card>`;
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
    this._renderHeader(t, stops);
    var body = this._root.querySelector('.body');
    if (!stops.length) {
      body.innerHTML = `<div class="empty">${transportEsc(t.no_entity)}</div>`;
      return;
    }
    body.innerHTML = this._compact() ? this._renderCompact(stops, t) : this._renderFull(stops, t);
    var card = this._root.querySelector('ha-card');
    card.classList.toggle('mini', this._compact());
  }

  // The header is rebuilt only when its buttons or its language change, so its focus survives the updates.
  _renderHeader(t, stops) {
    var header = this._root.querySelector('.header');
    var c = this._config;
    var compact = this._compact();
    var logo = this._logo(stops);
    var key = [c.show_refresh, compact, transportLang(this._hass, c), stops.length > 0, logo].join('|');
    if (this._headerKey !== key || !header.querySelector('.name')) {
      this._headerKey = key;
      header.innerHTML =
        (logo
          ? `<div class="badge logo"><img src="${transportEsc(logo)}" alt=""></div>`
          : `<div class="badge" style="--c:${TRANSPORT_ACCENT}">${transportIcon('header')}</div>`) +
        '<div class="titles"><div class="name"></div><div class="sub" hidden></div></div>' +
        '<span class="chip" hidden><span class="dot"></span><span class="t"></span></span>' +
        (c.show_refresh && stops.length && !compact
          ? `<button class="btn round refresh" data-action="refresh" title="${transportEsc(t.refresh)}" aria-label="${transportEsc(t.refresh)}">${transportIcon('refresh')}</button>`
          : '') +
        this._detailButton(t);
    }
    header.querySelector('.name').textContent = c.title || t.default_title;
    var sub = header.querySelector('.sub');
    var subText = this._refreshError || this._subtitle(stops, t);
    sub.hidden = !subText;
    sub.textContent = subText || '';
    sub.classList.toggle('error', !!this._refreshError);
    var chip = header.querySelector('.chip');
    var status = this._status(stops, t);
    chip.hidden = !status;
    if (status) {
      chip.className = `chip ${status.cls}`;
      chip.title = status.text;
      chip.setAttribute('aria-label', status.text);
      chip.querySelector('.t').textContent = status.text;
    }
    var refresh = header.querySelector('.refresh');
    if (refresh) refresh.classList.toggle('spinning', !!this._refreshing);
  }

  // The network's logo (served by the integration) when every stop of the card belongs to the same network.
  _logo(stops) {
    var logos = stops.map((s) => s.st?.attributes?.logo || '');
    return logos.length && logos.every((l) => l && l === logos[0]) ? logos[0] : '';
  }

  _subtitle(stops, t) {
    if (stops.length === 1) {
      var a = stops[0].st?.attributes || {};
      return [a.stop_name, a.network].filter(Boolean).join(' · ');
    }
    return stops.length > 1 ? transportFill(t.stops, { n: stops.length }) : '';
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
    if (count && this._config.show_alerts) return { cls: level >= 3 ? 'crit' : 'warn', text: transportFill(t.alerts_count, { n: count }) };
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

  _renderFull(stops, t) {
    var many = stops.length > 1;
    return `<div class="content">${stops.map((s, i) => this._renderStop(s, i, many, t)).join('')}</div>`;
  }

  _renderStop(stop, index, many, t) {
    var st = stop.st;
    var a = st?.attributes || {};
    var html = '<section class="stop">';
    if (many) {
      html += `<div class="section-title">${transportIcon(a.mode in TRANSPORT_ICONS ? a.mode : 'marker')}<span>${transportEsc(a.stop_name || stop.id)}</span></div>`;
    }
    var all = transportDepartures(a);
    if (!st || st.state === 'unavailable' || !all) {
      return `${html}<div class="empty">${transportEsc(st ? t.unavailable : t.no_entity)}</div></section>`;
    }
    var now = this._now();
    var departures = all.filter((d) => !Number.isNaN(transportMinutes(d.departure, now))).slice(0, Math.max(1, this._config.max_departures));
    if (this._config.show_scene && index === 0) html += this._renderScene(a, departures[0], t, now);
    if (a.stale) html += `<div class="note warn">${transportIcon('offline')}<span>${transportEsc(t.stale)}</span></div>`;
    html += departures.length
      ? `<div class="departures">${departures.map((d) => this._renderDeparture(d, a.mode, t, now)).join('')}</div>`
      : `<div class="empty quiet">${transportIcon('night')}<span>${transportEsc(t.no_departures)}</span></div>`;
    if (this._config.show_alerts && (a.alerts || []).length) html += this._renderAlerts(stop.id, a, t);
    return `${html}</section>`;
  }

  // The animated picture of the next departure: the vehicle in its line color drives in when it is close,
  // idles at the edge of the scene otherwise; waves rise from the stop sign while the time is real time.
  _renderScene(a, next, t, now) {
    var mode = a.mode === 'metro' || a.mode === 'tram' ? a.mode : 'bus';
    var minutes = next ? transportMinutes(next.departure, now) : NaN;
    var state = !next ? 'empty' : minutes <= TRANSPORT_SOON ? 'arriving' : 'waiting';
    var color = transportColor(next?.color, TRANSPORT_ACCENT);
    var text = transportColor(next?.text_color, '#ffffff');
    var svg = TransportCard._vehicle(mode, state, color, text, next ? next.line : '', !!next?.realtime);
    var info = next
      ? `<div class="hero-info"><div class="hero-line">${this._badge(next, mode)}<span class="dest">${transportEsc(next.destination)}</span></div>` +
        `<div class="count ${state === 'arriving' ? 'soon' : ''}">${transportEsc(this._when(next, t, now))}</div>` +
        `<div class="hero-sub">${this._precision(next, t)}</div></div>`
      : `<div class="hero-info"><div class="count idle">—</div><div class="hero-sub">${transportEsc(t.no_departures)}</div></div>`;
    return `<div class="hero"><div class="scene ${state}" data-scene="${state}">${svg}</div>${info}</div>`;
  }

  static _vehicle(mode, state, color, text, line, live) {
    var cls = state === 'empty' ? 'veh gone' : `veh ${state}`;
    var label = transportEsc(String(line).slice(0, 4));
    var rail = mode === 'bus'
      ? '<rect class="ground" x="0" y="55" width="168" height="2" rx="1"/><g class="dashes"><rect x="6" y="60" width="14" height="2" rx="1"/><rect x="34" y="60" width="14" height="2" rx="1"/><rect x="62" y="60" width="14" height="2" rx="1"/><rect x="90" y="60" width="14" height="2" rx="1"/></g>'
      : '<rect class="ground" x="0" y="55" width="168" height="2" rx="1"/><rect class="ground" x="0" y="60" width="168" height="2" rx="1"/>' +
        '<g class="sleepers"><rect x="10" y="57" width="3" height="3"/><rect x="34" y="57" width="3" height="3"/><rect x="58" y="57" width="3" height="3"/><rect x="82" y="57" width="3" height="3"/><rect x="106" y="57" width="3" height="3"/><rect x="130" y="57" width="3" height="3"/><rect x="154" y="57" width="3" height="3"/></g>';
    var body = mode === 'bus'
      ? `<rect x="8" y="22" width="92" height="30" rx="7" fill="${color}"/>` +
        '<rect class="glass" x="14" y="27" width="16" height="11" rx="2"/><rect class="glass" x="33" y="27" width="16" height="11" rx="2"/><rect class="glass" x="52" y="27" width="16" height="11" rx="2"/>' +
        '<path class="glass" d="M78 27h12a4 4 0 0 1 4 4v9h-16z"/><rect class="door" x="70" y="27" width="6" height="22" rx="1"/>' +
        `<rect x="14" y="41" width="22" height="8" rx="2" fill="${text}" opacity=".9"/><text x="25" y="47.6" text-anchor="middle" fill="${color}">${label}</text>` +
        '<circle class="lamp" cx="97" cy="46" r="1.8"/>' +
        '<g class="wheel"><circle cx="28" cy="53" r="5.5"/><circle class="hub" cx="28" cy="53" r="2"/><rect class="spoke" x="27.4" y="48.5" width="1.2" height="3"/></g>' +
        '<g class="wheel"><circle cx="80" cy="53" r="5.5"/><circle class="hub" cx="80" cy="53" r="2"/><rect class="spoke" x="79.4" y="48.5" width="1.2" height="3"/></g>' +
        '<g class="puff"><circle cx="5" cy="49" r="2.6"/></g>'
      : `<path d="M6 24h80c9 0 16 7 18 15l2 9a4 4 0 0 1-4 4H6z" fill="${color}"/>` +
        '<rect class="glass" x="12" y="29" width="18" height="10" rx="2"/><rect class="glass" x="44" y="29" width="18" height="10" rx="2"/><path class="glass" d="M76 29h10c5 0 9 4 10 9l.3 1H76z"/>' +
        '<rect class="door" x="33" y="28" width="8" height="21" rx="1"/><rect class="door" x="65" y="28" width="8" height="21" rx="1"/>' +
        `<rect x="12" y="42" width="18" height="7" rx="2" fill="${text}" opacity=".9"/><text x="21" y="47.8" text-anchor="middle" fill="${color}">${label}</text>` +
        '<circle class="lamp" cx="100" cy="47" r="1.8"/><rect class="bogie" x="14" y="52" width="18" height="3" rx="1.5"/><rect class="bogie" x="70" y="52" width="18" height="3" rx="1.5"/>';
    var sign = `<g class="sign"><rect class="pole" x="141" y="16" width="2.4" height="40" rx="1"/><rect x="132" y="6" width="20" height="14" rx="4" fill="${TRANSPORT_ACCENT}"/>` +
      `<path transform="translate(136.5 7.5) scale(.46)" fill="#fff" d="${TRANSPORT_ICONS[mode]}"/></g>`;
    var waves = live && state !== 'empty'
      ? '<g class="waves"><circle class="wave" cx="142" cy="13" r="12"/><circle class="wave d1" cx="142" cy="13" r="12"/><circle class="wave d2" cx="142" cy="13" r="12"/></g>'
      : '';
    return `<svg viewBox="0 0 168 66" role="img" aria-hidden="true">${rail}${waves}${sign}<g class="${cls}">${body}</g></svg>`;
  }

  _badge(d, mode) {
    var bg = transportColor(d.color, TRANSPORT_ACCENT);
    var fg = transportColor(d.text_color, '#ffffff');
    var round = mode === 'metro' && String(d.line).length <= 2;
    return `<span class="lb${round ? ' round' : ''}" style="--lc:${bg};--lt:${fg}">${transportEsc(d.line)}</span>`;
  }

  _when(d, t, now) {
    var minutes = transportMinutes(d.departure, now);
    var clock = new Date(d.departure).toLocaleTimeString(transportLocale(this._hass, this._config), { hour: '2-digit', minute: '2-digit' });
    if (this._config.time_format === 'absolute' || minutes >= 60) return clock;
    return minutes < 1 ? t.now : transportFill(t.min, { n: minutes });
  }

  // Real time (and its delay to the timetable) or timetable only, like the * of the stop displays.
  _precision(d, t) {
    if (!d.realtime) return `<span class="prec idle" title="${transportEsc(t.timetable_hint)}">${transportIcon('clock')}${transportEsc(t.timetable)}</span>`;
    var delay = Number(d.delay) || 0;
    var late = delay > 0 ? `<span class="delay warn">${transportEsc(transportFill(t.late, { n: delay }))}</span>` : '';
    var early = delay < 0 ? `<span class="delay active">${transportEsc(transportFill(t.early, { n: -delay }))}</span>` : '';
    return `<span class="prec ok live">${transportIcon('realtime')}${transportEsc(t.realtime)}</span>${late}${early}`;
  }

  _renderDeparture(d, mode, t, now) {
    var minutes = transportMinutes(d.departure, now);
    var soon = minutes <= TRANSPORT_SOON;
    var icon = d.realtime
      ? `<span class="rt ok live" title="${transportEsc(t.realtime)}">${transportIcon('realtime')}</span>`
      : `<span class="rt idle" title="${transportEsc(t.timetable_hint)}">${transportIcon('clock')}</span>`;
    var delay = Number(d.delay) || 0;
    var sub = delay > 0 ? `<span class="delay warn">${transportEsc(transportFill(t.late, { n: delay }))}</span>` : '';
    return `<div class="dep${soon ? ' soon' : ''}">${this._badge(d, mode)}` +
      `<div class="what"><span class="dest">${transportEsc(d.destination)}</span>${sub}</div>` +
      `${icon}<span class="when">${transportEsc(this._when(d, t, now))}</span></div>`;
  }

  _renderAlerts(stopId, a, t) {
    var open = !!this._open[stopId];
    var alerts = a.alerts;
    var level = Math.max.apply(null, alerts.map((al) => al.level || 1));
    var cls = level >= 3 ? 'crit' : level >= 2 ? 'warn' : 'active';
    var locale = transportLocale(this._hass, this._config);
    var day = (iso) => new Date(iso).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    var html = `<div class="alerts ${cls}"><div class="section-title toggle" role="button" tabindex="0" aria-expanded="${open}" data-action="alerts" data-stop="${transportEsc(stopId)}">` +
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
    else if (action === 'alerts') {
      var id = el.getAttribute('data-stop');
      this._open[id] = !this._open[id];
      this._render();
      // innerHTML replaced the toggle: give the keyboard focus back without scrolling the page.
      this._root.querySelector(`[data-action="alerts"][data-stop="${CSS?.escape ? CSS.escape(id) : id}"]`)?.focus?.({ preventScroll: true });
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
  ha-card { overflow: hidden; container-type: inline-size; position: relative; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .ok { --c: var(--tp-ok); } .warn { --c: var(--tp-warn); } .crit { --c: var(--tp-crit); } .idle { --c: var(--tp-idle); } .active { --c: var(--tp-active); }
  /* State colors stay on dots, icons and backgrounds; texts are mixed with the text color to read at 4.5:1. */
  .ok, .warn, .crit, .idle, .active { --ink: color-mix(in srgb, var(--c) 40%, var(--primary-text-color, #212121)); }
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  .badge { width: 40px; height: 40px; border-radius: 50%; flex: none; display: grid; place-items: center;
           background: color-mix(in srgb, var(--c) 16%, transparent); color: var(--c); }
  .badge .icon { width: 24px; height: 24px; }
  /* Brand logos keep their colors on a light plate, readable in dark themes too. */
  .badge.logo { width: auto; min-width: 40px; max-width: 96px; padding: 0 8px; box-sizing: border-box; border-radius: 10px;
                background: #fff; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(0, 0, 0, .12)); }
  .badge.logo img { max-width: 80px; max-height: 32px; object-fit: contain; display: block; }
  .titles { flex: 1 1 0; min-width: 5ch; }
  :host([hide-title]) .titles > .name { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; line-height: 1.2; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub.error { color: color-mix(in srgb, var(--tp-crit) 40%, var(--primary-text-color, #212121)); }
  .sub[hidden], .chip[hidden] { display: none; }
  /* With a sub-line, the chip sits on the name line: lifted by half the sub-line (12px × 1.2). */
  .header:has(.sub:not([hidden])) > .chip { margin-bottom: 14.4px; }
  .header:has(.sub:not([hidden])) > .btn, .header:has(.sub:not([hidden])) > .zoom { align-self: flex-start; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--tp-ok)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c, var(--tp-ok)) 15%, transparent); color: var(--ink, var(--c));
          box-sizing: border-box; flex: 0 1 auto; min-width: 0; overflow: hidden; }
  .chip .t { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .chip.live .dot { animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; font: inherit; font-size: 13px;
         font-weight: 500; padding: 6px 12px; border-radius: 18px; background: var(--secondary-background-color, rgba(127,127,127,.12));
         color: var(--primary-text-color); min-width: 0; flex: none; }
  .btn:hover { background: color-mix(in srgb, var(--tp-accent) 12%, var(--secondary-background-color, rgba(127,127,127,.12))); }
  .btn .icon { width: 18px; height: 18px; color: var(--tp-accent); }
  .btn.round { width: 32px; height: 32px; padding: 0; border-radius: 50%; }
  .btn.spinning .icon { animation: tp-spin 1s linear infinite; }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px -4px 0; border-radius: 50%; align-self: flex-start;
          display: grid; place-items: center; color: var(--secondary-text-color); }
  .zoom .icon { width: 16px; height: 16px; }
  .zoom:hover { background: color-mix(in srgb, var(--tp-idle) 16%, transparent); color: var(--primary-text-color); }
  [role="button"]:focus-visible, .btn:focus-visible, .zoom:focus-visible { outline: 2px solid var(--tp-accent); outline-offset: 2px; }
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 14px; }
  .stop { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); min-width: 0; }
  .section-title > span:not(.count-pill) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .hero { display: flex; gap: 12px; align-items: center; min-width: 0; }
  .scene { flex: none; width: 150px; height: 59px; color: var(--secondary-text-color); }
  .scene svg { width: 100%; height: 100%; overflow: visible; }
  .scene .ground, .scene .dashes rect, .scene .sleepers rect { fill: color-mix(in srgb, var(--secondary-text-color) 45%, transparent); }
  .scene .pole { fill: var(--secondary-text-color); }
  .scene .glass { fill: color-mix(in srgb, #ffffff 82%, var(--card-background-color, #fff)); opacity: .92; }
  .scene .door { fill: rgba(0,0,0,.18); }
  .scene text { font: 700 7px Roboto, "Segoe UI", sans-serif; }
  .scene .wheel > circle:first-child { fill: #37474f; } .scene .hub { fill: #b0bec5; } .scene .spoke { fill: #b0bec5; }
  .scene .bogie { fill: #37474f; }
  .scene .lamp { fill: #ffd54f; }
  .scene .puff circle { fill: color-mix(in srgb, var(--secondary-text-color) 40%, transparent); opacity: 0; }
  .scene .wave { fill: none; stroke: var(--tp-ok); stroke-width: 1.4; transform-box: fill-box; transform-origin: center; animation: tp-wave 1.8s ease-out infinite; }
  .scene .wave.d1 { animation-delay: -.6s; } .scene .wave.d2 { animation-delay: -1.2s; }
  .scene .veh.gone { display: none; }
  /* At rest (stills, reduced motion) an arriving vehicle stands at the stop. */
  .scene .veh.arriving { transform: translateX(22px); }
  /* Arriving: the vehicle drives in from the left and stops at the sign, its wheels turning until it stops. */
  .scene .veh.arriving { animation: tp-arrive 3.2s cubic-bezier(.25,.7,.3,1) infinite; }
  .scene .veh.arriving .wheel { transform-box: fill-box; transform-origin: center; animation: tp-roll 3.2s cubic-bezier(.25,.7,.3,1) infinite; }
  .scene .veh.arriving .lamp { animation: tp-glow .4s ease-in-out infinite alternate; }
  .scene.arriving .dashes { animation: tp-road 3.2s cubic-bezier(.25,.7,.3,1) infinite; }
  /* Waiting: the vehicle idles away from the sign, engine running. */
  .scene .veh.waiting { animation: tp-idle 1.6s ease-in-out infinite; }
  .scene .veh.waiting .puff circle { animation: tp-puff 1.6s ease-out infinite; }
  .hero-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .hero-line { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .hero-line .dest { font-size: 13px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .count { font-size: 26px; font-weight: 400; line-height: 1.15; color: var(--primary-text-color); font-variant-numeric: tabular-nums; }
  .count.soon { color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .count.idle { color: var(--secondary-text-color); }
  .hero-sub { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; color: var(--secondary-text-color); min-width: 0; }
  .prec { display: inline-flex; align-items: center; gap: 4px; color: var(--ink); }
  .prec .icon { width: 14px; height: 14px; color: var(--c); }
  .prec.live .icon, .rt.live .icon { animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .delay { font-size: 12px; font-weight: 500; color: var(--ink); white-space: nowrap; }
  .lb { display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-width: 30px; height: 22px; padding: 0 6px; flex: none;
        border-radius: 6px; font-size: 12px; font-weight: 700; letter-spacing: .01em; background: var(--lc); color: var(--lt);
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); white-space: nowrap; }
  .lb.round { min-width: 22px; width: 22px; padding: 0; border-radius: 50%; text-transform: uppercase; }
  .departures { display: flex; flex-direction: column; }
  .dep { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 10px; padding: 6px 2px; font-size: 13px;
         border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.15)); }
  .dep:last-child { border-bottom: none; }
  .dep .what { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
  .dep .dest { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--primary-text-color); }
  .rt { display: inline-flex; color: var(--c); }
  .rt .icon { width: 15px; height: 15px; }
  .when { min-width: 44px; text-align: right; font-weight: 500; font-variant-numeric: tabular-nums; color: var(--primary-text-color); white-space: nowrap; }
  .dep.soon .when { color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .empty { padding: 12px 4px; color: var(--secondary-text-color); font-size: 13px; }
  .header + .body > .empty { padding: 12px 16px 16px; }
  .empty.quiet { display: flex; align-items: center; gap: 8px; padding: 6px 2px; }
  .empty.quiet .icon { color: var(--tp-idle); }
  .note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink); }
  .note .icon { width: 16px; height: 16px; color: var(--c); }
  .alerts { display: flex; flex-direction: column; gap: 8px; padding: 8px 10px; border-radius: 12px; background: color-mix(in srgb, var(--c) 9%, transparent); }
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
  .tag { display: inline-flex; align-items: center; font-size: 11px; font-weight: 500; padding: 1px 6px; border-radius: 8px;
         background: var(--secondary-background-color, rgba(127,127,127,.12)); color: var(--primary-text-color); white-space: nowrap; }
  .alert-title { font-size: 13px; font-weight: 500; color: var(--primary-text-color); overflow-wrap: anywhere; }
  .alert-desc { font-size: 12px; color: var(--secondary-text-color); overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .alert-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 11px; color: var(--secondary-text-color); }
  .alert-foot a { display: inline-flex; align-items: center; gap: 3px; color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); text-decoration: none; }
  .alert-foot a .icon { width: 12px; height: 12px; }
  /* Mini card: one line per stop, its next departures side by side. */
  ha-card.mini { padding-bottom: 12px; }
  .compact { padding: 10px 12px 0; display: flex; flex-direction: column; gap: 8px; }
  .crow { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .crow .cname { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; color: var(--secondary-text-color); min-width: 0; }
  .crow .cname span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .crow .cname .icon { width: 14px; height: 14px; }
  .crow .cname .alert-mark { color: var(--tp-warn); }
  .cdeps { display: flex; gap: 6px; flex-wrap: wrap; }
  .cdep { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 3px; border-radius: 14px; background: var(--secondary-background-color, rgba(127,127,127,.1)); }
  .cdep .when { min-width: 0; font-size: 13px; }
  .cdep.soon .when { color: color-mix(in srgb, var(--tp-accent) 55%, var(--primary-text-color, #212121)); animation: tp-glow 1.2s ease-in-out infinite alternate; }
  .cdep .rt .icon { width: 12px; height: 12px; }
  /* Narrow cards: the scene shrinks, then goes above the countdown; the chip keeps only its dot. */
  @container (max-width: 320px) { .scene { width: 112px; height: 44px; } .count { font-size: 22px; } }
  @container (max-width: 240px) {
    .header { gap: 6px; padding: 10px 8px 0; }
    .header .chip { padding: 4px; flex: none; } .header .chip .t { display: none; }
    .content { padding: 8px 8px 12px; }
    .hero { flex-direction: column; align-items: stretch; } .scene { align-self: center; }
    .dep { gap: 6px; }
  }
  @keyframes tp-arrive { 0% { transform: translateX(-118px); opacity: 0; } 12% { opacity: 1; } 68%, 100% { transform: translateX(22px); opacity: 1; } }
  @keyframes tp-roll { 0% { transform: rotate(0deg); } 68%, 100% { transform: rotate(900deg); } }
  @keyframes tp-road { 0% { transform: translateX(0); } 68%, 100% { transform: translateX(28px); } }
  @keyframes tp-idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-.8px); } }
  @keyframes tp-puff { 0% { opacity: .9; transform: translate(0, 0) scale(.6); } 100% { opacity: 0; transform: translate(-8px, -6px) scale(1.6); } }
  @keyframes tp-wave { from { transform: scale(.55); opacity: .9; } to { transform: scale(1.35); opacity: 0; } }
  @keyframes tp-glow { from { opacity: .45; } to { opacity: 1; } }
  @keyframes tp-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
  @keyframes tp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } .scene .veh.arriving { transform: translateX(22px); } }
`;
  }
}

// ── public-transport-mini-card ────────────────────────────────────────────────
// The next departures of each stop on one line. Its detail button (top right) switches to the full card and back;
// a click outside the card folds it back to the compact view.
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
    return this._zoomed ? super.getCardSize() : 1 + this._entityIds().length;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 4, rows: 'auto' };
  }

  _compact() {
    return !this._zoomed;
  }

  _detailButton(t) {
    var label = this._zoomed ? t.show_compact : t.show_full;
    return `<button class="zoom" data-action="detail" title="${transportEsc(label)}" aria-label="${transportEsc(label)}">${transportIcon(this._zoomed ? 'collapse' : 'expand')}</button>`;
  }

  _toggleDetail(ev) {
    ev.stopPropagation();
    this._setZoom(!this._zoomed);
    // Keyboard use (no click count) keeps the focus on the button, without scrolling the page.
    if (!ev.detail) this._root.querySelector('.zoom')?.focus?.({ preventScroll: true });
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    if (!zoomed) this._open = {};
    this._render();
  }

  _renderCompact(stops, t) {
    var now = this._now();
    var many = stops.length > 1;
    return '<div class="compact">' + stops.map((s) => {
      var a = s.st?.attributes || {};
      var alerts = this._config.show_alerts && (a.alerts || []).length;
      var name = many || alerts
        ? `<div class="cname">${many ? transportIcon(a.mode in TRANSPORT_ICONS ? a.mode : 'marker') : ''}<span>${transportEsc(many ? a.stop_name || s.id : t.alerts)}</span>${alerts ? transportIcon('alert', 'alert-mark') : ''}</div>`
        : '';
      var all = transportDepartures(a);
      if (!s.st || s.st.state === 'unavailable' || !all) return `<div class="crow">${name}<div class="empty">${transportEsc(s.st ? t.unavailable : t.no_entity)}</div></div>`;
      var deps = all.filter((d) => !Number.isNaN(transportMinutes(d.departure, now))).slice(0, 3);
      var items = deps.length
        ? deps.map((d) => {
            var soon = transportMinutes(d.departure, now) <= TRANSPORT_SOON;
            var rt = d.realtime ? `<span class="rt ok live">${transportIcon('realtime')}</span>` : '';
            return `<span class="cdep${soon ? ' soon' : ''}" title="${transportEsc(d.destination)}">${this._badge(d, a.mode)}<span class="when">${transportEsc(this._when(d, t, now))}</span>${rt}</span>`;
          }).join('')
        : `<span class="empty quiet">${transportEsc(t.no_departures_short)}</span>`;
      return `<div class="crow">${name}<div class="cdeps">${items}</div></div>`;
    }).join('') + '</div>';
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
    description: 'Next departures at your stops: line colors, countdown, real time and traffic alerts.',
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
    description: 'The next departures of each stop on one line, with a button to show the full card.',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-public-transport',
  });
}
if (transportDefined) {
  console.info(`%c PUBLIC-TRANSPORT-CARD %c v${TRANSPORT_CARD_VERSION} `, 'color:#fff;background:#00897b;font-weight:700', 'color:#00897b;background:#fff');
}
