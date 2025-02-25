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
import { IClient } from "@/@types/IClient"

interface ClientComboboxProps {
    clients: IClient[];
    selectedClient: IClient | undefined;
    setSelectedClient: (client: IClient) => void;
}

export function ClientCombobox({
    clients,
    selectedClient,
    setSelectedClient,
}: ClientComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string>("")

    const handleSelect = (selectedValue: string) => {
        const selectedClient = clients.find((client) => client.name === selectedValue)
        if (selectedClient) {
            setSelectedClient(selectedClient)
            setValue(selectedClient.name)
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
                    <span className={selectedClient ? "text-foreground" : "text-muted-foreground"}>
                        {selectedClient ? `${selectedClient.name} - ${selectedClient.document}` : "Selecione um cliente..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        value={value}
                        onValueChange={setValue}
                        placeholder="Pesquise um cliente..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.name}
                                    onSelect={() => handleSelect(client.name)}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex items-start gap-2">
                                        <Check
                                            className={cn(
                                                "h-4 w-4 mt-1",
                                                selectedClient?.id === client.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{client.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {client.document}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {client.contact}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 