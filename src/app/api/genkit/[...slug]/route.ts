
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineNextJsHandler} from '@genkit-ai/next';
import {config} from 'dotenv';

config();

import '@/ai/flows/handle-missing-invoice-data';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-1.5-flash',
});

export const POST = defineNextJsHandler({
  ai,
});
