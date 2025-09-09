import defineNextJsHandler from "@genkit-ai/next";
import { extractInvoiceDataFlow } from "@/ai/flows/extract-invoice-data";

export const maxDuration = 120;

export const POST = defineNextJsHandler({
  flows: [
    extractInvoiceDataFlow
  ]
});
