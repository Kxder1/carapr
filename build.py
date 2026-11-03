"""Assemble the publishable site in dist/ from src/.

Each page in src/pages keeps its own head, article text and footer. Shared pieces are inlined so the
published site never depends on a separate CSS or JS file (that broke the theme once):
  <!--INLINE:style.css-->   shared styles
  <!--INLINE:site.js-->     Calculators menu
Calculator pages also get:
  the country picker in the header,
  src/parts/<page>.calc.html  replacing <section class="calc"> ... </section> plus the rules panel,
  countries.js + engine.js + src/parts/<page>.js replacing the page's own calculator <script>.
Then for search:
  one landing page per country (src/landing.py), built from the APR calculator with that country preset,
  FAQPage and WebApplication structured data, hreflang for the English regional pages,
  country links in every footer, and a fresh sitemap.xml.
"""
import os, re, shutil, glob, json, html, subprocess, sys
sys.path.insert(0, 'src')
from landing import LANDING, ORDER, CURRENCY

SRC, DIST, SITE = 'src', 'dist', 'https://carapr.org/'
read = lambda p: open(p, encoding='utf-8').read()
esc = lambda t: html.escape(t, quote=False)
css, menu_js = read(f'{SRC}/style.css'), read(f'{SRC}/site.js')
engine = read(f'{SRC}/countries.js') + '\n' + read(f'{SRC}/engine.js')
DATA = json.loads(subprocess.check_output(['node', '-e', 'global.window={};require("./src/countries.js");process.stdout.write(JSON.stringify(window.CAR_DATA))']))

GA4 = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7J51V8CMC3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7J51V8CMC3');
</script>
"""

PICKER = '''<div class="country" translate="no">
      <label class="sr" for="country">Country and currency</label>
      <select id="country" aria-label="Country and currency"><option value="US">United States · USD</option></select>
    </div>
    <div class="menu">'''

COUNTRY_NAV = '<nav class="more" aria-label="By country">\n      <strong>By country</strong>\n      <a href="index.html">United States</a>\n' + \
    ''.join(f'      <a href="{LANDING[c]["file"]}">{LANDING[c]["short"]}</a>\n' for c in ORDER) + '    </nav>'

MADE_BY = '<p class="made">carapr.org is a <a href="https://klauderlabs.com" rel="noopener">KlauderLabs</a> site.</p>'

CALC_PAGES = ['index', 'pay-off-car-loan-early', 'car-loan-refinance', 'negative-equity', 'down-payment-savings', 'gig-driver-profit']


def ldjson(obj):
    return '<script type="application/ld+json">\n' + json.dumps(obj, ensure_ascii=False, indent=1) + '\n</script>\n'


def faq_from_article(s):
    qs = re.findall(r'<details><summary>(.*?)</summary><p>(.*?)</p></details>', s, flags=re.S)
    strip = lambda t: html.unescape(re.sub(r'<[^>]+>', '', t)).strip()
    return [(strip(q), strip(a)) for q, a in qs]


def faq_schema(pairs):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in pairs]}


def app_schema(name, url, desc):
    return {"@context": "https://schema.org", "@type": "WebApplication", "name": name, "url": url, "description": desc,
            "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "isAccessibleForFree": True,
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            "publisher": {"@type": "Organization", "name": "KlauderLabs", "url": "https://klauderlabs.com"}}


def head_meta(s, key):
    if key == 'title':
        return html.unescape(re.search(r'<title>(.*?)</title>', s).group(1))
    return html.unescape(re.search(r'<meta name="description" content="(.*?)">', s).group(1))


def assemble(name, s):
    stem = name[:-5]
    s = s.replace('<head>\n', '<head>\n' + GA4, 1)
    s = s.replace('<!-- After you buy a domain, replace this with your real address. -->\n', '')
    s = s.replace('<!--INLINE:style.css-->', '<style>\n' + css + '</style>')
    s = s.replace('<!--INLINE:site.js-->', '<script>\n' + menu_js + '</script>')
    calc_part, js_part = f'{SRC}/parts/{stem}.calc.html', f'{SRC}/parts/{stem}.js'
    if os.path.exists(calc_part) and os.path.exists(js_part):
        s, n1 = re.subn(r'  <section class="calc".*?</section>\n', lambda m: read(calc_part), s, count=1, flags=re.S)
        assert n1 == 1, name
        idx = s.rfind('<script>')
        end = s.find('</script>', idx) + len('</script>')
        s = s[:idx] + '<script>\n' + engine + '\n</script>\n<script>\n' + read(js_part) + '</script>' + s[end:]
    else:
        # Non-calculator pages still get a working picker that remembers the choice.
        s = s.replace('</body>', '<script>\n' + engine + '\nCAR.init();\n</script>\n</body>', 1)
    s = s.replace('    <div class="menu">', PICKER, 1)
    s, n = re.subn(r'(<nav class="more" aria-label="Calculators">.*?</nav>)', lambda m: m.group(1) + '\n    ' + COUNTRY_NAV, s, count=1, flags=re.S)
    assert n == 1, name
    s, n = re.subn(r'  </div>\n</footer>', '    ' + MADE_BY + '\n  </div>\n</footer>', s, count=1)
    assert n == 1, name
    return s


def add_schema(s, name, url, extra_faq=None):
    """Add FAQPage (if missing) and WebApplication structured data to a calculator page."""
    blocks = ''
    if 'FAQPage' not in s:
        pairs = extra_faq if extra_faq is not None else faq_from_article(s)
        if pairs:
            blocks += ldjson(faq_schema(pairs))
    h1 = html.unescape(re.sub(r'<[^>]+>', '', re.search(r'<h1>(.*?)</h1>', s, flags=re.S).group(1)))
    blocks += ldjson(app_schema(h1, url, head_meta(s, 'description')))
    return s.replace('</head>', blocks + '</head>', 1)


def rules_html(c):
    items = [c['rate']['rule']]
    if c.get('flat'): items.append(c['flatRule'])
    if c.get('vat'): items.append(c['vatRule'])
    if c['balloon'].get('rule'): items.append(c['balloon']['rule'])
    items.append(c['prepay']['rule'])
    items += (c.get('extra') or {}).get('apr', [])
    src = (c['src'].get('apr') or []) + c['src'].get('all', []) + (c['src'].get('payoff') or [])
    seen, links = set(), []
    for t, u in src:
        if u not in seen:
            seen.add(u)
            links.append(f'<a href="{u}" target="_blank" rel="noopener">{esc(t)}</a>')
    return ('    <ul>\n' + ''.join(f'      <li>{esc(t)}</li>\n' for t in items) + '    </ul>\n'
            + f'    <p class="src">Sources: {" · ".join(links)}. Rules checked October 2026.</p>\n')


def currency_list(skip=None):
    items = [('index.html', 'US', 'Car APR calculator in US dollars')] + [(LANDING[c]['file'], c, f'Car APR calculator in {CURRENCY[c]["name"]}' + ('' if CURRENCY[c]['name'] != 'euros' else f' ({DATA[c]["name"]})')) for c in ORDER]
    return '    <ul>\n' + ''.join(f'      <li><a href="{f}">{esc(t)}</a></li>\n' for f, c, t in items if c != skip) + '    </ul>\n'


def currency_section(code):
    c, cur = DATA[code], CURRENCY[code]
    R = c['rate']
    term = R['name'] + (f' ({R["local"]})' if R['local'] and R['local'] != 'reducing balance' else '')
    return (f'    <h2>Car APR calculator in {esc(cur["name"])}</h2>\n'
            f'    <p>This car loan calculator works in {esc(cur["words"])}. Enter the car price, down payment, term and monthly payment in {esc(cur["name"])} '
            f'to find the real interest rate, or enter a rate to get the monthly payment and total interest. '
            f'It is not a currency converter: every amount stays in {esc(cur["name"])}, and the math follows the loan rules in {esc(c["name"])}, '
            f'including the {esc(term)} that lenders there must show.</p>\n\n')


def landing_page(code, base_src):
    L, c = LANDING[code], DATA[code]
    url = SITE + L['file']
    s = base_src
    s = re.sub(r'<title>.*?</title>', f'<title>{esc(L["title"])}</title>', s, count=1)
    s = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{html.escape(L["desc"])}">', s, count=1)
    s = s.replace(f'<link rel="canonical" href="{SITE}">', f'<link rel="canonical" href="{url}">', 1)
    s = re.sub(r'<script type="application/ld\+json">.*?</script>\n', '', s, count=1, flags=re.S)
    s = re.sub(r'<h1>.*?</h1>', f'<h1>{esc(L["h1"])}</h1>', s, count=1, flags=re.S)
    s = re.sub(r'(<section class="hero">\s*<h1>.*?</h1>\s*<p class="lede">).*?(</p>)', lambda m: m.group(1) + esc(L['lede']) + m.group(2), s, count=1, flags=re.S)

    loc = L.get('local')
    art = '  <article class="read">\n'
    if loc:
        art += f'    <section lang="{loc["lang"]}">\n      <h2>{esc(loc["heading"])}</h2>\n' + ''.join(f'      <p>{esc(p)}</p>\n' for p in loc['paras']) + '    </section>\n\n'
    art += currency_section(code)
    art += f'    <h2>Car loan rules in {esc(c["name"])}</h2>\n' + rules_html(c)
    art += ('\n    <h2>How to use this calculator</h2>\n'
            f'    <p>Choose <strong>Find my {esc(c["rate"]["name"])}</strong> and enter the price, your down payment, the term and the monthly payment from your offer. '
            f'The calculator works backward to the {esc(c["rate"]["name"])} that lenders in {esc(c["name"])} must disclose, and shows the same loan as '
            + ('a nominal rate, an effective rate and a flat rate' if c.get('flat') else 'a nominal rate and an effective rate') +
            '. Choose <strong>Find my payment</strong> to turn a quoted rate into a monthly payment. All figures are in '
            f'{esc(c["cur"])} and you can switch country at the top of the page.</p>\n')
    cur = CURRENCY[code]
    cur_q = (f'Can I calculate car loan APR in {cur["name"]}?',
             f'Yes. This page works entirely in {cur["words"]}. Amounts are not converted from dollars; the calculator uses {c["name"]} loan rules and shows results in {cur["name"]}.')
    L = dict(L, faq=[cur_q] + list(L['faq']))
    faqs = list(L['faq'])
    art += '\n    <h2>Frequently asked questions</h2>\n'
    art += ''.join(f'    <details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>\n' for q, a in L['faq'])
    if loc:
        art += ''.join(f'    <details lang="{loc["lang"]}"><summary>{esc(q)}</summary><p>{esc(a)}</p></details>\n' for q, a in loc['faq'])
        faqs += loc['faq']
    art += '\n    <h2>Car APR calculator in other currencies</h2>\n' + currency_list(skip=code)
    art += ('\n    <h2>More car calculators</h2>\n    <ul>\n'
            '      <li><a href="pay-off-car-loan-early.html">Pay off a car loan early</a></li>\n'
            '      <li><a href="car-loan-refinance.html">Car loan refinance calculator</a></li>\n'
            '      <li><a href="negative-equity.html">Negative equity calculator</a></li>\n'
            '      <li><a href="down-payment-savings.html">Down payment savings calculator</a></li>\n'
            '      <li><a href="gig-driver-profit.html">Gig driver profit calculator</a></li>\n'
            '    </ul>\n  </article>')
    s = re.sub(r'  <article class="read">.*?</article>', lambda m: art, s, count=1, flags=re.S)
    # Preset the country before the engine runs.
    assert s.count('<script>\n' + engine) == 1
    s = s.replace('<script>\n' + engine, f'<script>window.CAR_FORCE = "{code}";</script>\n<script>\n' + engine, 1)
    return add_schema(s, L['file'], url, extra_faq=faqs), url


def hreflang_block():
    links = [('en-US', SITE), ('x-default', SITE)] + [(LANDING[c]['hreflang'], SITE + LANDING[c]['file']) for c in ORDER if LANDING[c].get('hreflang')]
    return ''.join(f'<link rel="alternate" hreflang="{h}" href="{u}">\n' for h, u in links)


shutil.rmtree(DIST, ignore_errors=True)
os.makedirs(DIST)
out, urls = {}, []
for path in sorted(glob.glob(f'{SRC}/pages/*.html')):
    name = os.path.basename(path)
    out[name] = assemble(name, read(path))

index_src = out['index.html']   # landing pages start from the finished APR calculator
out['index.html'] = index_src.replace('    <h2>Frequently asked questions</h2>',
    '    <h2>Car APR calculator in your currency</h2>\n'
    '    <p>The calculator works in 13 currencies and follows each country’s own loan rules. Pick your country at the top of the page, or open the page for your currency:</p>\n'
    + currency_list() + '\n    <h2>Frequently asked questions</h2>', 1)
assert out['index.html'] != index_src
for code in ORDER:
    page, url = landing_page(code, index_src)
    out[LANDING[code]['file']] = page

for name, s in list(out.items()):
    stem = name[:-5]
    url = SITE if name == 'index.html' else SITE + name
    if stem in CALC_PAGES:
        s = add_schema(s, name, url)
    if name == 'index.html' or any(LANDING[c]['file'] == name and LANDING[c].get('hreflang') for c in ORDER):
        s = s.replace('</head>', hreflang_block() + '</head>', 1)
    out[name] = s
    open(f'{DIST}/{name}', 'w', encoding='utf-8').write(s)

# sitemap: home first, then calculators, country pages, info pages
order = ['index.html'] + [p + '.html' for p in CALC_PAGES[1:]] + [LANDING[c]['file'] for c in ORDER] + ['about.html', 'privacy.html', 'contact.html']
assert set(order) == set(out), set(out) ^ set(order)
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
sm += ''.join(f'  <url><loc>{SITE if n == "index.html" else SITE + n}</loc></url>\n' for n in order) + '</urlset>\n'
open(f'{DIST}/sitemap.xml', 'w', encoding='utf-8').write(sm)

for f in ['robots.txt', 'ads.txt', 'favicon.ico', 'favicon.svg', 'favicon-48.png', 'apple-touch-icon.png', 'icon-192.png']:
    shutil.copy(f, f'{DIST}/{f}')
print('built', len(os.listdir(DIST)), 'files')
