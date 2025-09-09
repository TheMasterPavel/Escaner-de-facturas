import {defineNextJsHandler} from '@genkit-ai/next';
import '@/ai/genkit';
import * as handleMissingInvoiceData from '@/ai/flows/handle-missing-invoice-data';
import {NextRequest} from 'next/server';

const handler = defineNextJsHandler({
  flows: [handleMissingInvoiceData],
});

export async function POST(req: NextRequest) {
  return handler(req);
}

export const maxDuration = 120;
