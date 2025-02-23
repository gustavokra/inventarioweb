import { IFormaPagamento } from '@/@types/IFormaPagamento';
import { createContext, useContext, useState, ReactNode } from 'react';

interface FormaPagamentoContextType {
  formaPagamento: IFormaPagamento | null;
  setFormaPagamento: (formaPagamento: IFormaPagamento | null) => void;
}

const FormaPagamentoContext = createContext<FormaPagamentoContextType | undefined>(undefined);

export const useFormaPagamento = () => {
  const context = useContext(FormaPagamentoContext);
  if (!context) {
    throw new Error('useFormaPagamento must be used within a FormaPagamentoProvider');
  }
  return context;
};

export const FormaPagamentoProvider = ({ children }: { children: ReactNode }) => {
  const [formaPagamento, setFormaPagamento] = useState<IFormaPagamento | null>(null);

  return (
    <FormaPagamentoContext.Provider value={{ formaPagamento, setFormaPagamento }}>
      {children}
    </FormaPagamentoContext.Provider>
  );
};
