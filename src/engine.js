// Country engine: picks the visitor's country, formats money for it, and holds the shared loan math.
// Depends on window.CAR_DATA (countries.js), which is inlined just before this file.
(function () {
  var D = window.CAR_DATA;
  var ORDER = D._order;
  var KEY = 'carapr-country';
  var EURO = ['AT', 'BE', 'BG', 'CY', 'EE', 'ES', 'FI', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK'];
  var LANG = { ja: 'JP', ko: 'KR', zh: 'CN', hi: 'IN', bn: 'IN', ta: 'IN', te: 'IN', mr: 'IN', gu: 'IN', kn: 'IN', ml: 'IN', pa: 'IN', ur: 'IN',
               de: 'DE', fr: 'FR', pt: 'BR', es: 'MX', ha: 'NG', yo: 'NG', ig: 'NG', it: 'EU', nl: 'EU', el: 'EU', fi: 'EU', et: 'EU', lv: 'EU', lt: 'EU', sk: 'EU', sl: 'EU', hr: 'EU', mt: 'EU', ga: 'EU', bg: 'EU' };

  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }

  function fromTag(tag) {
    if (!tag) return null;
    var p = String(tag).replace('_', '-').split('-');
    var lang = (p[0] || '').toLowerCase(), reg = (p[1] || '').toUpperCase();
    if (reg === 'UK') reg = 'GB';
    if (reg && D[reg] && reg !== 'EU') return reg;
    if (reg && EURO.indexOf(reg) >= 0) return 'EU';
    if (lang === 'en' || !lang) return null;
    return LANG[lang] || null;
  }
  function fromBrowser() {
    var tags = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (var i = 0; i < tags.length; i++) { var c = fromTag(tags[i]); if (c) return c; }
    return 'US';
  }

  var cur = null, fmtCache = {};
  function C() { return D[cur]; }
  function nf(key, opts) {
    var k = cur + '|' + key;
    if (!fmtCache[k]) {
      try { fmtCache[k] = new Intl.NumberFormat(C().loc, opts); }
      catch (e) { fmtCache[k] = new Intl.NumberFormat('en-US', opts); }
    }
    return fmtCache[k];
  }
  function money(v) { return nf('m', { style: 'currency', currency: C().cur, currencyDisplay: 'narrowSymbol' }).format(v); }
  function money0(v) { return nf('m0', { style: 'currency', currency: C().cur, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v); }
  function smoney0(v) { return (v < -0.5 ? '-' : '') + money0(Math.abs(v)); }
  function smoney(v) { return (v < -0.005 ? '-' : '') + money(Math.abs(v)); }
  function num(v, d) { return nf('n' + (d || 0), { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).format(v); }
  function pct(v, d) { return nf('p' + (d == null ? 2 : d), { style: 'percent', minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }).format(v / 100); }
  function symbol() {
    try {
      var parts = nf('m', { style: 'currency', currency: C().cur, currencyDisplay: 'narrowSymbol' }).formatToParts(1);
      for (var i = 0; i < parts.length; i++) if (parts[i].type === 'currency') return parts[i].value;
    } catch (e) {}
    return C().cur;
  }
  function minorDigits() { return nf('m', { style: 'currency', currency: C().cur }).resolvedOptions().maximumFractionDigits; }
  // Round to a tidy example figure in the local currency.
  function nice(v, sig) {
    sig = sig || 3;
    if (!(v > 0)) return 0;
    var mag = Math.pow(10, Math.floor(Math.log10(v)) - sig + 1);
    return Math.round(v / mag) * mag;
  }
  function when(m) {
    var d = new Date();
    d.setMonth(d.getMonth() + m);
    try { return d.toLocaleDateString(C().loc, { month: 'long', year: 'numeric' }); }
    catch (e) { return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }
  }
  function span(m) {
    var y = Math.floor(m / 12), mo = m % 12, parts = [];
    if (y > 0) parts.push(y + (y === 1 ? ' year' : ' years'));
    if (mo > 0 || y === 0) parts.push(mo + (mo === 1 ? ' month' : ' months'));
    return parts.join(' ');
  }

  // ---------- Loan math (monthly periods) ----------
  var FIN = {
    // Level payment for loan L at monthly rate i over n months, leaving balloon B at the end (B paid with the last payment).
    annuity: function (L, i, n, B) {
      B = B || 0;
      if (i < 1e-12) return (L - B) / n;
      var v = Math.pow(1 + i, -n);
      return (L - B * v) * i / (1 - v);
    },
    pv: function (M, i, n, B) {
      B = B || 0;
      if (i < 1e-12) return M * n + B;
      var v = Math.pow(1 + i, -n);
      return M * (1 - v) / i + B * v;
    },
    // Monthly rate that makes n payments of M plus balloon B worth exactly P today.
    // Returns -1 if the payments don't even repay P, Infinity if absurdly high.
    solve: function (P, M, n, B) {
      B = B || 0;
      if (!(P > 0) || !(M >= 0) || !(n > 0)) return NaN;
      if (M * n + B < P - 0.005) return -1;
      if (M * n + B - P <= 0.005) return 0;
      var lo = 0, hi = 1;
      if (FIN.pv(M, hi, n, B) > P) return Infinity;
      for (var k = 0; k < 200; k++) {
        var mid = (lo + hi) / 2;
        if (FIN.pv(M, mid, n, B) > P) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    },
    // Monthly IRR of an arbitrary list of monthly flows (flows[k] paid at month k+1) against amount P received today.
    irr: function (P, flows) {
      var f = function (i) { var s = 0, d = 1; for (var k = 0; k < flows.length; k++) { d /= (1 + i); s += flows[k] * d; } return s; };
      var tot = 0; for (var k = 0; k < flows.length; k++) tot += flows[k];
      if (tot < P - 0.005) return -1;
      if (tot - P <= 0.005) return 0;
      var lo = 0, hi = 1;
      if (f(hi) > P) return Infinity;
      for (var j = 0; j < 200; j++) { var mid = (lo + hi) / 2; if (f(mid) > P) lo = mid; else hi = mid; }
      return (lo + hi) / 2;
    },
    nominal: function (i) { return i * 1200; },
    effective: function (i) { return (Math.pow(1 + i, 12) - 1) * 100; },
    // Annual figure the country's law uses for its headline rate.
    headline: function (i) { return C().rate.method === 'effective' ? FIN.effective(i) : FIN.nominal(i); },
    // Turn a rate typed in the country's own convention into a monthly rate.
    toMonthly: function (r) {
      var R = C().rate;
      if (R.input === 'month') return r / 100;
      return (R.inputMethod || R.method) === 'effective' ? Math.pow(1 + r / 100, 1 / 12) - 1 : r / 1200;
    },
    fromMonthly: function (i) {
      var R = C().rate;
      if (R.input === 'month') return i * 100;
      return (R.inputMethod || R.method) === 'effective' ? FIN.effective(i) : FIN.nominal(i);
    },
    // Flat-rate loans charge interest on the original amount for the whole term.
    flatPayment: function (P, flatPct, n) { return P * (1 + flatPct / 100 * n / 12) / n; },
    flatFromPayment: function (P, M, n) { return (M * n - P) / P / (n / 12) * 100; },
    // Early repayment charge for repaying `amount` early with `monthsLeft` remaining.
    // `interestAvoided` is the interest the borrower no longer pays because of it (the legal ceiling in the UK and EU).
    // pctTyped is the fee the visitor entered. In the UK and EU the law caps it at 1% of the amount
    // (0.5% with 12 months or less left) and at the interest the borrower avoids.
    prepayFee: function (amount, monthsLeft, interestAvoided, pctTyped) {
      var p = C().prepay;
      if (!(amount > 0) || !(pctTyped > 0)) return 0;
      var pctUsed = pctTyped;
      if (p.kind === 'eu') pctUsed = Math.min(pctTyped, monthsLeft > 12 ? 1 : 0.5);
      var fee = amount * pctUsed / 100;
      if (p.capInterest && interestAvoided >= 0) fee = Math.min(fee, interestAvoided);
      return Math.max(fee, 0);
    },
    prepayCapPct: function (monthsLeft) { return C().prepay.kind === 'eu' ? (monthsLeft > 12 ? 1 : 0.5) : null; }
  };

  // ---------- Picker ----------
  function renderPicker() {
    var sel = document.getElementById('country');
    if (!sel) return;
    if (!sel.options.length || sel.options.length !== ORDER.length) {
      sel.textContent = '';
      ORDER.forEach(function (code) {
        var o = document.createElement('option');
        o.value = code;
        o.textContent = D[code].name + ' · ' + D[code].cur;
        sel.appendChild(o);
      });
    }
    sel.value = cur;
  }
  function applyCurrency() {
    var s = symbol();
    var pres = document.querySelectorAll('.pre[data-cur]');
    for (var i = 0; i < pres.length; i++) pres[i].textContent = s;
    // Give each input room for the symbol, which can be one to three characters wide.
    requestAnimationFrame(function () {
      for (var i = 0; i < pres.length; i++) {
        var inp = pres[i].parentNode.querySelector('input');
        if (inp) inp.style.paddingLeft = (pres[i].offsetWidth + 18) + 'px';
      }
    });
  }
  function track(name, params) { try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {} }
  var listeners = [];
  function set(code, how) {
    if (!D[code] || code === '_order') code = 'US';
    var changed = code !== cur;
    cur = code;
    if (how === 'manual') { save(code); track('country_change', { country: code }); }
    document.documentElement.setAttribute('data-country', code);
    renderPicker();
    applyCurrency();
    if (changed) listeners.forEach(function (fn) { fn(D[code], code); });
  }

  function init() {
    var stored = load(), forced = window.CAR_FORCE;
    // Country landing pages open in their own country; elsewhere use the saved choice or the browser language.
    set(forced && D[forced] ? forced : (stored && D[stored] ? stored : fromBrowser()), 'auto');
    var sel = document.getElementById('country');
    if (sel) sel.addEventListener('change', function () { set(sel.value, 'manual'); });
    // One calculator_use event per page view, the first time a visitor changes an input.
    var calc = document.querySelector('.calc');
    if (calc) {
      var used = false;
      var onUse = function () {
        if (used) return;
        used = true;
        track('calculator_use', { calculator: calc.getAttribute('aria-label') || document.title, country: cur });
      };
      calc.addEventListener('input', onUse);
      calc.addEventListener('change', onUse);
    }
    // Google Translate changes <html lang>. Follow it unless the visitor picked a country themselves.
    var lastLang = document.documentElement.lang;
    new MutationObserver(function () {
      var l = document.documentElement.lang;
      if (l === lastLang) return;
      lastLang = l;
      if (load() || window.CAR_FORCE) return;
      var c = fromTag(l);
      set(c || fromBrowser(), 'auto');
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  // "Sources:" line for the rules panel. page picks page-specific links, falling back to the country's general ones.
  function sources(c, page) {
    var list = (c.src && (c.src[page] || [])).concat(c.src && c.src.all || []);
    if (!list.length) return '';
    return '<p class="src">Sources: ' + list.map(function (s) {
      return '<a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + '</a>';
    }).join(' · ') + '. Rules checked October 2026. Typical figures are estimates; your lender’s documents are the official numbers.</p>';
  }

  window.CAR = {
    data: D, FIN: FIN, init: init, set: set, sources: sources, track: track,
    c: function () { return D[cur]; }, code: function () { return cur; },
    onChange: function (fn) { listeners.push(fn); },
    money: money, money0: money0, smoney0: smoney0, smoney: smoney, num: num, pct: pct, symbol: symbol, minorDigits: minorDigits,
    nice: nice, when: when, span: span, fromTag: fromTag
  };
})();
