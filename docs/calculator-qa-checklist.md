# Calculator QA Checklist

Use this document for manual release QA of every calculator registered in both
`src/data/content.ts` and `src/data/calculators.ts`.

## QA Run Details

- Tester:
- Date:
- Branch or build:
- Browser and version:
- Mobile device or viewport:
- Desktop viewport:
- Local or deployed base URL:

## Standard Test Procedure

For every calculator:

1. Load the URL directly and confirm there are no console errors.
2. Calculate with the default values and record the inputs and expected results.
3. Independently verify the formulas with a spreadsheet or trusted calculation.
4. Test zero values, boundaries, blank optional fields, invalid values, and unusually large values where applicable.
5. Confirm failed validation does not update results or fire GA4.
6. Confirm one successful submission fires exactly one GA4 `calculate` event.
7. Test at a narrow mobile viewport and at a desktop viewport.
8. Test both light and dark themes, including inputs, errors, warnings, result cards, FAQs, links, header, and footer.
9. Open every related calculator link and confirm it resolves correctly.
10. Confirm the document title, meta description, canonical URL, and single `<h1>` are correct.

## Master Registry

Registry audit performed against the current local files. All 53 calculator
URLs appear in both registries.

| # | Calculator | URL | Content ID | Config ID | Registry status |
|---:|---|---|---|---|---|
| 1 | Compound Interest Calculator | `/calculators/compound-interest/` | `compound-interest-calculator` | `compound-interest` | Matched |
| 2 | Savings Rate Calculator | `/calculators/savings-rate/` | `savings-rate-calculator` | `savings-rate` | Matched |
| 3 | FIRE Calculator | `/calculators/fire-calculator/` | `fire-calculator` | `fire` | Matched |
| 4 | Coast FIRE Calculator | `/calculators/coast-fire-calculator/` | `coast-fire-calculator` | `coast-fire` | Matched |
| 5 | 4% Rule Calculator | `/calculators/4-percent-rule-calculator/` | `four-percent-rule-calculator` | `four-percent-rule` | Matched |
| 6 | Retirement Withdrawal Calculator | `/calculators/retirement-withdrawal-calculator/` | `retirement-withdrawal-calculator` | `retirement-withdrawal` | Matched |
| 7 | Rule of 72 Calculator | `/calculators/rule-of-72-calculator/` | `rule-of-72-calculator` | `rule-of-72` | Matched |
| 8 | Inflation Calculator | `/calculators/inflation-calculator/` | `inflation-calculator` | `inflation` | Matched |
| 9 | Expense Ratio Calculator | `/calculators/expense-ratio-calculator/` | `expense-ratio-calculator` | `expense-ratio` | Matched |
| 10 | Investment Fee Calculator | `/calculators/investment-fee-calculator/` | `investment-fee-calculator` | `investment-fee` | Matched |
| 11 | Net Worth Calculator | `/calculators/net-worth-calculator/` | `net-worth-calculator` | `net-worth` | Matched |
| 12 | CAGR Calculator | `/calculators/cagr-calculator/` | `cagr-calculator` | `cagr` | Matched |
| 13 | ETF Fee Drag Calculator | `/calculators/etf-fee-drag-calculator/` | `etf-fee-drag-calculator` | `etf-fee-drag` | Matched |
| 14 | Dividend Yield Calculator | `/calculators/dividend-yield-calculator/` | `dividend-yield-calculator` | `dividend-yield` | Matched |
| 15 | Dividend Growth Calculator | `/calculators/dividend-growth-calculator/` | `dividend-growth-calculator` | `dividend-growth` | Matched |
| 16 | DRIP Calculator | `/calculators/drip-calculator/` | `drip-calculator` | `drip` | Matched |
| 17 | Lump Sum vs DCA Calculator | `/calculators/lump-sum-vs-dca-calculator/` | `lump-sum-vs-dca-calculator` | `lump-sum-vs-dca` | Matched |
| 18 | Emergency Fund Calculator | `/calculators/emergency-fund-calculator/` | `emergency-fund-calculator` | `emergency-fund` | Matched |
| 19 | Savings Goal Calculator | `/calculators/savings-goal-calculator/` | `savings-goal-calculator` | `savings-goal` | Matched |
| 20 | Real Rate of Return Calculator | `/calculators/real-rate-of-return-calculator/` | `real-rate-of-return-calculator` | `real-rate-of-return` | Matched |
| 21 | Inflation-Adjusted Return Calculator | `/calculators/inflation-adjusted-return-calculator/` | `inflation-adjusted-return-calculator` | `inflation-adjusted-return` | Matched |
| 22 | Financial Independence Date Calculator | `/calculators/financial-independence-date-calculator/` | `financial-independence-date-calculator` | `financial-independence-date` | Matched |
| 23 | Lean FIRE Calculator | `/calculators/lean-fire-calculator/` | `lean-fire-calculator` | `lean-fire` | Matched |
| 24 | Fat FIRE Calculator | `/calculators/fat-fire-calculator/` | `fat-fire-calculator` | `fat-fire` | Matched |
| 25 | Barista FIRE Calculator | `/calculators/barista-fire-calculator/` | `barista-fire-calculator` | `barista-fire` | Matched |
| 26 | Safe Withdrawal Rate Calculator | `/calculators/safe-withdrawal-rate-calculator/` | `safe-withdrawal-rate-calculator` | `safe-withdrawal-rate` | Matched |
| 27 | Years to Retirement Calculator | `/calculators/years-to-retirement-calculator/` | `years-to-retirement-calculator` | `years-to-retirement` | Matched |
| 28 | Retirement Income Gap Calculator | `/calculators/retirement-income-gap-calculator/` | `retirement-income-gap-calculator` | `retirement-income-gap` | Matched |
| 29 | Portfolio Withdrawal Sustainability Calculator | `/calculators/portfolio-withdrawal-sustainability-calculator/` | `portfolio-withdrawal-sustainability-calculator` | `portfolio-withdrawal-sustainability` | Matched |
| 30 | Retirement Tax Drag Calculator | `/calculators/retirement-tax-drag-calculator/` | `retirement-tax-drag-calculator` | `retirement-tax-drag` | Matched |
| 31 | Roth vs Traditional IRA Calculator | `/calculators/roth-vs-traditional-ira-calculator/` | `roth-vs-traditional-ira-calculator` | `roth-vs-traditional-ira` | Matched |
| 32 | 401(k) Growth Calculator | `/calculators/401k-growth-calculator/` | `401k-growth-calculator` | `401k-growth` | Matched |
| 33 | IRA Growth Calculator | `/calculators/ira-growth-calculator/` | `ira-growth-calculator` | `ira-growth` | Matched |
| 34 | Taxable vs Tax-Advantaged Account Calculator | `/calculators/taxable-vs-tax-advantaged-calculator/` | `taxable-vs-tax-advantaged-calculator` | `taxable-vs-tax-advantaged` | Matched |
| 35 | HSA Growth Calculator | `/calculators/hsa-growth-calculator/` | `hsa-growth-calculator` | `hsa-growth` | Matched |
| 36 | 529 College Savings Calculator | `/calculators/529-college-savings-calculator/` | `529-college-savings-calculator` | `529-college-savings` | Matched |
| 37 | College Cost Inflation Calculator | `/calculators/college-cost-inflation-calculator/` | `college-cost-inflation-calculator` | `college-cost-inflation` | Matched |
| 38 | Budget Calculator | `/calculators/budget-calculator/` | `budget-calculator` | `budget` | Matched |
| 39 | Mortgage Payoff Calculator | `/calculators/mortgage-payoff-calculator/` | `mortgage-payoff-calculator` | `mortgage-payoff` | Matched |
| 40 | Loan Payment Calculator | `/calculators/loan-payment-calculator/` | `loan-payment-calculator` | `loan-payment` | Matched |
| 41 | Debt Payoff Calculator | `/calculators/debt-payoff-calculator/` | `debt-payoff-calculator` | `debt-payoff` | Matched |
| 42 | Debt Snowball Calculator | `/calculators/debt-snowball-calculator/` | `debt-snowball-calculator` | `debt-snowball` | Matched |
| 43 | Debt Avalanche Calculator | `/calculators/debt-avalanche-calculator/` | `debt-avalanche-calculator` | `debt-avalanche` | Matched |
| 44 | Credit Card Interest Calculator | `/calculators/credit-card-interest-calculator/` | `credit-card-interest-calculator` | `credit-card-interest` | Matched |
| 45 | Auto Loan Calculator | `/calculators/auto-loan-calculator/` | `auto-loan-calculator` | `auto-loan` | Matched |
| 46 | Refinance Calculator | `/calculators/refinance-calculator/` | `refinance-calculator` | `refinance` | Matched |
| 47 | Student Loan Calculator | `/calculators/student-loan-calculator/` | `student-loan-calculator` | `student-loan` | Matched |
| 48 | Student Loan Payoff Calculator | `/calculators/student-loan-payoff-calculator/` | `student-loan-payoff-calculator` | `student-loan-payoff` | Matched |
| 49 | HELOC Calculator | `/calculators/heloc-calculator/` | `heloc-calculator` | `heloc` | Matched |
| 50 | Rent vs Buy Calculator | `/calculators/rent-vs-buy-calculator/` | `rent-vs-buy-calculator` | `rent-vs-buy` | Matched |
| 51 | Home Affordability Calculator | `/calculators/home-affordability-calculator/` | `home-affordability-calculator` | `home-affordability` | Matched |
| 52 | Down Payment Calculator | `/calculators/down-payment-calculator/` | `down-payment-calculator` | `down-payment` | Matched |
| 53 | Mortgage Recast Calculator | `/calculators/mortgage-recast-calculator/` | `mortgage-recast-calculator` | `mortgage-recast` | Matched |

## Calculator QA Records

Complete every field. Attach screenshots, console output, spreadsheet cells, or
issue links where useful. Do not mark **Pass** until all fields have been
checked.

### 1. Compound Interest Calculator

- **Calculator name:** Compound Interest Calculator
- **URL:** `/calculators/compound-interest/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 2. Savings Rate Calculator

- **Calculator name:** Savings Rate Calculator
- **URL:** `/calculators/savings-rate/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 3. FIRE Calculator

- **Calculator name:** FIRE Calculator
- **URL:** `/calculators/fire-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 4. Coast FIRE Calculator

- **Calculator name:** Coast FIRE Calculator
- **URL:** `/calculators/coast-fire-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 5. 4% Rule Calculator

- **Calculator name:** 4% Rule Calculator
- **URL:** `/calculators/4-percent-rule-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 6. Retirement Withdrawal Calculator

- **Calculator name:** Retirement Withdrawal Calculator
- **URL:** `/calculators/retirement-withdrawal-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 7. Rule of 72 Calculator

- **Calculator name:** Rule of 72 Calculator
- **URL:** `/calculators/rule-of-72-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 8. Inflation Calculator

- **Calculator name:** Inflation Calculator
- **URL:** `/calculators/inflation-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 9. Expense Ratio Calculator

- **Calculator name:** Expense Ratio Calculator
- **URL:** `/calculators/expense-ratio-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 10. Investment Fee Calculator

- **Calculator name:** Investment Fee Calculator
- **URL:** `/calculators/investment-fee-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 11. Net Worth Calculator

- **Calculator name:** Net Worth Calculator
- **URL:** `/calculators/net-worth-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 12. CAGR Calculator

- **Calculator name:** CAGR Calculator
- **URL:** `/calculators/cagr-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 13. ETF Fee Drag Calculator

- **Calculator name:** ETF Fee Drag Calculator
- **URL:** `/calculators/etf-fee-drag-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 14. Dividend Yield Calculator

- **Calculator name:** Dividend Yield Calculator
- **URL:** `/calculators/dividend-yield-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 15. Dividend Growth Calculator

- **Calculator name:** Dividend Growth Calculator
- **URL:** `/calculators/dividend-growth-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 16. DRIP Calculator

- **Calculator name:** DRIP Calculator
- **URL:** `/calculators/drip-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 17. Lump Sum vs DCA Calculator

- **Calculator name:** Lump Sum vs DCA Calculator
- **URL:** `/calculators/lump-sum-vs-dca-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 18. Emergency Fund Calculator

- **Calculator name:** Emergency Fund Calculator
- **URL:** `/calculators/emergency-fund-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 19. Savings Goal Calculator

- **Calculator name:** Savings Goal Calculator
- **URL:** `/calculators/savings-goal-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 20. Real Rate of Return Calculator

- **Calculator name:** Real Rate of Return Calculator
- **URL:** `/calculators/real-rate-of-return-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 21. Inflation-Adjusted Return Calculator

- **Calculator name:** Inflation-Adjusted Return Calculator
- **URL:** `/calculators/inflation-adjusted-return-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 22. Financial Independence Date Calculator

- **Calculator name:** Financial Independence Date Calculator
- **URL:** `/calculators/financial-independence-date-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 23. Lean FIRE Calculator

- **Calculator name:** Lean FIRE Calculator
- **URL:** `/calculators/lean-fire-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 24. Fat FIRE Calculator

- **Calculator name:** Fat FIRE Calculator
- **URL:** `/calculators/fat-fire-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 25. Barista FIRE Calculator

- **Calculator name:** Barista FIRE Calculator
- **URL:** `/calculators/barista-fire-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 26. Safe Withdrawal Rate Calculator

- **Calculator name:** Safe Withdrawal Rate Calculator
- **URL:** `/calculators/safe-withdrawal-rate-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 27. Years to Retirement Calculator

- **Calculator name:** Years to Retirement Calculator
- **URL:** `/calculators/years-to-retirement-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 28. Retirement Income Gap Calculator

- **Calculator name:** Retirement Income Gap Calculator
- **URL:** `/calculators/retirement-income-gap-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 29. Portfolio Withdrawal Sustainability Calculator

- **Calculator name:** Portfolio Withdrawal Sustainability Calculator
- **URL:** `/calculators/portfolio-withdrawal-sustainability-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 30. Retirement Tax Drag Calculator

- **Calculator name:** Retirement Tax Drag Calculator
- **URL:** `/calculators/retirement-tax-drag-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 31. Roth vs Traditional IRA Calculator

- **Calculator name:** Roth vs Traditional IRA Calculator
- **URL:** `/calculators/roth-vs-traditional-ira-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 32. 401(k) Growth Calculator

- **Calculator name:** 401(k) Growth Calculator
- **URL:** `/calculators/401k-growth-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 33. IRA Growth Calculator

- **Calculator name:** IRA Growth Calculator
- **URL:** `/calculators/ira-growth-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 34. Taxable vs Tax-Advantaged Account Calculator

- **Calculator name:** Taxable vs Tax-Advantaged Account Calculator
- **URL:** `/calculators/taxable-vs-tax-advantaged-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 35. HSA Growth Calculator

- **Calculator name:** HSA Growth Calculator
- **URL:** `/calculators/hsa-growth-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 36. 529 College Savings Calculator

- **Calculator name:** 529 College Savings Calculator
- **URL:** `/calculators/529-college-savings-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 37. College Cost Inflation Calculator

- **Calculator name:** College Cost Inflation Calculator
- **URL:** `/calculators/college-cost-inflation-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 38. Budget Calculator

- **Calculator name:** Budget Calculator
- **URL:** `/calculators/budget-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 39. Mortgage Payoff Calculator

- **Calculator name:** Mortgage Payoff Calculator
- **URL:** `/calculators/mortgage-payoff-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 40. Loan Payment Calculator

- **Calculator name:** Loan Payment Calculator
- **URL:** `/calculators/loan-payment-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 41. Debt Payoff Calculator

- **Calculator name:** Debt Payoff Calculator
- **URL:** `/calculators/debt-payoff-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 42. Debt Snowball Calculator

- **Calculator name:** Debt Snowball Calculator
- **URL:** `/calculators/debt-snowball-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 43. Debt Avalanche Calculator

- **Calculator name:** Debt Avalanche Calculator
- **URL:** `/calculators/debt-avalanche-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 44. Credit Card Interest Calculator

- **Calculator name:** Credit Card Interest Calculator
- **URL:** `/calculators/credit-card-interest-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 45. Auto Loan Calculator

- **Calculator name:** Auto Loan Calculator
- **URL:** `/calculators/auto-loan-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 46. Refinance Calculator

- **Calculator name:** Refinance Calculator
- **URL:** `/calculators/refinance-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 47. Student Loan Calculator

- **Calculator name:** Student Loan Calculator
- **URL:** `/calculators/student-loan-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 48. Student Loan Payoff Calculator

- **Calculator name:** Student Loan Payoff Calculator
- **URL:** `/calculators/student-loan-payoff-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 49. HELOC Calculator

- **Calculator name:** HELOC Calculator
- **URL:** `/calculators/heloc-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 50. Rent vs Buy Calculator

- **Calculator name:** Rent vs Buy Calculator
- **URL:** `/calculators/rent-vs-buy-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 51. Home Affordability Calculator

- **Calculator name:** Home Affordability Calculator
- **URL:** `/calculators/home-affordability-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 52. Down Payment Calculator

- **Calculator name:** Down Payment Calculator
- **URL:** `/calculators/down-payment-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

### 53. Mortgage Recast Calculator

- **Calculator name:** Mortgage Recast Calculator
- **URL:** `/calculators/mortgage-recast-calculator/`
- **Inputs tested:** Pending
- **Expected outputs:** Pending
- **Edge cases:** Pending
- **Validation behavior:** Pending
- **Mobile layout:** [ ] Pass [ ] Needs Fix
- **Dark mode:** [ ] Pass [ ] Needs Fix
- **Light mode:** [ ] Pass [ ] Needs Fix
- **GA4 calculate event:** [ ] One event on success [ ] No event on validation failure
- **Related links:** [ ] Pass [ ] Needs Fix
- **SEO title/meta:** [ ] Pass [ ] Needs Fix
- **Status:** [ ] Pass [ ] Needs Fix

## QA Summary

- Total calculators: 53
- Passed:
- Needs fix:
- Not tested:
- Blocking issues:
- Follow-up issue links:
