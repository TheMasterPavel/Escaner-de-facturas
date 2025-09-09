import {defineNextJsHandler} from '@genkit-ai/next';
import '@/ai/index';
import {NextRequest} from 'next/server';

const handler = defineNextJsHandler();

export async function POST(req: NextRequest) {
  return handler(req);
}

export const maxDuration = 120;
