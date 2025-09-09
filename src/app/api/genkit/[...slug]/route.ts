// src/app/api/genkit/[...slug]/route.ts
import { defineNextJsHandler } from "@genkit-ai/next";
import { extractInvoiceDataFlow } from "@/ai/flows/handle-missing-invoice-data";
import { handleMissingInvoiceDataFlow } from "@/ai/flows/handle-missing-invoice-data";

// Duración máxima de ejecución (opcional)
export const maxDuration = 120;

// Definimos el handler pasando los flujos que quieres exponer
export const POST = defineNextJsHandler({
  flows: [
    extractInvoiceDataFlow,
    handleMissingInvoiceDataFlow
  ]
});
