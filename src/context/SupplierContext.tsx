import { ISupplier } from '@/@types/ISupplier';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SupplierContextType {
  supplier: ISupplier | null;
  setSupplier: (supplier: ISupplier | null) => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within a SupplierProvider');
  }
  return context;
};

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
  const [supplier, setSupplier] = useState<ISupplier | null>(null);

  return (
    <SupplierContext.Provider value={{ supplier, setSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};
