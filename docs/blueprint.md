# **App Name**: FacturaVision

## Core Features:

- PDF Invoice Extraction: Extract data (vendor, date, invoice number if available, total amount) from scanned PDF invoices.
- Organized Expense Listing: Create a structured list of all expenses, including vendor, date, concept (if present), and amount.
- Total Expense Calculation: Automatically calculate the sum of all extracted invoice amounts.
- Data Formatting: Format all of the fields so that they follow proper naming conventions and proper formatting of the values.
- Multi-Invoice Handling: Handle PDF documents containing multiple scanned invoices on the same page, separating them into distinct entries.
- Missing Data Handling: Gracefully handle cases where data is missing or unreadable in the scanned document by leaving corresponding fields blank rather than hallucinating information. Tool that flags low-confidence fields for review by the user.
- JSON Output Generation: Generate output in the structured JSON format specified in the prompt, including invoices and total expenses.

## Style Guidelines:

- Primary color: Calm blue (#64B5F6) to convey trust and professionalism.
- Background color: Light gray (#F0F4F7) to ensure readability and a clean aesthetic.
- Accent color: Soft green (#A5D6A7) for highlighting important data points and CTAs.
- Body and headline font: 'Inter' (sans-serif) for a modern, machined, objective feel. Easy readability in tables and lists.
- Clean, tabular layouts for displaying invoice data for quick and easy comprehension.
- Minimalist icons to represent different vendors or expense categories.
- Subtle transition animations when loading invoice data or calculating totals.