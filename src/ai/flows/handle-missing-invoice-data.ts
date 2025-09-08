'use server';

/**
 * @fileOverview Extracts invoice data from a PDF, handles missing data by leaving fields blank, and flags low-confidence extractions for review.
 *
 * - extractInvoiceData - A function that extracts structured invoice data from a PDF invoice.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function (PDF data URI).
 * - ExtractInvoiceDataOutput - The return type for the extractInvoiceData function (JSON with invoice details and total expenses).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractInvoiceDataInputSchema = z.object({
  invoiceDataUri: z
    .string()
    .describe(
      "A PDF invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractInvoiceDataInput = z.infer<typeof ExtractInvoiceDataInputSchema>;

const InvoiceSchema = z.object({
  proveedor: z.string().describe('The name of the vendor.'),
  fecha: z.string().describe('The invoice date in YYYY-MM-DD format.'),
  concepto: z.string().describe('A brief description of the purchase.'),
  importe: z.number().describe('The total amount of the invoice.'),
  missingFields: z
    .array(z.string())
    .describe('List of fields with low confidence extractions requiring review.')
    .optional(),
});

const ExtractInvoiceDataOutputSchema = z.object({
  facturas: z.array(InvoiceSchema).describe('An array of extracted invoice details.'),
  total_gastos: z.number().describe('The sum of all invoice amounts.'),
});
export type ExtractInvoiceDataOutput = z.infer<typeof ExtractInvoiceDataOutputSchema>;

export async function extractInvoiceData(input: ExtractInvoiceDataInput): Promise<ExtractInvoiceDataOutput> {
  return extractInvoiceDataFlow(input);
}

const extractInvoiceDataPrompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: {schema: ExtractInvoiceDataInputSchema},
  output: {schema: ExtractInvoiceDataOutputSchema},
  prompt: `You are an expert accounting assistant specializing in extracting data from company invoices.

  You will receive a scanned PDF invoice, and your task is to extract the relevant information from it.
  This includes the vendor, date, invoice number (if available), and total amount.

  Create a list of all expenses with the following format:
  - Vendor
  - Date
  - Concept (if present)
  - Amount

  Calculate the sum total of all amounts.

  If the PDF contains multiple scanned invoices on the same page, separate them into different entries.

  If any data is missing or not legible, leave the field blank. In the missingFields array, include the names of any fields that were difficult to extract and should be reviewed by a human.

  Input Invoice:
  {{media url=invoiceDataUri}}
  `,
  config: {
    safetySettings: [
      {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH'},
      {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE'},
      {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE'},
    ],
  },
});

const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceDataInputSchema,
    outputSchema: ExtractInvoiceDataOutputSchema,
  },
  async input => {
    const {output} = await extractInvoiceDataPrompt(input);
    return output!;
  }
);
