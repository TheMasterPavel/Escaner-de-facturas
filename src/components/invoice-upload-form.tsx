"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Upload } from "lucide-react";

interface InvoiceUploadFormProps {
  onSubmit: (dataUri: string) => void;
  isProcessing: boolean;
}

export function InvoiceUploadForm({ onSubmit, isProcessing }: InvoiceUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Por favor, sube un archivo PDF.");
        setFile(null);
      } else if (selectedFile.size > 200 * 1024 * 1024) { // 200MB limit
        setError("El archivo es demasiado grande (máx 200MB).");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, selecciona un archivo.");
      return;
    }
    if (isProcessing) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUri = loadEvent.target?.result as string;
      onSubmit(dataUri);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="invoice-pdf">Subir Factura (PDF)</Label>
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input id="invoice-pdf" type="file" accept="application/pdf" onChange={handleFileChange} className="file:text-primary file:font-medium" />
            <Button type="submit" disabled={isProcessing || !file}>
                {isProcessing ? (
                <Icons.spinner className="mr-2 h-4 w-4" />
                ) : (
                <Upload className="mr-2 h-4 w-4" />
                )}
                Procesar
            </Button>
        </div>
        {file && <p className="text-sm text-muted-foreground mt-1">Archivo seleccionado: {file.name}</p>}
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </form>
  );
}
