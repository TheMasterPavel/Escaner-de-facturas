'use server';

import {extractInvoiceData} from '@/ai/flows/handle-missing-invoice-data';
import type {InvoiceData, InvoiceResponse} from '@/lib/types';

export async function processInvoice(
  pdfDataUri: string
): Promise<{data: InvoiceResponse | null; error: string | null}> {
  try {
    if (!pdfDataUri) {
      return {data: null, error: 'No se ha proporcionado ningún archivo.'};
    }

    const result = await extractInvoiceData({invoiceDataUri: pdfDataUri});

    if (!result || !result.facturas || result.facturas.length === 0) {
      return {
        data: null,
        error:
          'No se pudieron extraer datos de la factura. Por favor, intente con otro archivo.',
      };
    }

    const total_gastos = result.facturas.reduce(
      (sum, invoice) => sum + (invoice?.importe || 0),
      0
    );

    const responseData: InvoiceResponse = {
      facturas: result.facturas,
      total_gastos: total_gastos,
    };

    return {data: responseData, error: null};
  } catch (err: any) {
    console.error('Error processing invoice:', err);
    return {
      data: null,
      error:
        'Ocurrió un error inesperado al procesar el archivo. Por favor, revise el formato del documento e inténtelo de nuevo.',
    };
  }
}
