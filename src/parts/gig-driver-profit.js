(function () {
  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  function C() { return CAR.c(); }
  var UK_GALLON = 4.54609;

  function units() {
    var d = C().dist, mi = d.unit === 'mi';
    return {
      dist: mi ? 'miles' : 'km', one: mi ? 'mile' : 'km',
      econ: d.econ === 'mpg' ? 'Fuel economy (MPG)' : d.econ === 'mpgUK' ? 'Fuel economy (MPG, UK gallons)' : d.econ === 'kmL' ? 'Fuel economy (km per litre)' : 'Fuel use (litres per 100 km)',
      fuel: d.fuel === 'gal' ? 'Fuel price per gallon' : 'Fuel price per litre'
    };
  }

  function loadExample() {
    var c = C(), x = c.ex, u = units(), m = c.mileage;
    $('earn').value = x.earn;
    $('hours').value = x.hours;
    $('dist').value = x.dist;
    $('econ').value = x.econ;
    $('fuel').value = x.fuel;
    $('wear').value = x.wear;
    $('tax').value = c.code === 'US' ? 25 : 20;
    $('distLabel').textContent = (c.dist.unit === 'mi' ? 'Miles' : 'Kilometres') + ' driven';
    $('econLabel').textContent = u.econ;
    $('econHint').textContent = c.dist.econ === 'L100' ? 'Lower is better.' : 'Higher is better.';
    $('fuelLabel').textContent = u.fuel;
    $('wearLabel').textContent = 'Other car costs per ' + u.one;
    $('sUnitLabel').textContent = 'Profit per ' + u.one;
    var showRate = m.kind === 'flat' || m.kind === 'tiered';
    $('f-rate').hidden = !showRate;
    if (m.kind === 'flat') { $('rate').value = m.rate; $('rateLabel').textContent = 'Mileage deduction per ' + u.one; $('rateHint').textContent = 'The official rate in ' + c.name + '. It changes over time.'; }
    if (m.kind === 'tiered') { $('rate').value = m.tiers[0].rate; $('rateLabel').textContent = 'Mileage rate, first ' + CAR.num(m.tiers[0].upTo) + ' ' + u.dist + ' a year'; $('rateHint').textContent = 'Then ' + CAR.money(m.tiers[1].rate) + ' per ' + u.one + ' after that.'; }
    $('taxHint').textContent = m.kind === 'none' ? 'Of profit after actual car costs. A rough guess.' : 'Of income after the mileage deduction. A rough guess.';
    $('exNote').textContent = 'Example numbers for one week in ' + c.name + ' are filled in. Replace them with your own.';
    renderRules();
  }

  function litres(dist, econ) {
    var e = C().dist.econ;
    if (e === 'mpg') return dist / econ;            // US gallons, priced per gallon
    if (e === 'mpgUK') return dist / econ * UK_GALLON;
    if (e === 'kmL') return dist / econ;
    return dist * econ / 100;                        // L/100km
  }
  // Deduction for one week, using the country's rule on a full year of the same driving.
  function weeklyDeduction(dist, rate, actualCosts) {
    var m = C().mileage, year = dist * 52, ded;
    if (m.kind === 'flat') ded = year * rate;
    else if (m.kind === 'tiered') { var t = m.tiers; ded = Math.min(year, t[0].upTo) * rate + Math.max(year - t[0].upTo, 0) * t[1].rate; }
    else if (m.kind === 'fr') ded = year <= 5000 ? year * 0.636 : year <= 20000 ? year * 0.357 + 1395 : year * 0.427;
    else return actualCosts;
    return ded / 52;
  }
  function week(o) {
    var fuelCost = litres(o.dist, o.econ) * o.fuel;
    var wearCost = o.dist * o.wear;
    var profit = o.earn - fuelCost - wearCost;
    var taxable = Math.max(o.earn - weeklyDeduction(o.dist, o.rate, fuelCost + wearCost), 0);
    var tax = taxable * o.tax / 100;
    return { fuelCost: fuelCost, wearCost: wearCost, profit: profit, tax: tax, take: profit - tax, hourly: profit / o.hours, gross: o.earn / o.hours, takeHourly: (profit - tax) / o.hours };
  }
  function read() { return { earn: num('earn'), hours: num('hours'), dist: num('dist'), econ: num('econ'), fuel: num('fuel'), wear: num('wear'), tax: num('tax'), rate: num('rate') }; }
  function showError(t) { $('msg').textContent = t; $('msg').hidden = false; $('body').hidden = true; }

  function render() {
    var o = read(), u = units();
    if (!(o.earn > 0)) return showError('Enter what you earned in a typical week.');
    if (!(o.hours > 0)) return showError('Enter the hours you worked in that week.');
    if (!(o.econ > 0)) return showError('Enter your car’s fuel economy.');
    if (o.dist < 0 || o.fuel < 0 || o.wear < 0 || o.rate < 0) return showError('Distance, fuel price, and costs cannot be negative.');
    if (o.tax < 0 || o.tax > 60) return showError('Enter a tax set-aside between 0% and 60%.');
    var r = week(o);
    $('msg').hidden = true;
    $('body').hidden = false;
    $('resBig').textContent = CAR.smoney(r.hourly);
    $('resBig').style.color = r.hourly < 0 ? 'var(--warm)' : '';
    $('resSub').textContent = 'Before costs it looks like ' + CAR.money(r.gross) + ' an hour. After setting aside taxes, about ' + CAR.smoney(r.takeHourly) + ' an hour.';
    $('sProfit').textContent = CAR.smoney0(r.profit);
    $('sUnit').textContent = o.dist > 0 ? CAR.smoney(r.profit / o.dist) : '-';
    $('sTax').textContent = CAR.money0(r.tax);
    $('sTake').textContent = CAR.smoney0(r.take);

    var total = Math.max(o.earn, r.fuelCost + r.wearCost);
    var pP = Math.max(r.profit, 0) / total * 100, pG = r.fuelCost / total * 100, pW = Math.max(100 - pP - pG, 0);
    $('barP').style.width = pP + '%';
    $('barC').style.width = pG + '%';
    $('barM').style.width = pW + '%';
    $('bar').setAttribute('aria-label', Math.round(pP) + ' percent of earnings is profit, ' + Math.round(pG) + ' percent goes to fuel, and ' + Math.round(pW) + ' percent to other car costs');
    $('legP').textContent = 'Profit ' + CAR.smoney0(r.profit);
    $('legC').textContent = 'Fuel ' + CAR.money0(r.fuelCost);
    $('legM').textContent = 'Other car costs ' + CAR.money0(r.wearCost);

    var tbody = $('rows');
    tbody.textContent = '';
    [-0.15, 0, 0.15, 0.3].forEach(function (d) {
      var g = o.fuel * (1 + d);
      var w = week({ earn: o.earn, hours: o.hours, dist: o.dist, econ: o.econ, fuel: g, wear: o.wear, tax: o.tax, rate: o.rate });
      var tr = document.createElement('tr');
      if (d === 0) tr.className = 'now';
      [CAR.money(g) + (d === 0 ? ' (yours)' : ''), CAR.smoney(w.hourly), CAR.smoney0(w.profit)].forEach(function (txt) {
        var td = document.createElement('td'); td.textContent = txt; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderRules() {
    var c = C();
    $('rules').innerHTML = '<h2>Driver tax rules in ' + c.name + '</h2><ul><li>' + c.mileage.rule + '</li><li>Tax rules depend on your situation. Check with a tax professional before you file.</li></ul>' + CAR.sources(c, 'gig');
  }

  ['earn', 'hours', 'dist', 'econ', 'fuel', 'wear', 'tax', 'rate'].forEach(function (id) { $(id).addEventListener('input', render); });
  CAR.onChange(function () { loadExample(); render(); });
  CAR.init();
})();
