(function () {
  var F = CAR.FIN;
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  function C() { return CAR.c(); }

  function loadExample() {
    var c = C(), x = c.ex;
    var bal = CAR.nice(x.price * 0.75, 2), n = x.term;
    var i = F.toMonthly(x.rate), M = F.annuity(bal, i * (1 + (c.vat || 0)), n);
    $('bal').value = bal;
    $('apr').value = x.rate;
    $('n').value = n;
    $('extra').value = CAR.nice(M * 0.2, 1);
    $('fee').value = c.prepay.kind === 'eu' ? 1 : c.prepay.pct;
    $('aprLabel').textContent = c.rate.inputLabel;
    $('exNote').textContent = 'Example numbers for ' + c.name + ' are filled in. Replace them with your own.';
    var h = c.prepay.kind === 'eu' ? 'The law caps this at 1% (0.5% with a year or less left) and at the interest you save.' + (c.prepay.free ? ' No fee at all if you repay ' + CAR.money0(c.prepay.free) + ' or less in 12 months.' : '')
      : c.prepay.kind === 'none' ? 'Usually 0% in ' + c.name + '. Enter a fee only if your contract has one.'
      : 'Typical in ' + c.name + ': about ' + c.prepay.pct + '% of the amount repaid early. Check your contract.';
    $('feeHint').textContent = h;
    renderRules();
  }

  // Run the loan month by month. extra goes straight to the balance; fees follow the country's rules.
  function plan(B, i, M, extra, n, feePct) {
    var c = C(), bal = B, interest = 0, k = 0, extras = [];
    while (bal > 0.005 && k < 1200) {
      var it = bal * i;
      if (M + extra <= it + 1e-9) return null;
      interest += it;
      k++;
      var regular = Math.min(M, bal + it);
      bal = bal + it - regular;
      var e = Math.min(extra, Math.max(bal, 0));
      bal -= e;
      extras.push(e);
    }
    // Fees on the extra amounts, checked per 12-month window for the UK and France thresholds.
    var fee = 0;
    if (feePct > 0) {
      for (var w = 0; w < extras.length; w += 12) {
        var win = extras.slice(w, w + 12), tot = win.reduce(function (a, b) { return a + b; }, 0);
        if (c.prepay.free && tot <= c.prepay.free) continue;
        win.forEach(function (e, j) {
          var monthsLeft = n - (w + j + 1);
          fee += F.prepayFee(e, monthsLeft, -1, feePct);
        });
      }
    }
    return { months: k, interest: interest, fee: fee };
  }

  function showError(t) { $('msg').textContent = t; $('msg').hidden = false; $('body').hidden = true; }

  function render() {
    var c = C();
    var B = num('bal'), r = num('apr'), n = Math.round(num('n')), extra = num('extra'), feePct = num('fee');
    $('pay').textContent = CAR.money(0);
    if (!(B > 0)) return showError('Enter your loan balance to get started.');
    if (!(n >= 1) || n > 120) return showError('Enter the months left on your loan, from 1 to 120.');
    if (r < 0 || r > (c.rate.input === 'month' ? 30 : 200)) return showError('Check the interest rate.');
    if (extra < 0 || feePct < 0) return showError('The extra payment and fee cannot be negative.');

    var i = F.toMonthly(r) * (1 + (c.vat || 0));
    var M = F.annuity(B, i, n);
    $('pay').textContent = CAR.money(M);
    var base = plan(B, i, M, 0, n, 0), p = plan(B, i, M, extra, n, feePct);
    if (!base || !p) return showError('These numbers do not pay down the loan. Check the rate and months left.');

    var gross = Math.max(base.interest - p.interest, 0);
    var fee = c.prepay.capInterest ? Math.min(p.fee, gross) : p.fee;
    var net = gross - fee;
    var monthsSaved = base.months - p.months;
    $('msg').hidden = true;
    $('body').hidden = false;
    $('resBig').textContent = CAR.smoney0(net);
    $('resBig').style.color = net < 0 ? 'var(--warm)' : '';
    var t = extra > 0
      ? 'Paying ' + CAR.money0(extra) + ' extra each month finishes the loan around ' + CAR.when(p.months) + ' instead of ' + CAR.when(base.months) + '.'
      : 'Add an extra monthly amount to see how much interest you could save.';
    if (fee > 0) t += ' That is ' + CAR.money0(gross) + ' of interest saved minus ' + CAR.money0(fee) + ' in early repayment fees.';
    t += ' Without extra payments you would pay ' + CAR.money0(base.interest) + ' in interest' + (c.vat ? ' (including IVA).' : '.');
    $('resSub').textContent = t;
    $('sPayoff').textContent = CAR.span(p.months);
    $('sSaved').textContent = monthsSaved > 0 ? CAR.span(monthsSaved) : 'None';
    $('sInt').textContent = CAR.money0(p.interest);
    $('sFee').textContent = CAR.money0(fee);

    var pS = base.interest > 0 ? Math.max(net, 0) / base.interest * 100 : 0;
    $('barP').style.width = pS + '%';
    $('barC').style.width = (100 - pS) + '%';
    $('bar').setAttribute('aria-label', Math.round(pS) + ' percent of the original interest is saved');
    $('legP').textContent = 'Saved ' + CAR.money0(Math.max(net, 0));
    $('legC').textContent = 'Still paid ' + CAR.money0(p.interest + fee);

    var unit = CAR.nice(M * 0.1, 1);
    var list = [0, unit, unit * 2, unit * 5, unit * 10];
    if (list.indexOf(extra) === -1) list.push(extra);
    list.sort(function (a, b) { return a - b; });
    var tbody = $('rows');
    tbody.textContent = '';
    list.forEach(function (x) {
      var q = plan(B, i, M, x, n, feePct);
      if (!q) return;
      var g = Math.max(base.interest - q.interest, 0), f = c.prepay.capInterest ? Math.min(q.fee, g) : q.fee;
      var tr = document.createElement('tr');
      if (x === extra) tr.className = 'now';
      [CAR.money0(x) + (x === extra ? ' (yours)' : ''), CAR.span(q.months), CAR.smoney0(g - f)].forEach(function (txt) {
        var td = document.createElement('td'); td.textContent = txt; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderRules() {
    var c = C();
    var items = [c.prepay.rule].concat(c.extra && c.extra.payoff || []);
    $('rules').innerHTML = '<h2>Paying off early in ' + c.name + '</h2><ul>' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' + CAR.sources(c, 'payoff');
  }

  ['bal', 'apr', 'n', 'extra', 'fee'].forEach(function (id) { $(id).addEventListener('input', render); });
  CAR.onChange(function () { loadExample(); render(); });
  CAR.init();
})();
