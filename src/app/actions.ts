'use server';

import {extractInvoiceData} from '@/ai/flows/handle-missing-invoice-data';
import type {InvoiceData, InvoiceResponse} from '@/lib/types';

export async function processInvoice(
  pdfDataUri: string
): Promise<{data: InvoiceResponse | null; error: string | null}> {
  if (!pdfDataUri) {
    return {data: null, error: 'No se ha proporcionado ningún archivo.'};
  }

  const result = await extractInvoiceData({invoiceDataUri: pdfDataUri});

  // This code will now only run if extractInvoiceData succeeds.
  // If it fails, the raw error will propagate up.
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
}