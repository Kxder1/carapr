# Trust pages: methodology and editorial policy. Built from the About page template.

TRUST = [
{
"slug": "how-we-calculate",
"title": "How We Calculate: Car Loan Formulas and Sources",
"desc": "The formulas behind every carapr.org calculator: loan payments, APR, effective rates, flat-rate conversion, Mexico’s CAT with IVA, Brazil’s CET and IOF, and savings tax.",
"h1": "How we calculate",
"lede": "Every calculator on carapr.org uses standard loan math that you can check by hand. This page lists the formulas, the assumptions, and where the country rules come from.",
"body": """
<h2>Monthly payment</h2>
<p>All loans are calculated with monthly payments of equal size. For an amount <em>L</em>, a monthly rate <em>r</em> and <em>n</em> months:</p>
<div class="formula" tabindex="0">payment = L × r ÷ (1 − (1 + r)<sup>−n</sup>)</div>
<p>When the loan has a final balloon payment <em>B</em> (PCP, residual-value or deferred installment plans), its present value is taken off first:</p>
<div class="formula" tabindex="0">payment = (L − B × (1 + r)<sup>−n</sup>) × r ÷ (1 − (1 + r)<sup>−n</sup>)</div>

<h2>Finding the rate from a payment</h2>
<p>There is no simple formula for the rate when you know the payment, so the calculator searches for it. It tests rates between 0% and 100% a month, halving the range 200 times, until the payments (plus any balloon) are worth exactly the amount you received. That is accurate to far more decimal places than any lender shows.</p>
<p>Fees deducted from the loan are handled by lowering the amount received, which is how APR rules treat them.</p>

<h2>Nominal and effective rates</h2>
<ul>
  <li><strong>Nominal:</strong> monthly rate × 12. Used for the APR in the United States and Canada, the 実質年率 in Japan, and the rates quoted in South Korea, China, India and Nigeria.</li>
  <li><strong>Effective:</strong> (1 + monthly rate)<sup>12</sup> − 1. Used for the APR in the United Kingdom, the APRC across the EU (TAEG in France, effektiver Jahreszins in Germany), the CAT in Mexico and the CET in Brazil.</li>
</ul>
<p>The calculator always shows both, so you can compare offers from different countries.</p>

<h2>Flat rates</h2>
<p>A flat rate charges interest on the original amount for the whole term:</p>
<div class="formula" tabindex="0">payment = L × (1 + flat rate × years) ÷ n</div>
<p>The calculator then finds the reducing-balance rate that gives the same payment, using the search above.</p>

<h2>Country-specific rules</h2>
<ul>
  <li><strong>Mexico:</strong> 16% IVA is charged on interest, so the monthly rate used for the payment is the stated rate × 1.16. The CAT is calculated from the payments with IVA removed, as Banxico requires.</li>
  <li><strong>Brazil:</strong> rates are entered per month. The CET is the effective annual rate including fees. The IOF estimate is 0.38% of the amount plus 0.0082% a day on each repayment of principal, counting at most 365 days.</li>
  <li><strong>United Kingdom and EU:</strong> early repayment charges are capped at 1% of the amount repaid early (0.5% with 12 months or less left) and at the interest saved. In the UK no charge applies to £8,000 or less in 12 months, and in France to €10,000 or less.</li>
  <li><strong>United Kingdom:</strong> the voluntary termination point is half the total amount payable.</li>
</ul>

<h2>Savings, depreciation and driving costs</h2>
<ul>
  <li><strong>Savings:</strong> interest is credited monthly at (1 + yearly rate)<sup>1/12</sup> − 1. Tax is taken on interest above any yearly allowance (Germany, UK), or as a yearly percentage of the balance in Mexico, where ISR is withheld on capital.</li>
  <li><strong>Car value:</strong> the negative equity calculator reduces the value each month at the yearly rate you enter, compounded.</li>
  <li><strong>Gig driving:</strong> fuel used is distance ÷ economy (or distance × litres per 100 km ÷ 100). UK miles per gallon use the imperial gallon of 4.54609 litres. Mileage deductions use the official rate where one exists (IRS in the US, HMRC in the UK, €0.30/km in Germany, the barème kilométrique in France) and actual costs elsewhere.</li>
</ul>

<h2>Where the rules come from</h2>
<p>Country rules were checked in October 2026 against official sources, including the CFPB and IRS (United States), FCA, legislation.gov.uk and HMRC (United Kingdom), Canada’s Cost of Borrowing Regulations and Bank Act, German and French law, Banco Central do Brasil, Banxico, the Reserve Bank of India, the People’s Bank of China, and Korean and Japanese regulators. Each calculator lists the sources for the country you pick.</p>
<p>Example figures such as typical car prices, loan rates and fuel prices are estimates from market data and are labeled as examples.</p>

<h2>Limits</h2>
<p>Real loans can differ slightly: an odd first-payment date, daily interest, rounding, or add-ons can shift the numbers. Your lender’s disclosure is the official figure. Nothing here is financial, legal or tax advice.</p>
"""
},
{
"slug": "editorial-policy",
"title": "Editorial Policy: How carapr.org Content Is Made and Checked",
"desc": "How carapr.org researches, writes, checks and updates its calculators and guides, how corrections work, and how advertising is kept separate.",
"h1": "Editorial policy",
"lede": "carapr.org exists to help people understand what a car loan really costs. These are the rules we follow to keep the calculators and guides accurate and useful.",
"body": """
<h2>Accuracy first</h2>
<ul>
  <li>Every calculator uses the standard formulas described on <a href="how-we-calculate.html">How we calculate</a>.</li>
  <li>Every worked example in a guide is calculated with those same formulas, not estimated.</li>
  <li>Country rules are checked against official sources such as regulators, legislation and tax authorities, and each one is linked from the calculator.</li>
  <li>Figures that are estimates, such as typical prices and rates, are labeled as examples.</li>
</ul>

<h2>How content is made</h2>
<p>Content is researched and written by KlauderLabs. We use software tools, including AI tools, to help research, draft and check the math. Every rule is checked against the cited sources and every calculation is tested before it is published.</p>

<h2>Reviews and updates</h2>
<p>Each page shows when it was last reviewed. Rules that change on a schedule, such as the US IRS mileage rate each January and France’s usury rate each quarter, are checked when they change. All country rules are reviewed at least once a year.</p>

<h2>Independence</h2>
<ul>
  <li>carapr.org is not a lender, broker or dealer, and does not recommend specific lenders.</li>
  <li>The site is funded by advertising. Advertisers have no say over calculators or guides, and ads never change a result.</li>
  <li>Nothing on the site is financial, legal or tax advice. Your lender’s disclosures are the official figures.</li>
</ul>

<h2>Corrections</h2>
<p>If a number looks wrong or a rule has changed, email <strong>contact@carapr.org</strong> with the page and the inputs you used. We check every report and fix confirmed errors as soon as possible, updating the page’s review date.</p>
"""
},
]

ABOUT_EXTRA = """
    <h2>Who runs carapr.org</h2>
    <p>carapr.org is built and maintained by <a href="https://klauderlabs.com">KlauderLabs</a>, a small independent web publisher in the United States that makes free, practical tools. KlauderLabs also runs <a href="https://techthings.cc">Tech Things</a>.</p>
    <p>The site started with one question: when a dealer quotes a monthly payment, what is the real rate? It grew into six calculators and a set of guides that work in 13 currencies and follow each country’s own loan rules, because a car loan in Mexico, India or the UK is calculated differently from one in the United States.</p>

    <h2>How we keep it accurate</h2>
    <p>Every formula is published on <a href="how-we-calculate.html">How we calculate</a>, every country rule links to its official source, and every page shows when it was last reviewed. Our <a href="editorial-policy.html">editorial policy</a> explains how content is checked and corrected. Spot a mistake? Email contact@carapr.org.</p>
"""
