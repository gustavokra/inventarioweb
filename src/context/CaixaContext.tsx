import React, { createContext, useContext, useState } from 'react';
import { IOperacaoCaixa } from '@/@types/ICaixa';

interface ContextoCaixaType {
    operacaoAtual: IOperacaoCaixa | null;
    setOperacaoAtual: (operacao: IOperacaoCaixa | null) => void;
    estaAberto: boolean;
}

const CaixaContext = createContext<ContextoCaixaType | undefined>(undefined);

export function CaixaProvider({ children }: { children: React.ReactNode }) {
    const [operacaoAtual, setOperacaoAtual] = useState<IOperacaoCaixa | null>(null);
    const estaAberto = operacaoAtual?.situacao === 'aberto';

    return (
        <CaixaContext.Provider value={{ operacaoAtual, setOperacaoAtual, estaAberto }}>
            {children}
        </CaixaContext.Provider>
    );
}

export function useCaixa() {
    const context = useContext(CaixaContext);
    if (context === undefined) {
        throw new Error('useCaixa deve ser usado dentro de um CaixaProvider');
    }
    return context;
} 