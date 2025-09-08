'use server';
/**
 * @fileOverview An AI agent for extracting data from PDF invoices, including those with multiple invoices on a single page.
 *
 * - handleMultiInvoicePDFs - A function that handles the invoice data extraction process.
 * - HandleMultiInvoicePDFsInput - The input type for the handleMultiInvoicePDFs function.
 * - HandleMultiInvoicePDFsOutput - The return type for the handleMultiInvoicePDFs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const HandleMultiInvoicePDFsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HandleMultiInvoicePDFsInput = z.infer<typeof HandleMultiInvoicePDFsInputSchema>;

const HandleMultiInvoicePDFsOutputSchema = z.object({
  facturas: z.array(
    z.object({
      proveedor: z.string().describe('The name of the vendor.'),
      fecha: z.string().describe('The invoice date (YYYY-MM-DD).'),
      concepto: z.string().describe('A brief description of the purchase.'),
      importe: z.number().describe('The total amount due on the invoice.'),
    })
  ),
  total_gastos: z.number().describe('The sum of all invoice amounts.'),
});
export type HandleMultiInvoicePDFsOutput = z.infer<typeof HandleMultiInvoicePDFsOutputSchema>;

export async function handleMultiInvoicePDFs(input: HandleMultiInvoicePDFsInput): Promise<HandleMultiInvoicePDFsOutput> {
  return handleMultiInvoicePDFsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleMultiInvoicePDFsPrompt',
  input: {schema: HandleMultiInvoicePDFsInputSchema},
  output: {schema: HandleMultiInvoicePDFsOutputSchema},
  prompt: `You are an expert in processing company invoices. You will receive PDF documents, possibly containing multiple invoices in a single document.

  Your task is to:
  1. Read and extract the relevant information from each invoice (vendor, date, invoice number if it exists, total amount).
  2. Create an organized list of all expenses with the format:
     - Vendor
     - Date
     - Concept (if it appears)
     - Amount
  3. Calculate the sum total of all amounts.
  4. Return the results in a structured JSON format with this schema:

  { 
    "facturas": [
        {"proveedor": "Leroy Merlin", "fecha": "2025-09-08", "concepto": "Material de construcción", "importe": 6.00 },
         ... ],
    "total_gastos": 16.00
  }

  If the PDF contains several scanned invoices on the same page, separate them into different entries within the JSON.
  If any data is missing or unreadable, leave the field empty, but never invent information. For any fields which are unreadable, make sure to return confidence numbers.

  Here is the PDF data: {{media url=pdfDataUri}}
  `,
});

const handleMultiInvoicePDFsFlow = ai.defineFlow(
  {
    name: 'handleMultiInvoicePDFsFlow',
    inputSchema: HandleMultiInvoicePDFsInputSchema,
    outputSchema: HandleMultiInvoicePDFsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
