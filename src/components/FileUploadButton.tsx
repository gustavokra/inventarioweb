import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from './ui/button';

const FileUploadButton = () => {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            try {
                const response = await fetch('http://35.198.61.242:8080/api/v1/product/import', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'dbImpl': 'SQLITE',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify(jsonData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Erro ao cadastrar",
                        description: errorData.details,
                    });
    
                    return;
                }

                toast({ variant: "default", title: "Sucesso!", description: "Dados enviados com sucesso!" });

            } catch (error) {
                console.error('Erro:', error);
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao enviar dados." });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
            />
            <Button
                onClick={handleButtonClick}
            >
                Importar XLSX
            </Button>
        </>
    );
};

export default FileUploadButton;
