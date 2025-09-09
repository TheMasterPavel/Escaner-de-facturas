
import {defineNextJsHandler} from '@genkit-ai/next';
import {config} from 'dotenv';
import {ai} from '@/ai/genkit';

config();

import '@/ai/flows/handle-missing-invoice-data';

export const maxDuration = 60; // Set max duration to 60 seconds

export const POST = defineNextJsHandler({
  ai,
});
