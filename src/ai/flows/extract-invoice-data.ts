'use server';

/**
 * @fileOverview An invoice data extraction AI agent.
 *
 * - extractInvoiceData - A function that handles the invoice data extraction process.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function.
 * - ExtractInvoiceDataOutput - The return type for the extractInvoiceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ExtractInvoiceDataInputSchema = z.object({
  invoiceDataUri: z
    .string()
    .describe(
      "A PDF document containing one or more invoices, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractInvoiceDataInput = z.infer<typeof ExtractInvoiceDataInputSchema>;

const InvoiceSchema = z.object({
  proveedor: z.string().describe('The name of the vendor.'),
  fecha: z.string().describe('The date of the invoice (YYYY-MM-DD).'),
  concepto: z.string().describe('A brief description of the invoice, if available.'),
  importe: z.number().describe('The total amount of the invoice.'),
});

const ExtractInvoiceDataOutputSchema = z.object({
  facturas: z.array(InvoiceSchema).describe('An array of extracted invoices.'),
  total_gastos: z.number().describe('The sum of all invoice amounts.'),
});
export type ExtractInvoiceDataOutput = z.infer<typeof ExtractInvoiceDataOutputSchema>;

export async function extractInvoiceData(input: ExtractInvoiceDataInput): Promise<ExtractInvoiceDataOutput> {
  return extractInvoiceDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: {schema: ExtractInvoiceDataInputSchema},
  output: {schema: ExtractInvoiceDataOutputSchema},
  prompt: `You are an expert accounting assistant. You will extract data from scanned invoices in PDF format.

  Your task is to:
  1. Read and extract the relevant information from each invoice (vendor, date, invoice number if it exists, total amount).
  2. Create an organized list of all expenses with the format:
     - Vendor
     - Date
     - Concept (if present)
     - Amount
  3. Calculate the sum total of all amounts.
  4. Return the results in a structured JSON format with this schema:
  
  { 
    "facturas": [
       { 
         "proveedor": "Leroy Merlin",
         "fecha": "2025-09-08",
         "concepto": "Material de construcción",
         "importe": 6.00
       },
       ...
    ],
    "total_gastos": 16.00
  }
  
  If the PDF contains multiple scanned invoices on the same page, separate them into different entries within the JSON.
  If any data is missing or not legible, leave the field empty but never invent information.
  
  Here is the PDF invoice data: {{media url=invoiceDataUri}}
  `,
});

const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceDataInputSchema,
    outputSchema: ExtractInvoiceDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
