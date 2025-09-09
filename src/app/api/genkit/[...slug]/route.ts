'use server';
import defineNextJsHandler from '@genkit-ai/next';
import '@/ai/genkit';
import * as handleMissingInvoiceData from '@/ai/flows/handle-missing-invoice-data';
import {NextRequest} from 'next/server';

export const maxDuration = 120; // Set max duration to 2 minutes

export const POST = async (req: NextRequest) => {
  const handler = defineNextJsHandler({
    flows: [handleMissingInvoiceData],
  });
  return handler(req);
};
