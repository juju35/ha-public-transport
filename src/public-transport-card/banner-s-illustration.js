// ── The banner's illustration ─────────────────────────────────────────────────
// A city stop at the right of the banner, drawn in a 200 × 80 box (bottom right aligned): pale buildings with
// their windows, the platform, the stop's pole with its departure display (line, countdown) and the vehicle of the
// next departure in its line color (a bus, two metro cars, or a tram under its wire). The road or the track is not
// part of the picture: it is a 10px strip of the banner (CSS) that runs under the text too. Generic shapes, no
// operator livery. The display and its sign tell the state: on time, delayed (+n'), or disrupted (a red sign).
import { transportEsc } from "./i18n-helpers.js";

// Approach bar: the vehicle reaches the stop when the countdown reaches zero, from this many minutes away.
export var TRANSPORT_APPROACH = 10;

// Delayed: the next departure runs this many minutes late or more (real time).
export var TRANSPORT_LATE = 2;

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day picture after sunset).
export function transportIsNight(hass, config) {
  var theme = config?.illustration_theme;
  if (theme === 'day') return false;
  if (theme === 'night') return true;
  return !!hass?.themes?.darkMode;
}

export function transportMode(mode) {
  return mode === 'metro' || mode === 'tram' ? mode : 'bus';
}

// The bus, front to the right (70 × 26, wheels on the platform), the line on its front display.
export function transportBusSvg(color, label) {
  return `<rect x="0" y="-26" width="70" height="24" rx="5" fill="${color}"/><rect x="0" y="-26" width="70" height="5" rx="3" fill="${color}" opacity=".7"/>` +
    [6, 20, 34, 48].map((x) => `<rect class="bwin" x="${x}" y="-20" width="11" height="9" rx="1.5"/>`).join('') +
    '<rect class="bwin" x="60" y="-20" width="8" height="15" rx="1"/><rect x="4" y="-7" width="52" height="2" fill="#fff" opacity=".6"/>' +
    '<g class="wheel"><circle cx="14" cy="-1" r="4.4"/><circle cx="56" cy="-1" r="4.4"/></g>' +
    `<rect x="2" y="-24" width="14" height="5" rx="1" fill="#1a1d22"/><text class="gtext" x="9" y="-20.2" text-anchor="middle">${label}</text>` +
    '<path class="beam" d="M70 -8 L92 -12 V-2Z"/><g class="puff"><circle cx="-3" cy="-4" r="3"/></g>';
}

// Two metro cars (46 each), or a tram with a pantograph on each car; the line's tag on the first car.
export function transportTrainSvg(mode, color, text, label) {
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
export function transportSceneSvg(mode, state, color, text, line, live, board, status, delay) {
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
