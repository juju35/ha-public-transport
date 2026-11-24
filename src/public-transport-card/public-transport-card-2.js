// ── public-transport-card ─────────────────────────────────────────────────────
// A banner (sky, the street or the track, the stop's scene and its vehicle), the next departure with its approach
// bar, tabs (all the stops, then each one) and the following departures, one row per line and destination.
// Shadow DOM patching: a redraw updates the nodes already on the page (text, attributes, classes) instead of replacing
// them, so that a state update never re-creates the pictures (SVG scenes, logos) nor restarts their animations, and the
// card keeps its height (a re-created card is laid out again, which can move the dashboard under the reader's eyes).
// An open <dialog> keeps its `open` state: it is driven by showModal() / close().
import { TRANSPORT_ACCENT } from "./header-icon.js";
import { TRANSPORT_DEFAULTS, TRANSPORT_SOON, transportColor, transportDepartures, transportEsc, transportFill, transportIcon, transportInDialog, transportIsSensor, transportLang, transportLocale, transportMinutes, transportTextWidth, transportWatchOutside } from "./i18n-helpers.js";
import { TRANSPORT_APPROACH, TRANSPORT_LATE, transportIsNight, transportMode, transportSceneSvg } from "./banner-s-illustration.js";
import { TransportI18n } from "./i18n/transporti18n.js";

export function transportMorphAttrs(cur, next) {
  for (var a of Array.from(cur.attributes)) {
    if (!next.hasAttribute(a.name) && !(a.name === 'open' && cur.localName === 'dialog')) cur.removeAttribute(a.name);
  }
  for (var b of Array.from(next.attributes)) {
    if (cur.getAttribute(b.name) === b.value) continue;
    if (b.namespaceURI) cur.setAttributeNS(b.namespaceURI, b.name, b.value);
    else cur.setAttribute(b.name, b.value);
  }
}

// A Home Assistant element given no content (<ha-icon>…) draws itself: what it adds to its own node is not ours to
// remove. It is kept as long as the attributes the HTML gives it do not change, and replaced when they do.
export function transportMorphOwnDrawn(o, n) {
  if (!n.localName.includes('-') || n.firstChild) return false;
  var key = Array.from(n.attributes, (a) => `${a.name}=${a.value}`).join('\n');
  if (o.__morphKey === undefined && Array.from(n.attributes).every((a) => o.getAttribute(a.name) === a.value)) o.__morphKey = key;
  if (o.__morphKey !== key) {
    n.__morphKey = key;
    o.parentNode.replaceChild(n, o);
  }
  return true;
}

export function transportMorphChildren(cur, next) {
  var old = Array.from(cur.childNodes);
  var fresh = Array.from(next.childNodes);
  fresh.forEach((n, i) => {
    var o = old[i];
    var ref = cur.childNodes[i] || null;
    if (!o || o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) {
      cur.insertBefore(n, ref);
      return;
    }
    if (o !== ref) cur.insertBefore(o, ref);
    if (n.nodeType !== 1) {
      if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
    } else if (!transportMorphOwnDrawn(o, n)) {
      transportMorphAttrs(o, n);
      transportMorphChildren(o, n);
    }
  });
  while (cur.childNodes.length > fresh.length) cur.removeChild(cur.lastChild);
}

// Gives `root` (a shadow root or an element) the content of `html`, patching what is already there (a plain
// innerHTML where there is no DOM to patch, as in the unit tests' stubs).
export function transportMorph(root, html) {
  var tpl = root.childNodes && typeof document !== 'undefined' && document.createElement?.('template');
  if (!tpl?.content) {
    root.innerHTML = html;
    return;
  }
  tpl.innerHTML = html;
  transportMorphChildren(root, tpl.content);
}

export class TransportCard extends HTMLElement {
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
    (this._outsideWatch = this._outsideWatch || transportWatchOutside(this, (ev) => this._onOutside(ev))).on();
    // Back on the page after leaving it: drawn again in its default state.
    this._render();
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
    this._outsideWatch?.off();
    clearInterval(this._timer);
    this._timer = null;
    this._resize?.disconnect();
    if (this._fitFrame) cancelAnimationFrame(this._fitFrame);
    this._fitWidth = null;
    // Left (another dashboard view, a conditional card hidden): the sections fold back, so that the card does not
    // come back unfolded.
    this._open = {};
  }

  // The banner's status pill goes right after the title only when the whole title (for the next departure's line: its
  // badge and its whole destination) and the whole label fit there; otherwise it takes a line of its own under the
  // other lines (.titles.below, those kept to one line). When the label does not fit that line either, or the banner
  // has no room for the lines above its ground strip, the pill keeps its dot only (.titles.dot-only, back beside the
  // title when the dot fits there). Measured after render, so that it holds in every language.
  _fitPill() {
    // Home Assistant's <ha-card> (a Lit element) shows its content only from its first update, a microtask after it
    // is connected: measured before, everything is 0 px wide and the pill lands on the wrong line. Fitted then.
    const haCard = this._root?.querySelector?.('ha-card');
    if (haCard && haCard.hasUpdated === false) {
      this._pillWait ??= (haCard.updateComplete?.then ? haCard.updateComplete : new Promise((r) => requestAnimationFrame(r))).then(() => {
        this._pillWait = null;
        this._fitPill();
      });
      return;
    }
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
    // The focused control keeps the keyboard focus (or gets it back if its node was replaced), without scrolling the page.
    var focused = this._root.activeElement?.getAttribute?.('data-focus');
    var html = !stops.length
      ? `<div class="empty">${transportEsc(t.no_entity)}</div>`
      : this._compact() ? this._renderCompact(stops, t) : this._renderFull(stops, t);
    this._root.querySelector('ha-card').classList.toggle('mini', this._compact());
    // The 15 s clock tick mostly draws the same thing: nothing is touched when the HTML did not change. Otherwise the
    // nodes are patched in place (transportMorph): the banner's picture, the network logo and their animations are
    // kept, and the card keeps its height, instead of being re-created on every sensor update.
    if (html === body._html) return;
    body._html = html;
    transportMorph(body, html);
    this._fitPill();
    if (focused && this._root.activeElement?.getAttribute?.('data-focus') !== focused) this._root.querySelector(`[data-focus="${CSS?.escape ? CSS.escape(focused) : focused}"]`)?.focus?.({ preventScroll: true });
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
    if (this._config.show_nearby) html += this._renderNearby(sel, t);
    if (this._config.show_alerts) {
      html += sel.filter((s) => this._usable(s) && (s.st.attributes.alerts || []).length).map((s) => this._renderAlerts(s.id, s.st.attributes, t)).join('');
    }
    return html;
  }

  // The bike stations and park-and-rides followed with the shown stops: one pill each (bikes, or free spaces), and a
  // tap shows its detail (bikes and free docks, or free spaces with those of each type) under the pills.
  _renderNearby(stops, t) {
    var seen = {};
    var items = [];
    stops.forEach((s) => {
      (s.st?.attributes?.nearby || []).forEach((m) => {
        if (m && m.id && !seen[m.id]) {
          seen[m.id] = true;
          items.push(m);
        }
      });
    });
    if (!items.length) return '';
    var num = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
    var level = (m) => {
      var n = num(m.available);
      if (!m.open || n == null) return 'idle';
      if (n === 0) return 'crit';
      var cap = num(m.capacity);
      if (m.kind === 'bike') return n < 3 ? 'warn' : 'ok';
      return cap && n / cap < 0.1 ? 'warn' : 'ok';
    };
    var pills = items.map((m) => {
      var n = num(m.available);
      var count = !m.open ? t.nearby_closed : n == null ? '—' : transportFill(m.kind === 'bike' ? t.nearby_bikes : t.nearby_spaces, { n: n });
      var name = m.kind === 'park' ? `P+R ${m.name}` : m.name;
      var open = this._nearby === m.id;
      return `<span class="npill ${level(m)}${open ? ' open' : ''}" role="button" tabindex="0" aria-expanded="${open}" data-action="nearby" data-key="${transportEsc(m.id)}" data-focus="nearby:${transportEsc(m.id)}">` +
        `<span class="nic">${transportIcon(m.kind === 'bike' ? 'bike' : 'parking')}</span><span class="nt"><b>${transportEsc(count)}</b> · ${transportEsc(name)}</span></span>`;
    }).join('');
    var picked = items.find((m) => m.id === this._nearby);
    var bar = (label, value, cap, cls) => {
      var v = num(value);
      var c = num(cap);
      var cells = 6;
      var filled = v != null && c ? Math.round((Math.min(v, c) / c) * cells) : 0;
      var segs = Array.from({ length: cells }, (_, i) => `<i class="${i < filled ? cls : ''}"></i>`).join('');
      return `<div class="nrow"><span class="nl">${transportEsc(label)}</span><span class="nseg">${segs}</span><span class="nv">${v == null ? '—' : v}${c ? ` / ${c}` : ''}</span></div>`;
    };
    var detail = '';
    if (picked) {
      var rows = picked.kind === 'bike'
        ? bar(t.nearby_bike, picked.available, picked.capacity, 'bk') + bar(t.nearby_docks, picked.docks, picked.capacity, 'dk')
        : bar(t.nearby_free, picked.available, picked.capacity, 'pk');
      var spaces = picked.spaces || {};
      var tags = ['pmr', 'ev', 'carpool'].filter((k) => num(spaces[k]) != null).map((k) => `<span class="tag">${transportEsc(t[`nearby_${k}`])} ${num(spaces[k])}</span>`).join('');
      detail = `<div class="ndetail">${rows}${tags ? `<div class="ntags">${tags}</div>` : ''}</div>`;
    }
    return `<div class="nearby"><div class="section-title">${transportIcon('marker')}<span>${transportEsc(t.nearby)}</span></div><div class="npills">${pills}</div>${detail}</div>`;
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
    } else if (action === 'nearby') {
      var key = el.getAttribute('data-key');
      this._nearby = this._nearby === key ? null : key;
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
  .nearby { display: flex; flex-direction: column; gap: 8px; margin: 4px 16px 12px; padding-top: 10px; border-top: 1px solid var(--divider-color, rgba(127,127,127,.15)); }
  .npills { display: flex; flex-wrap: wrap; gap: 6px; }
  .npill { --c: var(--tp-ok); cursor: pointer; user-select: none; display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; box-sizing: border-box;
           padding: 3px 10px 3px 3px; border-radius: 999px; font-size: 12px; color: var(--primary-text-color);
           background: var(--secondary-background-color, rgba(127,127,127,.1)); border: 1px solid transparent; }
  .npill.warn { --c: var(--tp-warn); } .npill.crit { --c: var(--tp-crit); } .npill.idle { --c: var(--secondary-text-color); }
  .npill.open { border-color: color-mix(in srgb, var(--c) 55%, transparent); }
  .npill:focus-visible { outline: 2px solid var(--tp-accent); outline-offset: 2px; }
  .nic { flex: none; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); }
  .nic .icon { width: 15px; height: 15px; }
  .nt { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .ndetail { display: flex; flex-direction: column; gap: 6px; padding: 10px; border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .nrow { display: grid; grid-template-columns: minmax(70px, auto) minmax(0, 1fr) auto; align-items: center; gap: 10px; font-size: 12px; color: var(--secondary-text-color); }
  .nseg { display: flex; gap: 3px; }
  .nseg i { flex: 1; height: 8px; border-radius: 2px; background: color-mix(in srgb, var(--secondary-text-color) 18%, transparent); }
  .nseg i.bk { background: #14b8a6; } .nseg i.dk { background: #60a5fa; } .nseg i.pk { background: var(--tp-ok); }
  .nv { font-variant-numeric: tabular-nums; color: var(--primary-text-color); }
  .ntags { display: flex; flex-wrap: wrap; gap: 4px; }
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
