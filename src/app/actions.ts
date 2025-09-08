'use server';

import { extractInvoiceData } from '@/ai/flows/handle-missing-invoice-data';
import type { InvoiceData } from '@/lib/types';

export async function processInvoice(
  pdfDataUri: string
): Promise<{ data: InvoiceData | null; error: string | null }> {
  if (!pdfDataUri) {
    return { data: null, error: 'No se ha proporcionado ningún archivo.' };
  }

  try {
    const result = await extractInvoiceData({ invoiceDataUri: pdfDataUri });
    if (!result || !result.facturas || result.facturas.length === 0) {
      return { data: null, error: 'No se pudieron extraer datos de la factura. Por favor, intente con otro archivo.' };
    }
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'Ocurrió un error al procesar la factura. Por favor, inténtelo de nuevo.' };
  }
}
