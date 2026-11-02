(function () {
  var F = CAR.FIN;
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  var mode = 'find';

  function C() { return CAR.c(); }
  function rateName() { var R = C().rate; return R.name + (R.local ? ' (' + R.local + ')' : ''); }
  function showRate(v) { return CAR.pct(v); }

  // Fill the form with this country's example loan.
  function loadExample() {
    var c = C(), x = c.ex;
    var terms = c.terms || [24, 36, 48, 60, 72, 84, 96];
    var sel = $('term');
    sel.textContent = '';
    terms.forEach(function (t) {
      var o = document.createElement('option');
      o.value = t; o.textContent = t + ' months';
      sel.appendChild(o);
    });
    sel.value = String(x.term);
    var price = x.price, down = CAR.nice(price * x.downPct, 2), L = price - down;
    var i = F.toMonthly(x.rate);
    var M = c.vat ? F.annuity(L, i * (1 + c.vat), x.term, 0) : F.annuity(L, i, x.term, 0);
    $('price').value = price;
    $('down').value = down;
    $('payment').value = CAR.nice(M, 3);
    $('apr').value = x.rate;
    $('balloon').value = 0;
    $('fees').value = 0;
    $('ratetype').value = 'reducing';
    $('vat').checked = true;
    $('exNote').textContent = 'Example numbers for ' + c.name + ' are filled in. Replace them with your own.';

    var R = c.rate;
    $('aprLabel').textContent = R.inputLabel;
    $('aprHint').textContent = R.inputHint;
    $('thRate').textContent = R.input === 'month' ? 'Rate per month' : R.name;
    $('f-ratetype').hidden = !c.flat;
    $('f-vat').hidden = !c.vat;
    $('vatLabel').textContent = 'My payment includes ' + Math.round(c.vat * 100) + '% IVA on the interest';
    $('balloonLabel').textContent = c.balloon.label + ' (optional)';
    $('balloonHint').textContent = c.balloon.hint;
    $('feesLabel').textContent = c.fee.label + ' (optional)';
    $('feesHint').textContent = c.fee.hint;
    $('mode-find').textContent = 'Find my ' + R.name;
    $('payLabel').textContent = c.payLabel || 'Monthly payment';
    $('thPay').textContent = c.payLabel ? 'EMI' : 'Monthly payment';
    $('mode-pay').textContent = c.payLabel ? 'Find my EMI' : 'Find my payment';
    $('paymentHint').textContent = c.vat ? 'The amount you pay each month, including IVA.' : 'Principal and interest only.';
    renderRules();
  }

  function setMode(m) {
    mode = m;
    $('mode-find').setAttribute('aria-pressed', String(m === 'find'));
    $('mode-pay').setAttribute('aria-pressed', String(m === 'pay'));
    $('f-payment').hidden = m !== 'find';
    $('f-apr').hidden = m !== 'pay';
    $('f-ratetype').hidden = m !== 'pay' || !C().flat;
    render();
  }

  function showError(text) {
    $('msg').textContent = text;
    $('msg').hidden = false;
    $('body').hidden = true;
  }

  // Mexico: interest carries IVA. Returns the CAT (annual, without IVA) for a loan whose
  // payment M already includes IVA, amortizing at monthly rate iEff = i * (1 + vat).
  function catWithoutVat(L, fees, M, n, B, iEff, vat) {
    var i = iEff / (1 + vat), bal = L, flows = [];
    for (var k = 1; k <= n; k++) {
      var ivaK = bal * i * vat;
      var pay = M + (k === n ? B : 0);
      bal = bal * (1 + iEff) - pay;
      flows.push(pay - ivaK);
    }
    var irr = F.irr(L - fees, flows);
    return irr >= 0 && isFinite(irr) ? F.effective(irr) : NaN;
  }

  function stat(label, value) {
    return '<div class="stat"><span>' + label + '</span><b translate="no">' + value + '</b></div>';
  }

  function render() {
    var c = C(), R = c.rate;
    var price = num('price'), down = num('down'), n = parseInt($('term').value, 10);
    var B = num('balloon'), fees = num('fees');
    var L = price - down;
    $('financed').textContent = CAR.money0(Math.max(L, 0));

    if (!(price > 0)) return showError('Enter the vehicle price to get started.');
    if (!(L > 0)) return showError('The down payment covers the whole price, so there is nothing to finance.');
    if (B < 0 || fees < 0) return showError('The balloon payment and fees cannot be negative.');
    if (B >= L) return showError('The balloon payment must be smaller than the amount financed.');
    if (fees >= L) return showError('The fees are as large as the loan amount. Check the fee figure.');

    var vat = c.vat && $('vat').checked ? c.vat : 0;
    var useVatPay = c.vat ? c.vat : 0;
    var M, iInterest, headline, flatEq = null, statsHtml = '';

    if (mode === 'find') {
      M = num('payment');
      if (!(M > 0)) return showError('Enter the monthly payment from your loan offer.');
      if (M * n + B < L - 0.005) return showError('That payment is too low to repay ' + CAR.money0(L) + ' in ' + n + ' months, so no rate fits. Check the payment, the term, or the amount financed.');
      var iPay = F.solve(L, M, n, B);
      if (!isFinite(iPay) || iPay * 1200 > 400) return showError('These numbers imply an unrealistically high rate. Check the payment and the amount financed.');
      iInterest = vat ? iPay / (1 + vat) : iPay;
      if (vat) headline = catWithoutVat(L, fees, M, n, B, iPay, vat);
      else { var iAll = F.solve(L - fees, M, n, B); headline = F.headline(iAll); }
    } else {
      var r = num('apr');
      if (!(r >= 0) || r > (R.input === 'month' ? 30 : 200)) return showError('Enter a rate between 0 and ' + (R.input === 'month' ? '30% a month.' : '200% a year.'));
      if (c.flat && $('ratetype').value === 'flat') {
        if (B > 0) return showError('Flat-rate loans do not use a balloon payment. Set the balloon to 0.');
        M = F.flatPayment(L, r, n);
        iInterest = F.solve(L, M, n, 0);
        flatEq = r;
      } else {
        iInterest = F.toMonthly(r);
        M = F.annuity(L, useVatPay ? iInterest * (1 + useVatPay) : iInterest, n, B);
      }
      if (useVatPay) headline = catWithoutVat(L, fees, M, n, B, iInterest * (1 + useVatPay), useVatPay);
      else headline = F.headline(F.solve(L - fees, M, n, B));
    }
    if (!isFinite(headline)) return showError('These numbers imply an unrealistically high rate. Check your entries.');

    var total = M * n + B, cost = Math.max(total - L, 0);
    $('msg').hidden = true;
    $('body').hidden = false;

    // Headline figure
    if (mode === 'find') {
      $('resLabel').textContent = 'Your ' + rateName();
      $('resBig').textContent = showRate(headline);
      var parts = [R.desc];
      if (fees > 0 && !vat) parts.push('Without the ' + CAR.money0(fees) + ' in fees the rate would be ' + showRate(F.headline(iInterest)) + '.');
      $('resSub').textContent = parts.join(' ');
    } else {
      $('resLabel').textContent = 'Your ' + (c.payLabel ? 'EMI' : 'monthly payment');
      $('resBig').textContent = CAR.money(M);
      var t = 'On ' + CAR.money0(L) + ' over ' + n + ' months' + (B > 0 ? ' with a ' + CAR.money0(B) + ' final payment' : '') + '. ';
      t += 'The true ' + rateName() + ' is ' + showRate(headline) + '.';
      if (flatEq !== null) t += ' A ' + showRate(flatEq) + ' flat rate is really ' + showRate(F.headline(iInterest)) + ' on a reducing balance.';
      if (useVatPay) t += ' Includes IVA on the interest.';
      $('resSub').textContent = t;
    }

    // Rate breakdown: the same loan expressed every way lenders quote it
    if (R.input === 'month') statsHtml += stat('Rate per month', showRate(iInterest * 100));
    statsHtml += stat('Nominal yearly rate', showRate(iInterest * 1200));
    statsHtml += stat('Effective yearly rate', showRate(F.effective(iInterest)));
    if (c.flat && B === 0) statsHtml += stat('Flat rate equivalent', showRate(F.flatFromPayment(L, M / (vat ? 1 : 1), n)));
    $('rateStats').innerHTML = statsHtml;

    $('sFinanced').textContent = CAR.money0(L);
    $('sInterestLabel').textContent = (vat || (mode === 'pay' && useVatPay)) ? 'Total interest incl. IVA' : 'Total interest';
    $('sInterest').textContent = CAR.money0(cost);
    $('sTotal').textContent = CAR.money0(total);

    var pShare = total > 0 ? (L / total) * 100 : 100;
    $('barP').style.width = pShare + '%';
    $('barC').style.width = (100 - pShare) + '%';
    $('bar').setAttribute('aria-label', Math.round(pShare) + ' percent of your payments repay the loan and ' + Math.round(100 - pShare) + ' percent is interest');
    $('legP').textContent = 'Loan ' + CAR.money0(L);
    $('legC').textContent = 'Interest ' + CAR.money0(cost);

    // Nearby rates, in the country's own convention
    var baseR = F.fromMonthly(iInterest);
    var step = R.input === 'month' ? 0.2 : 1;
    var tbody = $('rows');
    tbody.textContent = '';
    [-2, -1, 0, 1, 2].forEach(function (d) {
      var rr = baseR + d * step;
      if (rr < 0) return;
      var ii = F.toMonthly(rr);
      var pay = F.annuity(L, useVatPay ? ii * (1 + useVatPay) : ii, n, B);
      var tr = document.createElement('tr');
      if (d === 0) tr.className = 'now';
      [showRate(rr) + (d === 0 ? ' (yours)' : ''), CAR.money(pay), CAR.money0(Math.max(pay * n + B - L, 0))].forEach(function (txt) {
        var td = document.createElement('td');
        td.textContent = txt;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // Country-specific warnings that depend on the result
    var warn = $('liveWarn');
    if (warn) warn.remove();
    var w = [];
    if (c.usury && headline > c.usury.rate && L > c.usury.over) w.push('This ' + R.name + ' is above the legal maximum (taux d’usure) of ' + showRate(c.usury.rate) + ' for loans over ' + CAR.money0(c.usury.over) + '. A lender cannot legally offer it.');
    if (c.cap && headline > c.cap.rate) w.push('This is above the legal maximum of ' + showRate(c.cap.rate) + ' ' + c.cap.label + '.');
    if (c.code === 'BR') {
      var iof = L * 0.0038, balI = L, ii2 = iInterest;
      for (var k = 1; k <= n; k++) { var pr = M - balI * ii2 + (k === n ? B : 0); balI -= pr; iof += Math.max(pr, 0) * 0.000082 * Math.min(30 * k, 365); }
      w.push('Estimated IOF on this loan: ' + CAR.money0(iof) + ' (0.38% plus 0.0082% a day, up to 365 days). If your bank added IOF to the loan, include it in the fees to see the full CET.');
    }
    if (w.length) {
      var p = document.createElement('p');
      p.id = 'liveWarn';
      p.className = 'callout';
      p.textContent = w.join(' ');
      $('rateStats').insertAdjacentElement('afterend', p);
    }
  }

  function renderRules() {
    var c = C(), box = $('rules');
    var items = [c.rate.rule];
    if (c.flat) items.push(c.flatRule);
    if (c.vat) items.push(c.vatRule);
    if (c.balloon.rule) items.push(c.balloon.rule);
    (c.extra && c.extra.apr || []).forEach(function (t) { items.push(t); });
    box.innerHTML = '<h2>Car loan rules in ' + c.name + '</h2><ul>' + items.filter(Boolean).map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' + CAR.sources(c, 'apr');
  }

  $('mode-find').addEventListener('click', function () { setMode('find'); });
  $('mode-pay').addEventListener('click', function () { setMode('pay'); });
  ['price', 'down', 'payment', 'apr', 'balloon', 'fees'].forEach(function (id) { $(id).addEventListener('input', render); });
  ['term', 'ratetype', 'vat'].forEach(function (id) { $(id).addEventListener('change', render); });

  CAR.onChange(function () { loadExample(); setMode(mode); });
  CAR.init();
})();
