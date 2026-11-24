// ── public-transport-mini-card ────────────────────────────────────────────────
// The next departure of all the stops in the banner, with its approach bar. Its detail button (top right) switches
// to the full card and back; a click outside the card folds it back to the compact view.
import { transportEsc, transportIcon, transportInDialog, transportWatchOutside } from "./i18n-helpers.js";
import { TransportCard } from "./public-transport-card-2.js";

export class TransportMiniCard extends TransportCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onOutsideMini = (ev) => {
      if (this._zoomed && !ev.composedPath().includes(this) && !transportInDialog(ev)) this._setZoom(false);
    };
  }

  connectedCallback() {
    super.connectedCallback();
    (this._outsideMiniWatch = this._outsideMiniWatch || transportWatchOutside(this, (ev) => this._onOutsideMini(ev))).on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._outsideMiniWatch?.off();
    // Back to the compact view once off the page.
    this._zoomed = false;
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
