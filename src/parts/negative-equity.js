(function () {
  var F = CAR.FIN;
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  function C() { return CAR.c(); }

  function loadExample() {
    var c = C(), x = c.ex;
    var bal = CAR.nice(x.price * 0.85, 2), n = x.term;
    $('bal').value = bal;
    $('value').value = CAR.nice(x.price * 0.72, 2);
    $('apr').value = x.rate;
    $('n').value = n;
    $('balloon').value = 0;
    $('dep').value = x.dep;
    $('aprLabel').textContent = c.rate.inputLabel;
    $('balloonLabel').textContent = c.balloon.label + ' (optional)';
    $('balloonHint').textContent = c.balloon.hint;
    var uk = c.code === 'GB';
    $('f-uk').hidden = !uk;
    if (uk) {
      var M = F.annuity(bal, F.toMonthly(x.rate), n);
      var tap = CAR.nice(M * (n + 12) + x.price * x.downPct, 2);
      $('tap').value = tap;
      $('paid').value = CAR.nice(tap - M * n, 2);
    }
    $('exNote').textContent = 'Example numbers for ' + c.name + ' are filled in. Replace them with your own.';
    renderRules();
  }

  // Month-by-month car value and loan balance. Index m is after m payments.
  function path(B, i, n, value0, depPct, balloon) {
    var M = F.annuity(B, i, n, balloon), bal = B, out = [];
    for (var m = 0; m <= n; m++) {
      if (m > 0) bal = m === n ? 0 : Math.max(bal * (1 + i) - M, 0);
      var v = value0 * Math.pow(1 - depPct / 100, m / 12);
      out.push({ m: m, value: v, bal: bal, eq: v - bal });
    }
    return { M: M, rows: out };
  }
  function label(m) {
    if (m === 0) return 'Today';
    if (m % 12 === 0) { var y = m / 12; return y + (y === 1 ? ' year' : ' years'); }
    return m + ' months';
  }
  function showError(t) { $('msg').textContent = t; $('msg').hidden = false; $('body').hidden = true; }

  function render() {
    var c = C();
    var B = num('bal'), value = num('value'), r = num('apr'), n = Math.round(num('n')), dep = num('dep'), balloon = num('balloon');
    $('pay').textContent = CAR.money(0);
    if (!(B > 0)) return showError('Enter your loan balance to get started.');
    if (!(value > 0)) return showError('Enter what the car is worth today.');
    if (!(n >= 1) || n > 120) return showError('Enter the months left on your loan, from 1 to 120.');
    if (r < 0 || r > (c.rate.input === 'month' ? 30 : 200)) return showError('Check the interest rate.');
    if (dep < 0 || dep > 90) return showError('Enter a yearly value loss between 0% and 90%.');
    if (balloon < 0 || balloon >= B) return showError('The final payment must be smaller than the loan balance.');

    var i = F.toMonthly(r) * (1 + (c.vat || 0));
    var P = path(B, i, n, value, dep, balloon), rows = P.rows;
    var eq0 = rows[0].eq, be = null;
    for (var k = 0; k < rows.length; k++) if (rows[k].eq >= 0) { be = rows[k].m; break; }
    $('pay').textContent = CAR.money(P.M);
    $('msg').hidden = true;
    $('body').hidden = false;
    $('resBig').textContent = CAR.smoney0(eq0);
    $('resBig').style.color = eq0 < 0 ? 'var(--warm)' : '';
    if (eq0 >= 0) $('resSub').textContent = 'Your car is worth ' + CAR.money0(eq0) + ' more than you owe, so you could sell or trade it in without a gap.';
    else $('resSub').textContent = 'You owe ' + CAR.money0(-eq0) + ' more than the car is worth.' + (be === null ? '' : ' At this pace you reach break-even around ' + CAR.when(be) + '.') + (balloon > 0 ? ' A large final payment keeps the balance high until the end, so negative equity lasts longer.' : '');
    $('sVal').textContent = CAR.money0(value);
    $('sBal').textContent = CAR.money0(B);
    $('sBreak').textContent = eq0 >= 0 ? 'Already there' : (be === null ? 'Not before payoff' : 'In ' + be + (be === 1 ? ' month' : ' months'));
    $('sRoll').textContent = CAR.money0(Math.max(-eq0, 0));

    // UK: voluntary termination once half the total amount payable is paid (CCA s.99/100)
    var box = $('ukBox');
    box.hidden = true;
    if (c.code === 'GB') {
      var tap = num('tap'), paid = num('paid');
      if (tap > 0) {
        var half = tap / 2;
        box.hidden = false;
        box.textContent = paid >= half
          ? 'You have paid ' + CAR.money0(paid) + ', which is at least half of ' + CAR.money0(tap) + '. You can use voluntary termination to hand the car back and owe nothing more, as long as it is in reasonable condition.'
          : 'Voluntary termination: you can hand the car back once you have paid half of ' + CAR.money0(tap) + ', which is ' + CAR.money0(half) + '. You have paid ' + CAR.money0(paid) + ', so ' + CAR.money0(half - paid) + ' more, about ' + Math.ceil((half - paid) / P.M) + ' more payments. Ending now, you would pay that difference.';
      }
    }

    var tbody = $('rows');
    tbody.textContent = '';
    rows.filter(function (p) { return p.m % 12 === 0 || p.m === n; }).slice(0, 9).forEach(function (p) {
      var tr = document.createElement('tr');
      if (p.m === 0) tr.className = 'now';
      [label(p.m), CAR.money0(p.value), CAR.money0(p.bal), CAR.smoney0(p.eq)].forEach(function (txt) {
        var td = document.createElement('td'); td.textContent = txt; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderRules() {
    var c = C();
    var items = [];
    if (c.balloon.rule) items.push(c.balloon.rule);
    (c.extra && c.extra.neg || []).forEach(function (t) { items.push(t); });
    items.push(c.prepay.rule);
    $('rules').innerHTML = '<h2>Negative equity in ' + c.name + '</h2><ul>' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' + CAR.sources(c, 'neg');
  }

  ['bal', 'value', 'apr', 'n', 'dep', 'balloon', 'tap', 'paid'].forEach(function (id) { $(id).addEventListener('input', render); });
  CAR.onChange(function () { loadExample(); render(); });
  CAR.init();
})();
