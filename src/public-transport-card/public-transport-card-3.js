// ── public-transport-card-editor ──────────────────────────────────────────────
import { TRANSPORT_CARD_VERSION, pickerDefine } from "./card-picker.js";
import { TRANSPORT_DEFAULTS, transportLang } from "./i18n-helpers.js";
import { TransportCard } from "./public-transport-card-2.js";
import { TransportMiniCard } from "./public-transport-mini.js";
import { TransportI18n } from "./i18n/transporti18n.js";

export var TRANSPORT_LANGUAGES = [
  ['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['sr', 'Српски'], ['sr-Latn', 'Srpski (latinica)'],
  ['it', 'Italiano'], ['nl', 'Nederlands'], ['pt', 'Português (Portugal)'], ['pl', 'Polski'], ['ro', 'Română'], ['da', 'Dansk'],
  ['sv', 'Svenska'], ['bg', 'Български'], ['ru', 'Русский'], ['uk', 'Українська'], ['hu', 'Magyar'], ['sk', 'Slovenčina'],
  ['cs', 'Čeština'], ['sl', 'Slovenščina'], ['lv', 'Latviešu'], ['el', 'Ελληνικά'],
];

export function transportEditorSchema(t) {
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
        { name: 'show_nearby', selector: { boolean: {} } },
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

export class TransportCardEditor extends HTMLElement {
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
  pickerDefine('public-transport-card-editor', TransportCardEditor);
}

export var transportDefined = false;
if (!customElements.get('public-transport-card')) {
  pickerDefine('public-transport-card', TransportCard);
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
  pickerDefine('public-transport-mini-card', TransportMiniCard);
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
