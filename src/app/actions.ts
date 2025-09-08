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
    console.error('Error processing invoice:', e);
    // Vercel/Next.js puede anidar el error original. Intentamos acceder a él.
    const cause = e.cause || e;
    const errorMessage = cause.message || 'Ocurrió un error desconocido al procesar la factura.';
    
    // Extraer un mensaje más específico si es un error de la API de Google
    if (cause.details) {
      try {
        const details = JSON.parse(cause.details);
        if (details.error?.message) {
          return { data: null, error: `Error de la API: ${details.error.message}` };
        }
      } catch (parseError) {
         // Si el detalle no es un JSON, usamos el mensaje principal.
         return { data: null, error: errorMessage };
      }
    }

    return { data: null, error: errorMessage };
  }
}
