(function () {
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  function C() { return CAR.c(); }

  function loadExample() {
    var c = C(), x = c.ex, s = c.save;
    var def = Math.round(x.downPct * 100);
    var opts = [10, 15, 20, 25, 30, 40, 50];
    if (opts.indexOf(def) < 0) opts.push(def);
    opts.sort(function (a, b) { return a - b; });
    var sel = $('pct');
    sel.textContent = '';
    opts.forEach(function (p) { var o = document.createElement('option'); o.value = p; o.textContent = p + '% of the price' + (p === def ? ' (typical)' : ''); sel.appendChild(o); });
    sel.value = String(def);
    var goal = x.price * def / 100;
    $('price').value = x.price;
    $('saved').value = CAR.nice(goal * 0.3, 2);
    $('monthly').value = CAR.nice(goal / 15, 2);
    $('apy').value = x.apy;
    $('tax').value = s.tax;
    $('taxLabel').textContent = s.kind === 'capital' ? 'ISR withheld (% of savings a year)' : 'Tax on interest';
    $('taxHint').textContent = s.kind === 'capital' ? 'Withheld on your balance, not on the interest.'
      : s.allowance ? 'Applies above the first ' + CAR.money0(s.allowance) + ' of interest each year.'
      : s.tax > 0 ? 'Withheld by your bank in ' + c.name + '.' : 'Enter your own rate if your interest is taxed.';
    $('exNote').textContent = 'Example numbers for ' + c.name + ' are filled in. Replace them with your own.';
    renderRules();
  }

  // Months until the balance reaches the goal. Interest is credited monthly, tax is taken the
  // country's way, then the deposit is added. Returns null if not reached within 100 years.
  function run(saved, monthly, apy, tax, goal) {
    var s = C().save, r = Math.pow(1 + apy / 100, 1 / 12) - 1;
    var bal = saved, yearInt = 0, totInt = 0, totTax = 0;
    if (bal >= goal) return { months: 0, balance: bal, interest: 0, tax: 0 };
    for (var m = 1; m <= 1200; m++) {
      if ((m - 1) % 12 === 0) yearInt = 0;
      var it = bal * r, tx = 0;
      if (s.kind === 'capital') tx = bal * tax / 100 / 12;
      else {
        var taxable = Math.max(0, yearInt + it - (s.allowance || 0)) - Math.max(0, yearInt - (s.allowance || 0));
        tx = taxable * tax / 100;
      }
      yearInt += it;
      totInt += it; totTax += tx;
      bal = bal + it - tx + monthly;
      if (bal >= goal) return { months: m, balance: bal, interest: totInt, tax: totTax };
    }
    return null;
  }

  function showError(t) { $('msg').textContent = t; $('msg').hidden = false; $('body').hidden = true; }

  function render() {
    var price = num('price'), pct = num('pct'), saved = num('saved'), monthly = num('monthly'), apy = num('apy'), tax = num('tax');
    var goal = price * pct / 100;
    $('goal').textContent = CAR.money0(goal);
    if (!(price > 0)) return showError('Enter the car price to get started.');
    if (saved >= goal) return showError('You already have ' + CAR.money0(saved) + ', which covers the ' + CAR.money0(goal) + ' goal.');
    if (apy < 0 || apy > 60) return showError('Enter a savings rate between 0% and 60%.');
    if (tax < 0 || tax > 60) return showError('Enter a tax rate between 0% and 60%.');
    var res = run(saved, monthly, apy, tax, goal);
    if (!res) return showError('At ' + CAR.money0(monthly) + ' a month you would not reach ' + CAR.money0(goal) + ' in a reasonable time. Raise the monthly amount or lower the car price.');

    var deposits = monthly * res.months, netInt = res.interest - res.tax;
    $('msg').hidden = true;
    $('body').hidden = false;
    $('resBig').textContent = CAR.span(res.months);
    $('resSub').textContent = 'You reach ' + CAR.money0(goal) + ' around ' + CAR.when(res.months) + '.' + (res.tax > 0 ? ' That counts ' + CAR.money0(res.tax) + ' of tax on your savings.' : '');
    $('sGoal').textContent = CAR.money0(goal);
    $('sDep').textContent = CAR.money0(deposits);
    $('sInt').textContent = CAR.money0(Math.max(netInt, 0));
    $('sTax').textContent = CAR.money0(res.tax);

    var total = saved + deposits + Math.max(netInt, 0);
    var pS = saved / total * 100, pD = deposits / total * 100, pI = Math.max(100 - pS - pD, 0);
    $('barP').style.width = pS + '%';
    $('barC').style.width = pD + '%';
    $('barM').style.width = pI + '%';
    $('bar').setAttribute('aria-label', 'Your fund is ' + Math.round(pS) + ' percent money already saved, ' + Math.round(pD) + ' percent new deposits, and ' + Math.round(pI) + ' percent interest');
    $('legP').textContent = 'Already saved ' + CAR.money0(saved);
    $('legC').textContent = 'New deposits ' + CAR.money0(deposits);
    $('legM').textContent = 'Interest ' + CAR.money0(Math.max(netInt, 0));

    var step = CAR.nice(Math.max(monthly, goal / 40) * 0.15, 1);
    var tbody = $('rows');
    tbody.textContent = '';
    [0, step, step * 2, step * 4].forEach(function (d) {
      var mo = monthly + d, q = run(saved, mo, apy, tax, goal);
      var tr = document.createElement('tr');
      if (d === 0) tr.className = 'now';
      [CAR.money0(mo) + (d === 0 ? ' (yours)' : ''), q ? CAR.span(q.months) : 'Over 100 years', q ? CAR.when(q.months) : '-'].forEach(function (txt) {
        var td = document.createElement('td'); td.textContent = txt; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderRules() {
    var c = C();
    var items = [c.save.rule];
    var lending = { CN: 'Since 2024 lenders may finance up to 100% of a private car, so a down payment is no longer legally required, though 15% to 30% is typical.', IN: 'Banks typically finance up to 90% of the on-road price, so you need at least 10% down.', JP: 'There is no legal minimum down payment; about 10% (頭金) is common.', KR: 'There is no legal minimum; some balloon plans need only 1% down, but 10% to 30% is typical.', BR: 'There is no legal minimum; 20% or more down usually gets a better rate.', MX: 'Banks often require 10% to 20% down (enganche); more down lowers the rate.', NG: 'Banks usually require 10% to 30% equity contribution.' };
    if (lending[c.code]) items.push(lending[c.code]);
    $('rules').innerHTML = '<h2>Saving for a car in ' + c.name + '</h2><ul>' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' + CAR.sources(c, 'save');
  }

  ['price', 'saved', 'monthly', 'apy', 'tax'].forEach(function (id) { $(id).addEventListener('input', render); });
  $('pct').addEventListener('change', render);
  CAR.onChange(function () { loadExample(); render(); });
  CAR.init();
})();
