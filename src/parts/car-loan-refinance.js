(function () {
  var F = CAR.FIN;
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  function C() { return CAR.c(); }

  function loadExample() {
    var c = C(), x = c.ex;
    var terms = c.terms || [24, 36, 48, 60, 72, 84];
    var sel = $('n1');
    sel.textContent = '';
    terms.forEach(function (t) { var o = document.createElement('option'); o.value = t; o.textContent = t + ' months'; sel.appendChild(o); });
    var n0 = Math.max(x.term - 12, 12);
    var nearest = terms.reduce(function (a, b) { return Math.abs(b - n0) < Math.abs(a - n0) ? b : a; }, terms[0]);
    sel.value = String(nearest);
    var bump = c.rate.input === 'month' ? 0.5 : (x.rate > 15 ? 6 : 3);
    $('bal').value = CAR.nice(x.price * 0.7, 2);
    $('apr0').value = Math.round((x.rate + bump) * 100) / 100;
    $('apr1').value = x.rate;
    $('n0').value = n0;
    $('fees').value = CAR.nice(x.price * 0.003, 1);
    $('fee').value = c.prepay.kind === 'eu' ? 1 : c.prepay.pct;
    $('apr0Label').textContent = 'Current ' + c.rate.inputLabel.charAt(0).toLowerCase() + c.rate.inputLabel.slice(1);
    $('apr1Label').textContent = 'New ' + c.rate.inputLabel.charAt(0).toLowerCase() + c.rate.inputLabel.slice(1);
    $('feesHint').textContent = c.fee.hint;
    $('feeHint').textContent = c.prepay.kind === 'eu' ? 'Capped by law at 1% (0.5% with a year or less left) and at the interest you avoid.' + (c.prepay.free ? ' No fee if the amount is ' + CAR.money0(c.prepay.free) + ' or less.' : '')
      : c.prepay.kind === 'none' ? 'Usually 0% in ' + c.name + '.' : 'Typical in ' + c.name + ': about ' + c.prepay.pct + '%. Check your contract.';
    $('exNote').textContent = 'Example numbers for ' + c.name + ' are filled in. Replace them with your own.';
    renderRules();
  }

  function showError(t) { $('msg').textContent = t; $('msg').hidden = false; $('body').hidden = true; }

  function render() {
    var c = C(), vat = c.vat || 0;
    var B = num('bal'), r0 = num('apr0'), n0 = Math.round(num('n0')), r1 = num('apr1'), n1 = parseInt($('n1').value, 10), fees = num('fees'), feePct = num('fee');
    $('pay0').textContent = CAR.money(0);
    if (!(B > 0)) return showError('Enter your loan balance to get started.');
    if (!(n0 >= 1) || n0 > 120) return showError('Enter the months left on your current loan, from 1 to 120.');
    var max = c.rate.input === 'month' ? 30 : 200;
    if (r0 < 0 || r0 > max || r1 < 0 || r1 > max) return showError('Check the interest rates.');
    if (fees < 0 || feePct < 0) return showError('Fees cannot be negative.');

    var i0 = F.toMonthly(r0) * (1 + vat), i1 = F.toMonthly(r1) * (1 + vat);
    var M0 = F.annuity(B, i0, n0), M1 = F.annuity(B, i1, n1);
    var tot0 = M0 * n0, tot1 = M1 * n1;
    var int0 = tot0 - B, int1 = tot1 - B;
    var exitFee = (c.prepay.free && B <= c.prepay.free) ? 0 : F.prepayFee(B, n0, int0, feePct);
    if (c.prepay.capInterest) exitFee = Math.min(exitFee, int0);
    var costs = fees + exitFee;
    var savings = tot0 - (tot1 + costs);
    var monthly = M0 - M1;
    var breakEven = monthly > 0.005 ? (costs > 0 ? Math.ceil(costs / monthly) : 0) : null;

    $('pay0').textContent = CAR.money(M0);
    $('msg').hidden = true;
    $('body').hidden = false;
    var saves = savings > 0;
    $('resLabel').textContent = saves ? 'You would save' : 'It would cost you more';
    $('resBig').textContent = CAR.money0(Math.abs(savings));
    $('resBig').style.color = saves ? '' : 'var(--warm)';
    var diff = CAR.money(Math.abs(monthly)), t;
    if (saves && monthly >= 0) t = 'The lower rate cuts your payment by ' + diff + ' a month and lowers your total cost.';
    else if (saves) t = 'Your payment rises by ' + diff + ' a month, but the shorter loan costs less in total.';
    else if (monthly > 0) t = 'Your payment drops by ' + diff + ' a month, but the longer term and fees cost more in total.';
    else t = 'The new loan has a higher payment and costs more overall. Check the rate, term, and fees.';
    if (exitFee > 0) t += ' This includes a ' + CAR.money0(exitFee) + ' early repayment fee on your current loan.';
    $('resSub').textContent = t;
    $('sPay0').textContent = CAR.money(M0);
    $('sPay1').textContent = CAR.money(M1);
    $('sBreak').textContent = breakEven === null ? 'No monthly savings' : (breakEven === 0 ? 'Right away' : breakEven + (breakEven === 1 ? ' month' : ' months'));

    var data = [
      [c.rate.name + (c.rate.local ? ' (' + c.rate.local + ')' : ''), CAR.pct(F.headline(i0 / (1 + vat))), CAR.pct(F.headline(i1 / (1 + vat)))],
      ['Monthly payment', CAR.money(M0), CAR.money(M1)],
      ['Months left', String(n0), String(n1)],
      [vat ? 'Total interest incl. IVA' : 'Total interest', CAR.money0(int0), CAR.money0(int1)],
      ['Early repayment fee', '-', CAR.money0(exitFee)],
      ['New loan fees', '-', CAR.money0(fees)],
      ['Total you pay', CAR.money0(tot0), CAR.money0(tot1 + costs)]
    ];
    var tbody = $('rows');
    tbody.textContent = '';
    data.forEach(function (row, k) {
      var tr = document.createElement('tr');
      if (k === data.length - 1) tr.className = 'now';
      row.forEach(function (txt) { var td = document.createElement('td'); td.textContent = txt; tr.appendChild(td); });
      tbody.appendChild(tr);
    });
  }

  function renderRules() {
    var c = C();
    var items = [c.prepay.rule, c.rate.rule].concat(c.extra && c.extra.refi || []);
    if (c.usury) items.push('A new loan cannot legally exceed the taux d’usure (' + CAR.pct(c.usury.rate) + ' for loans over ' + CAR.money0(c.usury.over) + ').');
    $('rules').innerHTML = '<h2>Refinancing in ' + c.name + '</h2><ul>' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' + CAR.sources(c, 'refi');
  }

  ['bal', 'apr0', 'n0', 'apr1', 'fees', 'fee'].forEach(function (id) { $(id).addEventListener('input', render); });
  $('n1').addEventListener('change', render);
  CAR.onChange(function () { loadExample(); render(); });
  CAR.init();
})();
