'use server';

/**
 * @fileOverview Extracts invoice data from a PDF, handles missing data by leaving fields blank, and flags low-confidence extractions for review.
 *
 * - extractInvoiceData - A function that extracts structured invoice data from a PDF invoice.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function (PDF data URI).
 * - ExtractInvoiceDataOutput - The return type for the extractInvoiceData function (JSON with invoice details).
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

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
  importe: z.number().describe('The total amount of the invoice. This can be negative for returns or credit notes.'),
  missingFields: z
    .array(z.string())
    .describe('List of fields with low confidence extractions requiring review.')
    .optional(),
});

const ExtractInvoiceDataOutputSchema = z.object({
  facturas: z.array(InvoiceSchema).describe('An array of extracted invoice details.'),
});
export type ExtractInvoiceDataOutput = z.infer<typeof ExtractInvoiceDataOutputSchema>;

export async function extractInvoiceData(input: ExtractInvoiceDataInput): Promise<ExtractInvoiceDataOutput> {
  return extractInvoiceDataFlow(input);
}

const extractInvoiceDataPrompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: {schema: ExtractInvoiceDataInputSchema},
  output: {schema: ExtractInvoiceDataOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are an expert accounting assistant specializing in extracting data from invoices within a PDF document.

Your task is to analyze the provided PDF, identify all individual invoices, and extract the following details for each one:
- proveedor: The name of the vendor/supplier.
- fecha: The date of the invoice in YYYY-MM-DD format.
- concepto: A brief description of the items or services purchased.
- importe: The **final total amount** of the invoice. Pay close attention to decimal places and ensure you are extracting the grand total, not a subtotal. For credit notes, returns, or refunds, this value MUST be negative.

If the PDF contains multiple invoices, create a separate JSON object for each.

Handle missing information:
- If a value for a field cannot be found or read with high confidence, leave it as an empty string ("") for 'proveedor', 'fecha', and 'concepto', and use 0 for 'importe'.
- In addition, if you are not confident about a field, you MUST add the name of that field (e.g., "importe") to the 'missingFields' array for human review.

Analyze the following invoice document:
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

export const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceDataInputSchema,
    outputSchema: ExtractInvoiceDataOutputSchema,
  },
  async input => {
    const {output} = await extractInvoiceDataPrompt(input);
    
    // If the model returns no valid output, return an empty array of invoices
    // instead of letting the flow fail.
    if (!output) {
      return { facturas: [] };
    }
    
    return output;
  }
);
