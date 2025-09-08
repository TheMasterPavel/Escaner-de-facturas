import type { ExtractInvoiceDataOutput } from '@/ai/flows/handle-missing-invoice-data';

export type Invoice = ExtractInvoiceDataOutput['facturas'][0];

export type InvoiceData = ExtractInvoiceDataOutput;
