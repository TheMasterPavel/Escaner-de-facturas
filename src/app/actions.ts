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

    let errorMessage = 'Ocurrió un error desconocido al procesar la factura.';
    
    // Check for Vercel/Next.js specific error structures
    if (e.message) {
      errorMessage = e.message;
    }
    
    // Attempt to parse nested error details from Google API or other causes
    if (e.cause) {
      try {
        // Handle nested stringified JSON
        if (typeof e.cause === 'string') {
          const parsedCause = JSON.parse(e.cause);
          if (parsedCause.error?.message) {
            errorMessage = `Error de la API: ${parsedCause.error.message}`;
          }
        } else if (e.cause.message) {
           errorMessage = e.cause.message;
        }
      } catch (parseError) {
         // If parsing fails, stick with the last known error message.
         console.error('[ERROR_PARSING_CAUSE]', parseError);
      }
    }
    
    // Check for a specific structure often seen in Genkit/Google AI errors
    if (e.details) {
       errorMessage = e.details;
    }

    return { data: null, error: errorMessage };
  }
}
