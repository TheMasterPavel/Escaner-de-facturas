'use server';

import { extractInvoiceData } from '@/ai/flows/handle-missing-invoice-data';
import type { InvoiceData, InvoiceResponse } from '@/lib/types';

export async function processInvoice(
  pdfDataUri: string
): Promise<{ data: InvoiceResponse | null; error: string | null }> {
  if (!pdfDataUri) {
    return { data: null, error: 'No se ha proporcionado ningún archivo.' };
  }

  try {
    const result = await extractInvoiceData({ invoiceDataUri: pdfDataUri });
    if (!result || !result.facturas || result.facturas.length === 0) {
      return { data: null, error: 'No se pudieron extraer datos de la factura. Por favor, intente con otro archivo.' };
    }
    
    // Calculate total expenses on the server from the returned invoices
    const total_gastos = result.facturas.reduce((sum, invoice) => sum + (invoice.importe || 0), 0);
    
    const responseData: InvoiceResponse = {
      facturas: result.facturas,
      total_gastos: total_gastos,
    };

    return { data: responseData, error: null };
  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || 'Ocurrió un error al procesar la factura. Por favor, inténtelo de nuevo.';
    // Extracting potential details from GoogleGenerativeAI errors
    if (e.cause?.message) {
       return { data: null, error: e.cause.message };
    }
    return { data: null, error: errorMessage };
  }
}
