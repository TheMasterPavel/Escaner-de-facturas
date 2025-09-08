import { config } from 'dotenv';
config();

import '@/ai/flows/handle-missing-invoice-data.ts';
import '@/ai/flows/extract-invoice-data.ts';
import '@/ai/flows/handle-multi-invoice-pdfs.ts';