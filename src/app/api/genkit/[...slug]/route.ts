import defineNextJsHandler from "@genkit-ai/next";
import { extractInvoiceDataFlow } from "@/ai/flows/handle-missing-invoice-data";

export const maxDuration = 120;

export const POST = defineNextJsHandler({
  flows: [
    extractInvoiceDataFlow,
  ]
});
