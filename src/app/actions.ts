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
    console.error('[SERVER_ACTION_ERROR]', e);

    // Robust error message extraction
    let errorMessage = 'Ocurrió un error desconocido al procesar la factura.';
    if (e) {
        if (typeof e.message === 'string') {
            errorMessage = e.message;
        } else if (typeof e.details === 'string') {
            errorMessage = e.details;
        } else if (typeof e === 'string') {
            errorMessage = e;
        }
    }

    return { data: null, error: `Error en el servidor: ${errorMessage}` };
  }
}
