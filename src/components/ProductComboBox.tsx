"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { IProduct } from "@/@types/IProduct"

interface ProductComboboxProps {
    products: IProduct[];
    selectedProducts: IProduct[];
    setSelectedProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
    handleSelectProduct?: (selectedProduct: IProduct) => void; // Função opcional
}

export function ProductCombobox({
    products,
    selectedProducts,
    setSelectedProducts,
    handleSelectProduct, // Função opcional
}: ProductComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string>("")

    const handleSelect = (selectedValue: string) => {
        const selectedProduct = products.find((product) => product.name === selectedValue)
        if (selectedProduct) {

            if (!selectedProducts.some((p) => p.id === selectedProduct.id)) {
                setSelectedProducts((prev) => [...prev, selectedProduct])
                
                if (handleSelectProduct) {
                    handleSelectProduct(selectedProduct)
                }
            }

            setValue("")
            setOpen(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value || "Selecione um produto..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        value={value}
                        onValueChange={setValue} // Atualiza o valor da pesquisa
                        placeholder="Pesquise um produto..."
                    />
                    <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => handleSelect(product.name)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedProducts.some((p) => p.id === product.id)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {product.name} - R$ {product.price.toFixed(2).replace(".", ",")}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
