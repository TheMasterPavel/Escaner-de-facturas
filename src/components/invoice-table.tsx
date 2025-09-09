"use client";

import type { Invoice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (!invoices || invoices.length === 0) {
    return <p className="text-muted-foreground">No hay datos de facturas para mostrar.</p>;
  }

  const headers = ["Proveedor", "Fecha", "Concepto", "Importe"];

  const needsReview = (invoice: Invoice | undefined, fieldName: string) => {
    if (!invoice || !Array.isArray(invoice.missingFields)) {
      return false;
    }
    const lowerCaseFieldName = fieldName.toLowerCase();
    return invoice.missingFields.some(
      (missing) => typeof missing === 'string' && missing.toLowerCase() === lowerCaseFieldName
    );
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={`invoice-${index}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {invoice?.proveedor || "N/A"}
                    {needsReview(invoice, "proveedor") && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Revisión necesaria</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {invoice?.fecha ? new Date(invoice.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : "N/A"}
                     {needsReview(invoice, "fecha") && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Revisión necesaria</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {invoice?.concepto || "N/A"}
                     {needsReview(invoice, "concepto") && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Revisión necesaria</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invoice?.importe != null ? formatCurrency(invoice.importe) : "N/A"}
                     {needsReview(invoice, "importe") && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Revisión necesaria</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
