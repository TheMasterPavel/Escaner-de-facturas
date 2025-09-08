"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { InvoiceUploadForm } from "@/components/invoice-upload-form";
import { InvoiceTable } from "@/components/invoice-table";
import { Logo } from "@/components/logo";
import { processInvoice } from "@/app/actions";
import type { InvoiceData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, AlertCircle, FileText, AlertTriangle, Download } from "lucide-react";

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (dataUri: string) => {
    setIsProcessing(true);
    setError(null);
    setInvoiceData(null);

    const result = await processInvoice(dataUri);

    if (result.error) {
      setError(result.error);
    } else {
      setInvoiceData(result.data);
    }
    setIsProcessing(false);
  };
  
  const handleDownloadExcel = () => {
    if (!invoiceData) return;

    const worksheetData = invoiceData.facturas.map(invoice => ({
      Proveedor: invoice.proveedor,
      Fecha: invoice.fecha ? new Date(invoice.fecha).toLocaleDateString('es-ES') : 'N/A',
      Concepto: invoice.concepto,
      Importe: invoice.importe,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 30 }, // Proveedor
      { wch: 15 }, // Fecha
      { wch: 50 }, // Concepto
      { wch: 15 }, // Importe
    ];

    XLSX.writeFile(workbook, "facturas.xlsx");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              FacturaVision
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
            {/* Future navigation can go here */}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader title="Panel de Control" />
        <main className="flex-1 space-y-6 p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Cargar Factura</CardTitle>
              <CardDescription>
                Sube un archivo PDF con una o más facturas para extraer los datos automáticamente.
              </</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceUploadForm
                onSubmit={handleFormSubmit}
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>

          {isProcessing && <ResultsSkeleton />}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {invoiceData && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Gastos
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(invoiceData.total_gastos)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Suma de todas las facturas procesadas
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Facturas Encontradas
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {invoiceData.facturas.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Número de facturas individuales detectadas
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <CardTitle>Facturas Extraídas</CardTitle>
                    <CardDescription>
                      Detalles de las facturas encontradas en el documento. Los campos marcados con <AlertTriangle className="inline h-4 w-4 text-yellow-500" /> pueden requerir revisión.
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleDownloadExcel}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Excel
                  </Button>
                </CardHeader>
                <CardContent>
                  <InvoiceTable invoices={invoiceData.facturas} />
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Gastos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Facturas Encontradas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <Skeleton className="h-8 w-1/4" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
