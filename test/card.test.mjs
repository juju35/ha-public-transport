// Unit tests for the card logic: the card file is evaluated with stubs, no browser needed.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../custom_components/public_transport/frontend/public-transport-card.js', import.meta.url), 'utf8');
const defined = {};
const context = {
  HTMLElement: class {},
  customElements: { get: (name) => defined[name], define: (name, cls) => (defined[name] = cls) },
  window: {},
  navigator: { language: 'en' },
  document: { addEventListener() {}, removeEventListener() {} },
  CSS: { escape: (s) => s },
  setInterval: () => 1,
  clearInterval() {},
  console: { info() {}, log: console.log },
};
vm.createContext(context);
vm.runInContext(
  `${source}\nthis.tp = { transportEsc, transportLang, transportLocale, transportMinutes, transportColor, transportFill, transportDepartures, TransportCard, TransportMiniCard, TransportI18n, transportEditorSchema, TRANSPORT_DEFAULTS };`,
  context,
);
const { transportEsc, transportLang, transportLocale, transportMinutes, transportColor, transportFill, transportDepartures, TransportCard, TransportMiniCard, TransportI18n, transportEditorSchema } = context.tp;

const NOW = Date.parse('2026-11-13T08:00:00Z');
const at = (min) => new Date(NOW + min * 60000).toISOString();
const dep = (line, min, extra = {}) => ({ line_id: line, line, color: '#e30613', text_color: '#ffffff', destination: `To ${line}`, departure: at(min), realtime: true, delay: 0, ...extra });
const stopState = (extra = {}, attrs = {}) => ({
  state: at(3),
  attributes: { config_entry_id: 'e1', stop_name: 'Central', network: 'STAR', mode: 'bus', departures: [dep('C4', 3), dep('11', 9, { realtime: false, delay: null })], alerts: [], ...attrs },
  ...extra,
});

// A card with a fake root: the render methods write into these elements.
function makeCard(cls = TransportCard, config = {}, states = { 'sensor.central_next_departure': stopState() }) {
  const card = Object.create(cls.prototype);
  card._config = { ...context.tp.TRANSPORT_DEFAULTS, ...config };
  card._hass = { states, language: 'en', locale: { language: 'en' }, callService: () => Promise.resolve() };
  card._open = {};
  card._now = () => NOW;
  card._zoomed = false;
  return card;
}

test('transportEsc escapes HTML in text and attributes', () => {
  assert.equal(transportEsc('<b a="1">\'&'), '&lt;b a=&quot;1&quot;&gt;&#39;&amp;');
  assert.equal(transportEsc(null), '');
});

test('line colors are used only when they are #rrggbb', () => {
  assert.equal(transportColor('#3e9d44', 'x'), '#3e9d44');
  assert.equal(transportColor('red;background:url(x)', 'x'), 'x');
  assert.equal(transportColor(undefined, '#fff'), '#fff');
});

test('transportMinutes counts whole minutes and never goes below zero', () => {
  assert.equal(transportMinutes(at(3.9), NOW), 3);
  assert.equal(transportMinutes(at(-1), NOW), 0);
  assert.ok(Number.isNaN(transportMinutes('nope', NOW)));
  assert.equal(transportFill('{n} min', { n: 4 }), '4 min');
});

test('stop sensors give departures, line sensors next_departures', () => {
  assert.equal(transportDepartures({ departures: [1] }).length, 1);
  assert.equal(transportDepartures({ next_departures: [1, 2] }).length, 2);
  assert.equal(transportDepartures({}), null);
});

test('language follows Home Assistant, the option wins, unknown falls back to English', () => {
  assert.equal(transportLang({ locale: { language: 'fr-FR' } }), 'fr');
  assert.equal(transportLang({ locale: { language: 'sr-Latn' } }), 'sr-Latn');
  assert.equal(transportLang({ locale: { language: 'pt-BR' } }), 'pt');
  assert.equal(transportLang({ locale: { language: 'ja' } }), 'en');
  assert.equal(transportLang({ language: 'fr' }, { language: 'de' }), 'de');
  assert.equal(transportLocale({ language: 'pt' }), 'pt-PT');
});

const CARD_LANGS = ['fr', 'de', 'es', 'sr', 'sr-Latn', 'it', 'nl', 'pt', 'pl', 'ro', 'da', 'sv', 'bg', 'ru', 'uk', 'hu', 'sk', 'cs', 'sl', 'lv', 'el'];
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, String(v)]]));

test('every card language has exactly the English keys, placeholders and no empty text', () => {
  const en = Object.fromEntries(flat(TransportI18n.en));
  const holders = (s) => (s.match(/\{\w+\}/g) || []).sort();
  assert.deepEqual(Object.keys(TransportI18n).sort(), ['en', ...CARD_LANGS].sort());
  for (const lang of CARD_LANGS) {
    const entries = flat(TransportI18n[lang]);
    assert.deepEqual(entries.map(([k]) => k).sort(), Object.keys(en).sort(), lang);
    for (const [key, value] of entries) {
      assert.ok(value.trim(), `${lang} ${key}`);
      assert.deepEqual(holders(value), holders(en[key]), `${lang} ${key}`);
    }
  }
});

test('Serbian stays in one script', () => {
  for (const [key, value] of flat(TransportI18n.sr)) {
    assert.doesNotMatch(value.replace(/Public Transport|entities|\{\w+\}/g, ''), /[A-Za-z]/, key);
  }
  for (const [key, value] of flat(TransportI18n['sr-Latn'])) assert.doesNotMatch(value, /[Ѐ-ӿ]/, key);
});

test('the editor offers every language, the auto choice first', () => {
  const schema = transportEditorSchema(TransportI18n.en.editor);
  const language = schema.find((f) => f.name === 'language');
  const values = JSON.parse(JSON.stringify(language.selector.select.options.map((o) => o.value)));
  assert.deepEqual(values, ['', 'en', ...CARD_LANGS]);
  const entities = schema.find((f) => f.name === 'entities');
  assert.equal(entities.selector.entity.filter.integration, 'public_transport');
});

test('getStubConfig picks the stop sensors only', () => {
  const hass = {
    states: {
      'sensor.central_next_departure': stopState(),
      'sensor.central_line_c4': { state: at(3), attributes: { config_entry_id: 'e1', next_departures: [] } },
      'sensor.other': { state: '1', attributes: {} },
    },
  };
  assert.deepEqual(JSON.parse(JSON.stringify(TransportCard.getStubConfig(hass))), { entities: ['sensor.central_next_departure'] });
  assert.deepEqual(JSON.parse(JSON.stringify(TransportCard.getStubConfig({ states: {} }))), {});
});

test('an unavailable stop sensor is found through the entity registry', () => {
  const hass = {
    states: { 'sensor.x_next_departure': { state: 'unavailable', attributes: {} } },
    entities: { 'sensor.x_next_departure': { platform: 'public_transport', translation_key: 'next_departure' } },
  };
  assert.deepEqual([...TransportCard._findEntities(hass)], ['sensor.x_next_departure']);
});

test('countdown: now, minutes, then clock time after an hour or with time_format absolute', () => {
  const card = makeCard();
  const t = TransportI18n.en;
  assert.equal(card._when(dep('C4', 0.5), t, NOW), 'Now');
  assert.equal(card._when(dep('C4', 7), t, NOW), '7 min');
  assert.match(card._when(dep('C4', 75), t, NOW), /\d{2}:\d{2}/);
  const clock = makeCard(TransportCard, { time_format: 'absolute' });
  assert.match(clock._when(dep('C4', 7), t, NOW), /\d{2}:\d{2}/);
});

test('a stop shows the scene, its departures with line badges and real-time marks', () => {
  const card = makeCard();
  const html = card._renderFull(card._stops(), TransportI18n.en);
  assert.match(html, /class="scene waiting"/);
  assert.equal((html.match(/class="dep[ "]/g) || []).length, 2);
  assert.match(html, /class="lb" style="--lc:#e30613;--lt:#ffffff">C4</);
  assert.match(html, /class="rt ok live"/);
  assert.match(html, /class="rt idle"/);
  // A single stop has no section title of its own (its name is the header's sub-line).
  assert.doesNotMatch(html, /section-title"/);
});

test('the scene drives the vehicle in when the next departure is close, with waves for real time', () => {
  const states = { 'sensor.a': stopState({}, { departures: [dep('C4', 1)] }) };
  const html = makeCard(TransportCard, {}, states)._renderFull([{ id: 'sensor.a', st: states['sensor.a'] }], TransportI18n.en);
  assert.match(html, /class="scene arriving"/);
  assert.match(html, /class="veh arriving"/);
  assert.match(html, /class="waves"/);
  assert.match(html, /class="count soon"/);
  assert.match(html, /class="dep soon"/);
});

test('a metro stop draws a train on rails and round line badges', () => {
  const states = { 'sensor.m': stopState({}, { mode: 'metro', departures: [dep('a', 4)] }) };
  const html = makeCard(TransportCard, {}, states)._renderFull([{ id: 'sensor.m', st: states['sensor.m'] }], TransportI18n.en);
  assert.match(html, /class="sleepers"/);
  assert.match(html, /class="lb round"/);
});

test('no departure shows the quiet message and an empty scene', () => {
  const states = { 'sensor.a': stopState({}, { departures: [] }) };
  const html = makeCard(TransportCard, {}, states)._renderFull([{ id: 'sensor.a', st: states['sensor.a'] }], TransportI18n.en);
  assert.match(html, /class="scene empty"/);
  assert.match(html, /No departure announced for now/);
});

test('show_scene false hides the scene, max_departures limits the rows', () => {
  const card = makeCard(TransportCard, { show_scene: false, max_departures: 1 });
  const html = card._renderFull(card._stops(), TransportI18n.en);
  assert.doesNotMatch(html, /class="scene/);
  assert.equal((html.match(/class="dep[ "]/g) || []).length, 1);
});

test('a late departure shows its delay', () => {
  const states = { 'sensor.a': stopState({}, { departures: [dep('C4', 8, { delay: 3 })] }) };
  const html = makeCard(TransportCard, {}, states)._renderFull([{ id: 'sensor.a', st: states['sensor.a'] }], TransportI18n.en);
  assert.match(html, /class="delay warn">\+3 min late/);
});

test('stale data and an unavailable sensor are said', () => {
  const states = { 'sensor.a': stopState({}, { stale: true }), 'sensor.b': { state: 'unavailable', attributes: {} } };
  const card = makeCard(TransportCard, { entities: ['sensor.a', 'sensor.b'] }, states);
  const html = card._renderFull(card._stops(), TransportI18n.en);
  assert.match(html, /Network unreachable/);
  assert.match(html, /Departures are unavailable/);
  // Several stops: each has its section title.
  assert.match(html, /section-title"/);
});

test('alerts: a folded section with a chevron, opened on click, with level, lines and link', () => {
  const alerts = [{ id: 'P1', title: 'Works', description: 'Moved', level: 3, lines: ['C4'], end: at(60 * 24), url: 'https://www.star.fr/x' }];
  const states = { 'sensor.a': stopState({}, { alerts }) };
  const card = makeCard(TransportCard, {}, states);
  let html = card._renderFull(card._stops(), TransportI18n.en);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /alert-icon shake/);
  assert.doesNotMatch(html, /alert-title/);
  card._open['sensor.a'] = true;
  html = card._renderFull(card._stops(), TransportI18n.en);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /alert-title">Works/);
  assert.match(html, /class="tag">C4/);
  assert.match(html, /Major disruption/);
  assert.match(html, /href="https:\/\/www.star.fr\/x"/);
  const off = makeCard(TransportCard, { show_alerts: false }, states);
  assert.doesNotMatch(off._renderFull(off._stops(), TransportI18n.en), /class="alerts/);
});

test('an alert link that is not http(s) is not rendered', () => {
  const alerts = [{ id: 'P1', title: 'X', level: 1, lines: [], url: 'javascript:alert(1)' }];
  const states = { 'sensor.a': stopState({}, { alerts }) };
  const card = makeCard(TransportCard, {}, states);
  card._open['sensor.a'] = true;
  assert.doesNotMatch(card._renderFull(card._stops(), TransportI18n.en), /javascript:/);
});

test('header status: alerts first, then real time, timetable, no departure', () => {
  const t = TransportI18n.en;
  const card = makeCard();
  assert.deepEqual({ ...card._status(card._stops(), t) }, { cls: 'ok live', text: 'Real time' });
  const timetable = makeCard(TransportCard, {}, { 'sensor.a': stopState({}, { departures: [dep('11', 4, { realtime: false })] }) });
  assert.equal(timetable._status(timetable._stops(), t).text, 'Timetable');
  const alerts = makeCard(TransportCard, {}, { 'sensor.a': stopState({}, { alerts: [{ id: 'a', level: 2 }, { id: 'b', level: 1 }] }) });
  assert.deepEqual({ ...alerts._status(alerts._stops(), t) }, { cls: 'warn', text: 'Alerts: 2' });
  const none = makeCard(TransportCard, {}, { 'sensor.a': stopState({}, { departures: [] }) });
  assert.equal(none._status(none._stops(), t).text, 'No departure');
});

test('texts from the network are escaped', () => {
  const states = { 'sensor.a': stopState({}, { departures: [dep('<b>', 4, { destination: '<img onerror=x>' })] }) };
  const html = makeCard(TransportCard, {}, states)._renderFull([{ id: 'sensor.a', st: states['sensor.a'] }], TransportI18n.en);
  assert.doesNotMatch(html, /<img onerror/);
  assert.doesNotMatch(html, /<b>/);
});

test('the mini card is compact: the next three departures of each stop, with a detail button', () => {
  const states = { 'sensor.a': stopState({}, { departures: [dep('C4', 1), dep('11', 5), dep('C4', 9), dep('11', 14)] }) };
  const card = makeCard(TransportMiniCard, {}, states);
  assert.equal(card._compact(), true);
  const html = card._renderCompact(card._stops(), TransportI18n.en);
  assert.equal((html.match(/class="cdep[ "]/g) || []).length, 3);
  assert.match(html, /class="cdep soon"/);
  assert.match(card._detailButton(TransportI18n.en), /data-action="detail"/);
  card._zoomed = true;
  assert.equal(card._compact(), false);
  assert.match(card._detailButton(TransportI18n.en), /Back to the compact view/);
});

test('the refresh action targets the entries of the shown stops', async () => {
  const calls = [];
  const card = makeCard();
  card._hass.callService = (domain, service, data) => calls.push([domain, service, data]) && Promise.resolve();
  card._render = () => {};
  card._refresh();
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [['public_transport', 'refresh', { config_entry_id: 'e1' }]]);
  assert.equal(card._refreshing, false);
});

test('styles: animations stop with prefers-reduced-motion, no filled button, 40 px header badge', () => {
  const css = TransportCard._styles();
  for (const name of ['tp-arrive', 'tp-roll', 'tp-idle', 'tp-puff', 'tp-wave', 'tp-glow', 'tp-shake', 'tp-spin']) {
    assert.match(css, new RegExp(`@keyframes ${name} `), name);
  }
  assert.match(css, /prefers-reduced-motion: reduce\) \{ \* \{ animation: none !important/);
  assert.match(css, /\.badge \{ width: 40px; height: 40px; border-radius: 50%/);
  assert.doesNotMatch(css, /\.btn[^{]*\{[^}]*background: var\(--tp-accent\)/);
});

test('both cards and the editor are registered for the card picker', () => {
  assert.ok(defined['public-transport-card']);
  assert.ok(defined['public-transport-mini-card']);
  assert.ok(defined['public-transport-card-editor']);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.customCards.map((c) => c.type))), ['public-transport-card', 'public-transport-mini-card']);
});

test('the network logo replaces the header icon when every stop shares it', () => {
  const logo = '/public_transport_static/logos/star.svg';
  const one = makeCard(TransportCard, {}, { 'sensor.a': stopState({}, { logo }), 'sensor.b': stopState({}, { logo }) });
  assert.equal(one._logo(one._stops()), logo);
  const mixed = makeCard(TransportCard, {}, { 'sensor.a': stopState({}, { logo }), 'sensor.b': stopState() });
  assert.equal(mixed._logo(mixed._stops()), '');
});
