import defineNextJsHandler from '@genkit-ai/next';
import '@/ai/genkit';
import * as handleMissingInvoiceData from '@/ai/flows/handle-missing-invoice-data';

export const maxDuration = 120; // Set max duration to 2 minutes

export const POST = defineNextJsHandler({
  flows: [handleMissingInvoiceData],
});
