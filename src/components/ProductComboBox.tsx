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
    handleSelectProduct?: (selectedProduct: IProduct) => void;
}

export function ProductCombobox({
    products,
    selectedProducts,
    setSelectedProducts,
    handleSelectProduct,
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
                    className="w-full justify-between bg-background text-foreground"
                >
                    <span className="text-muted-foreground">
                        {value || "Selecione um produto..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        value={value}
                        onValueChange={setValue}
                        placeholder="Pesquise um produto..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                            {products
                                .filter(prod => !selectedProducts.some(selected => selected.id === prod.id))
                                .map((product) => {
                                    return (
                                        <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => handleSelect(product.name)}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="flex items-start gap-2">
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4 mt-1",
                                                        selectedProducts.some((p) => p.id === product.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{product.name}</span>
                                                    <span className="text-xs text-muted-foreground line-clamp-2">
                                                        {product.description || "Sem descrição"}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-muted-foreground shrink-0">
                                                R$ {product.price.toFixed(2).replace(".", ",")}
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
