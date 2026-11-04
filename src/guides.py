# In-depth guides. Every figure in a worked example was calculated with the same formulas the
# calculators use (see how-we-calculate.html). Recheck the numbers if you edit an example.

REVIEWED = "November 3, 2026"

GUIDES = [
{
"slug": "apr-vs-interest-rate",
"title": "APR vs Interest Rate on a Car Loan: What the Difference Costs You",
"desc": "The interest rate and the APR on a car loan are not the same number. See how fees and compounding change the APR, with worked examples.",
"h1": "APR vs interest rate on a car loan",
"lede": "Two numbers show up on almost every car loan offer. They sound alike, but they answer different questions, and the gap between them is usually fees.",
"calc": "index.html",
"body": """
<h2>The short answer</h2>
<p>The <strong>interest rate</strong> decides how much interest is added to your balance each month. The <strong>APR</strong> (annual percentage rate) starts from the same rate and adds the lender’s required fees, then expresses the total cost as one yearly rate. If a loan has no fees, the two are equal. If it has fees, the APR is higher, and the APR is the number to compare between lenders.</p>

<h2>A worked example</h2>
<p>Say you borrow <strong>$25,000</strong> for <strong>60 months</strong> at a <strong>7.00%</strong> interest rate.</p>
<ul>
  <li>Monthly payment: <strong>$495.03</strong></li>
  <li>Total interest over five years: <strong>$4,701.80</strong></li>
</ul>
<p>Now suppose the lender charges a <strong>$500</strong> origination fee and takes it out of the money you receive. Your payment is still $495.03, because it is based on the full $25,000. But you only got $24,500 to spend. Paying $495.03 a month for 60 months on $24,500 works out to an APR of <strong>7.85%</strong>. Same loan, same payment, almost a full point higher once the fee is counted.</p>
<p>If the fee is added to the loan instead, you borrow $25,500, your payment rises to $504.93, and the APR on the $25,000 you actually needed is <strong>7.83%</strong>. Either way, the fee shows up in the APR.</p>

<h2>Why the APR can differ between countries</h2>
<p>Countries do not all calculate APR the same way.</p>
<ul>
  <li><strong>United States and Canada:</strong> the APR is a nominal rate, the monthly rate times 12. A 7% loan has a 7% APR if there are no fees.</li>
  <li><strong>United Kingdom and the EU:</strong> the APR (called the APRC, TAEG in France or effektiver Jahreszins in Germany) is an effective rate that compounds the monthly rate. The same 7% nominal loan shows an APR of about <strong>7.23%</strong>.</li>
  <li><strong>Mexico and Brazil:</strong> lenders must show an all-in effective cost (the CAT in Mexico, the CET in Brazil) that includes fees, insurance and, in Brazil, the IOF tax.</li>
</ul>
<p>That is why the same offer can look a little different depending on where it was quoted. Compare APRs calculated the same way, ideally from the same country.</p>

<h2>What counts toward the APR</h2>
<p>Rules vary, but the APR usually includes interest, origination or arrangement fees, and any insurance the lender requires. It usually leaves out government charges such as title, registration and taxes, and optional products you choose to buy. If a dealer adds an extended warranty or GAP coverage to the loan, those raise your amount financed and your payment even though they may not show up in the APR, so read the itemized amount financed too.</p>

<h2>How to use this when you shop</h2>
<ol>
  <li>Ask every lender for the APR on the same amount and term.</li>
  <li>If you only know the monthly payment, enter it in the <a href="index.html">car APR calculator</a> with the price, down payment, term and any fees to find the real APR.</li>
  <li>Compare total cost too. A lower APR on a longer term can still cost more in total interest.</li>
</ol>
"""
},
{
"slug": "is-zero-percent-financing-worth-it",
"title": "Is 0% Car Financing Really Free? When a Rebate Is the Better Deal",
"desc": "0% financing can cost more than taking a cash rebate and a normal loan, and some 0% deals hide the interest in fees. Worked examples show how to compare.",
"h1": "Is 0% car financing really free?",
"lede": "A 0% offer means no interest, but not always the lowest cost. Often you give up a cash rebate to get it, and in some markets the interest is simply renamed as a fee.",
"calc": "index.html",
"body": """
<h2>The trade-off most 0% deals hide</h2>
<p>Car makers often let you choose between <strong>0% financing</strong> and a <strong>cash rebate</strong> with a normal loan, but not both. The rebate lowers the price, so it can be worth more than the interest you save.</p>

<h2>A worked example</h2>
<p>A car costs <strong>$30,000</strong>. You can pick either deal for a 60-month loan.</p>
<table class="guide">
  <thead><tr><th>Option</th><th>Amount financed</th><th>Monthly payment</th><th>Total you pay</th></tr></thead>
  <tbody>
    <tr><td>0% financing</td><td>$30,000</td><td>$500.00</td><td>$30,000</td></tr>
    <tr><td>$3,000 rebate + 6% loan</td><td>$27,000</td><td>$521.99</td><td>$31,319</td></tr>
  </tbody>
</table>
<p>Here 0% wins by about $1,319. But the answer depends on the rate you can get. At about <strong>4.23%</strong>, the two options cost the same. If your bank or credit union offers less than that, take the rebate and their loan.</p>

<h2>“0% interest” with a fee is not 0%</h2>
<p>In some markets, especially China, dealer and captive finance deals advertise 0% interest but charge a handling fee (手续费). The fee works exactly like interest paid up front.</p>
<p>Example: borrow <strong>¥100,000</strong> for <strong>36 months</strong> at “0%” with an <strong>8% handling fee</strong> (¥8,000). Your payments total ¥100,000, but you only had the use of ¥92,000. That is a real annualized rate of about <strong>5.49%</strong>. Since August 2026, Chinese lenders must show this total annualized financing cost, so ask for it.</p>

<h2>Other catches to check</h2>
<ul>
  <li><strong>Short terms.</strong> 0% deals are often limited to 36 to 60 months, which means higher payments.</li>
  <li><strong>Credit requirements.</strong> The best offers usually need top credit. Ask what rate you actually qualify for.</li>
  <li><strong>Price negotiation.</strong> A dealer may be less flexible on price when you take the subsidized rate. Negotiate the price first, then talk financing.</li>
  <li><strong>Add-ons.</strong> Warranties and protection packages added to a 0% loan are not free just because the rate is 0%.</li>
</ul>

<h2>How to compare</h2>
<p>Get a pre-approved rate from a bank or credit union first. Then run both options through the <a href="index.html">car APR calculator</a> in “Find my payment” mode and compare the total you pay. If a 0% deal includes a fee, enter it in the fees box and the calculator shows the true rate.</p>
"""
},
{
"slug": "flat-rate-vs-reducing-rate",
"title": "Flat Rate vs Reducing Rate: How to Convert a Car Loan Quote",
"desc": "A flat interest rate looks about half the size of the real reducing-balance rate. See the conversion with worked EMI examples and a quick table.",
"h1": "Flat rate vs reducing rate on a car loan",
"lede": "Some lenders, especially in India and Nigeria, quote car loans as a flat rate. It looks cheap because it is a different kind of number, not a better deal.",
"calc": "india-car-loan-emi-calculator.html",
"body": """
<h2>The difference</h2>
<p>A <strong>reducing-balance rate</strong> charges interest only on what you still owe. As you repay, the interest each month gets smaller. This is how banks normally quote loans and how APR is calculated.</p>
<p>A <strong>flat rate</strong> charges interest on the full original amount for the whole term, even though you are paying it back every month. Halfway through the loan you owe about half, but you are still paying interest as if you owed all of it.</p>

<h2>A worked example</h2>
<p>A lender offers <strong>₹5,00,000</strong> for <strong>5 years</strong> at <strong>7% flat</strong>.</p>
<ul>
  <li>Interest: ₹5,00,000 × 7% × 5 years = ₹1,75,000</li>
  <li>EMI: (₹5,00,000 + ₹1,75,000) ÷ 60 = <strong>₹11,250</strong></li>
</ul>
<p>Paying ₹11,250 a month for 60 months on ₹5,00,000 is the same as a reducing-balance rate of <strong>12.50%</strong>. The “7%” loan really costs 12.5% a year.</p>

<h2>Quick conversion table</h2>
<table class="guide">
  <thead><tr><th>Flat rate</th><th>Term</th><th>Real reducing rate</th></tr></thead>
  <tbody>
    <tr><td>5%</td><td>5 years</td><td>9.15%</td></tr>
    <tr><td>7%</td><td>3 years</td><td>12.83%</td></tr>
    <tr><td>7%</td><td>5 years</td><td>12.50%</td></tr>
    <tr><td>8%</td><td>5 years</td><td>14.13%</td></tr>
    <tr><td>10%</td><td>5 years</td><td>17.27%</td></tr>
  </tbody>
</table>
<p>A useful rule of thumb: the real rate is roughly <strong>1.75 to 1.85 times</strong> the flat rate. Use the calculator for the exact figure.</p>

<h2>What the rules say</h2>
<p>In India, banks and NBFCs must give you a Key Facts Statement showing the annual percentage rate on a reducing basis, including fees, before you sign. In Nigeria, banks must disclose the total cost of credit. If you are quoted only a flat rate, ask for the APR in writing.</p>

<h2>Convert your own quote</h2>
<p>Open the <a href="india-car-loan-emi-calculator.html">car loan EMI calculator</a> (or the <a href="nigeria-car-loan-calculator.html">Nigeria calculator</a>), choose “Find my EMI”, set the rate type to “Flat rate”, and enter your quote. It shows the EMI and the true reducing-balance rate.</p>
"""
},
{
"slug": "how-pcp-and-balloon-finance-work",
"title": "How PCP and Balloon Car Finance Work: Lower Payments, Higher Cost",
"desc": "PCP, balloon loans and residual-value finance lower your monthly payment by leaving a large final payment. A worked example shows the real cost.",
"h1": "How PCP and balloon car finance work",
"lede": "PCP in the UK, Ballonfinanzierung in Germany, 残価設定ローン in Japan and 유예할부 in Korea all work the same way: smaller monthly payments now, a large payment at the end.",
"calc": "uk-car-finance-apr-calculator.html",
"body": """
<h2>The basic idea</h2>
<p>With a normal loan (hire purchase in the UK), your monthly payments pay off the whole amount. With balloon finance, part of the price is set aside as a <strong>final payment</strong>, often based on what the car should be worth at the end. You only pay down the rest each month, so payments are lower. At the end you pay the balloon, refinance it, or, on UK PCP and Japanese residual-value loans, hand the car back.</p>

<h2>A worked example</h2>
<p>A <strong>£30,000</strong> car with a <strong>£3,000</strong> deposit, financed for <strong>48 months</strong> at <strong>8.9% APR</strong>:</p>
<table class="guide">
  <thead><tr><th></th><th>Hire purchase</th><th>PCP with £12,000 final payment</th></tr></thead>
  <tbody>
    <tr><td>Monthly payment</td><td>£666.22</td><td>£455.69</td></tr>
    <tr><td>Final payment</td><td>none</td><td>£12,000</td></tr>
    <tr><td>Total repaid</td><td>£31,979</td><td>£33,873</td></tr>
    <tr><td>Interest</td><td>£4,979</td><td>£6,873</td></tr>
  </tbody>
</table>
<p>The PCP payment is about £210 a month lower, but if you keep the car and pay the final payment, it costs about <strong>£1,894 more</strong> in interest. You pay interest on the £12,000 balloon for the whole four years, because you never pay it down.</p>

<h2>When balloon finance makes sense</h2>
<ul>
  <li>You plan to change cars every few years and expect to hand the car back or part-exchange it.</li>
  <li>You can afford the final payment, or the car’s guaranteed value covers it.</li>
  <li>You stay within the mileage limit and keep the car in good condition, so there are no charges at the end.</li>
</ul>

<h2>The risks</h2>
<ul>
  <li><strong>Higher total cost</strong> if you keep the car, as the example shows.</li>
  <li><strong>Negative equity:</strong> the balance stays high until the end, so for most of the loan you owe more than the car is worth. See the <a href="negative-equity.html">negative equity calculator</a>.</li>
  <li><strong>Mileage and damage charges</strong> if you hand the car back.</li>
</ul>

<h2>UK only: voluntary termination</h2>
<p>On UK PCP and hire purchase, you can end the agreement and return the car once you have paid half the total amount payable (Consumer Credit Act s.99). In the example, the total amount payable including the deposit is £36,873, so the halfway point is £18,436.49, which you reach after about 34 payments. The <a href="negative-equity.html">negative equity calculator</a> shows how far you are from it.</p>

<h2>Work out your own deal</h2>
<p>Enter the final payment in the “final payment” box of the <a href="index.html">APR calculator</a>. It shows the monthly payment and the APR with the balloon included.</p>
"""
},
{
"slug": "how-long-should-a-car-loan-be",
"title": "How Long Should a Car Loan Be? 36 vs 60 vs 84 Months Compared",
"desc": "A longer car loan lowers the payment but raises total interest and the risk of owing more than the car is worth. Compare 36 to 84 months with real numbers.",
"h1": "How long should a car loan be?",
"lede": "Stretching a loan is the easiest way to make a car look affordable. Here is what each extra year costs.",
"calc": "index.html",
"body": """
<h2>Same loan, different lengths</h2>
<p>Borrowing <strong>$35,000</strong> at <strong>6.5%</strong>:</p>
<table class="guide">
  <thead><tr><th>Term</th><th>Monthly payment</th><th>Total interest</th></tr></thead>
  <tbody>
    <tr><td>36 months</td><td>$1,072.72</td><td>$3,618</td></tr>
    <tr><td>48 months</td><td>$830.02</td><td>$4,841</td></tr>
    <tr><td>60 months</td><td>$684.82</td><td>$6,089</td></tr>
    <tr><td>72 months</td><td>$588.35</td><td>$7,361</td></tr>
    <tr><td>84 months</td><td>$519.73</td><td>$8,657</td></tr>
  </tbody>
</table>
<p>Going from 60 to 84 months saves about $165 a month but adds about <strong>$2,568</strong> of interest.</p>

<h2>Longer loans usually cost a higher rate too</h2>
<p>The table uses one rate for every term to keep the comparison fair. In practice, lenders usually charge more for longer terms. At 6.0% over 48 months the interest is <strong>$4,455</strong>; at 7.5% over 84 months it is <strong>$10,095</strong>, more than double.</p>

<h2>The negative equity problem</h2>
<p>Cars lose value fastest in the first years. On a long loan the balance falls slowly, so you can spend years owing more than the car is worth. That matters if the car is written off or you need to sell. Check your own situation with the <a href="negative-equity.html">negative equity calculator</a>.</p>

<h2>A practical rule</h2>
<ul>
  <li>Choose the shortest term whose payment fits comfortably in your budget.</li>
  <li>If only a 72 or 84-month loan makes the payment work, consider a cheaper car or a bigger down payment. The <a href="down-payment-savings.html">down payment calculator</a> shows how long that takes to save.</li>
  <li>If you take a long loan, plan to pay extra when you can. The <a href="pay-off-car-loan-early.html">pay off early calculator</a> shows how much that saves.</li>
</ul>
"""
},
{
"slug": "when-does-refinancing-a-car-loan-pay-off",
"title": "When Does Refinancing a Car Loan Pay Off? Break-Even Explained",
"desc": "Refinancing saves money when the new rate is lower and the term does not stretch. A worked example shows the savings, the break-even point and the common trap.",
"h1": "When does refinancing a car loan pay off?",
"lede": "Refinancing replaces your loan with a cheaper one. It can save real money, or barely anything, depending on one choice.",
"calc": "car-loan-refinance.html",
"body": """
<h2>A worked example</h2>
<p>You owe <strong>$20,000</strong> with <strong>40 months</strong> left at <strong>11%</strong>. A credit union offers <strong>7%</strong>, with <strong>$150</strong> in fees.</p>
<table class="guide">
  <thead><tr><th></th><th>Keep current loan</th><th>Refinance, 40 months</th><th>Refinance, 60 months</th></tr></thead>
  <tbody>
    <tr><td>Monthly payment</td><td>$599.52</td><td>$562.05</td><td>$396.02</td></tr>
    <tr><td>Total you pay, incl. fees</td><td>$23,981</td><td>$22,632</td><td>$23,911</td></tr>
    <tr><td>Saving</td><td>-</td><td>$1,349</td><td>$69</td></tr>
  </tbody>
</table>
<p>Keeping the same 40-month term saves about <strong>$1,349</strong>, and the $150 in fees is paid back by the lower payment in about <strong>4 months</strong>.</p>
<p>Stretching to 60 months drops the payment by over $200, which feels like a big win, but the extra 20 months of interest wipe out almost all the saving: just <strong>$69</strong> over the life of the loan.</p>

<h2>When refinancing is worth it</h2>
<ul>
  <li>Your credit score has improved since you took the loan.</li>
  <li>Rates have fallen, or the dealer’s loan was marked up above what you qualified for.</li>
  <li>There is plenty of time and balance left; refinancing in the last year saves little.</li>
  <li>You keep the term the same or shorter.</li>
</ul>

<h2>Costs to include</h2>
<ul>
  <li>New loan fees, such as application or title transfer fees.</li>
  <li>An early repayment fee on your current loan. In the UK and EU it is capped at 1% of the amount repaid (0.5% with a year or less left). In India, fixed-rate car loans often carry 2% to 5%. In the US and Canada most car loans have none.</li>
</ul>

<h2>Run your own numbers</h2>
<p>The <a href="car-loan-refinance.html">refinance calculator</a> compares your current loan with an offer, includes both kinds of fees, and shows the break-even point in months.</p>
"""
},
{
"slug": "how-to-get-out-of-negative-equity",
"title": "How to Get Out of Negative Equity on a Car Loan",
"desc": "Owing more than your car is worth is common in the first years of a loan. Learn why it happens, what rolling it into a new loan costs, and how to get out.",
"h1": "How to get out of negative equity on a car loan",
"lede": "Negative equity, being underwater or upside down, means you owe more on the loan than the car is worth. It is common, and usually temporary if you handle it carefully.",
"calc": "negative-equity.html",
"body": """
<h2>Why it happens</h2>
<p>New cars lose value fastest in the first year or two. In the same period, most of your payment goes to interest, so the balance falls slowly. A small down payment, a long term or a balloon payment make the gap bigger.</p>

<h2>The expensive way out: rolling it into the next loan</h2>
<p>Dealers will often add what you still owe to your next loan. Here is what that costs on a <strong>$35,000</strong> car at <strong>7.5%</strong> over <strong>72 months</strong>:</p>
<table class="guide">
  <thead><tr><th></th><th>No negative equity</th><th>$5,000 rolled in</th></tr></thead>
  <tbody>
    <tr><td>Amount financed</td><td>$35,000</td><td>$40,000</td></tr>
    <tr><td>Monthly payment</td><td>$605.15</td><td>$691.60</td></tr>
    <tr><td>Total interest</td><td>$8,571</td><td>$9,796</td></tr>
  </tbody>
</table>
<p>The $5,000 gap ends up costing <strong>$6,224</strong> in extra payments, and you start the new loan even further underwater.</p>

<h2>Better ways out</h2>
<ol>
  <li><strong>Keep the car and keep paying.</strong> The balance falls every month, and the car loses value more slowly as it ages. Most loans reach break-even on their own. The <a href="negative-equity.html">negative equity calculator</a> estimates when.</li>
  <li><strong>Pay extra toward the principal.</strong> Even small extra payments move break-even closer. See the <a href="pay-off-car-loan-early.html">pay off early calculator</a>.</li>
  <li><strong>Refinance to a lower rate</strong> if your credit has improved, though lenders may limit loans larger than the car’s value. Try the <a href="car-loan-refinance.html">refinance calculator</a>.</li>
  <li><strong>Sell privately</strong> rather than trading in, since private sales usually get more, and pay the gap in cash.</li>
  <li><strong>UK only:</strong> on hire purchase and PCP, you can hand the car back once you have paid half the total amount payable (voluntary termination), even if you are underwater.</li>
</ol>

<h2>Protect yourself while you are underwater</h2>
<p>If the car is written off, insurance pays its value, not your balance. GAP coverage pays the difference. It is optional, so compare the price from your insurer with the dealer’s before buying it.</p>
"""
},
{
"slug": "how-to-read-a-car-loan-offer",
"title": "How to Read a Car Loan Offer: Every Number Explained",
"desc": "Amount financed, APR, finance charge, total of payments, add-ons and rate markups: what each line on a car loan offer means and what to check.",
"h1": "How to read a car loan offer",
"lede": "A car loan offer has a handful of numbers that tell you almost everything. Here is what each one means, using a real example, and the places costs hide.",
"calc": "index.html",
"body": """
<h2>The key numbers</h2>
<p>Take a <strong>$30,000</strong> loan at <strong>6.9% APR</strong> for <strong>72 months</strong>. A US offer shows these in a Truth in Lending box; other countries use similar disclosures.</p>
<table class="guide">
  <thead><tr><th>Line</th><th>Example</th><th>What it means</th></tr></thead>
  <tbody>
    <tr><td>Amount financed</td><td>$30,000.00</td><td>The money you are borrowing, after your down payment</td></tr>
    <tr><td>APR</td><td>6.9%</td><td>The yearly cost of the loan, including lender fees</td></tr>
    <tr><td>Monthly payment</td><td>$510.03</td><td>What you pay each month for 72 months</td></tr>
    <tr><td>Finance charge</td><td>$6,722.22</td><td>Everything the loan costs you in interest and lender fees</td></tr>
    <tr><td>Total of payments</td><td>$36,722.22</td><td>Amount financed plus finance charge</td></tr>
  </tbody>
</table>
<p>Check that they add up: the monthly payment times the number of payments should equal the total of payments. If it does not, ask why.</p>

<h2>Where extra costs hide</h2>
<h3>Rate markups</h3>
<p>When a dealer arranges your loan, it can add a markup on top of the rate the lender approved you for. On this loan, a rate 2 points higher (8.9%) raises the payment to $539.28 and costs <strong>$2,106</strong> more over the term. A pre-approval from a bank or credit union tells you what rate you really qualify for.</p>
<h3>Add-ons in the amount financed</h3>
<p>Extended warranties, GAP coverage, paint protection and service plans are often added to the loan. Adding <strong>$3,300</strong> of products raises the payment to $566.13 and costs <strong>$4,039</strong> more in total, because you pay interest on them too. Ask for an itemized list and remove anything you did not choose.</p>
<h3>Fees</h3>
<p>Documentation, origination or arrangement fees may be added to the loan or deducted from it. Either way they belong in the APR, so compare APRs, not just rates.</p>
<h3>Payment-only selling</h3>
<p>“What monthly payment are you looking for?” lets a seller hit your number by stretching the term or adding products. Negotiate the car’s price first, then the financing.</p>

<h2>Check any offer</h2>
<p>Enter the price, down payment, term and monthly payment from the offer in the <a href="index.html">car APR calculator</a>. If the APR it finds is higher than the one quoted, something has been added. The <a href="how-we-calculate.html">How we calculate</a> page explains the math.</p>
"""
},
]
