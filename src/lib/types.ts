import type { ExtractInvoiceDataOutput } from '@/ai/flows/handle-missing-invoice-data';

export type Invoice = ExtractInvoiceDataOutput['facturas'][0];

// This was the direct output from the AI
export type InvoiceData = ExtractInvoiceDataOutput;

// This is the new response type from our server action, which includes the calculated total
export interface InvoiceResponse {
    facturas: Invoice[];
    total_gastos: number;
}
