
import {defineNextJsHandler} from '@genkit-ai/next';
import '@/ai/genkit';
import '@/ai/flows/handle-missing-invoice-data';

export const maxDuration = 60; // Set max duration to 60 seconds

export const POST = defineNextJsHandler();
