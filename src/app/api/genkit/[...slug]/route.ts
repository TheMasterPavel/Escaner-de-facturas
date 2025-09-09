
import {defineNextJsHandler} from '@genkit-ai/next';
import {config} from 'dotenv';
import '@/ai/genkit';
import '@/ai/flows/handle-missing-invoice-data';

config();

export const maxDuration = 60; // Set max duration to 60 seconds

export const POST = defineNextJsHandler();
