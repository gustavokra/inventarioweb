import { IPaymentMethod } from '@/@types/IPaymentMethod';
import { createContext, useContext, useState } from 'react';

interface PaymentMethodContextType {
    paymentMethod: IPaymentMethod | null;
    setPaymentMethod: (paymentMethod: IPaymentMethod | null) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export function PaymentMethodProvider({ children }: { children: React.ReactNode }) {
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>(null);

    return (
        <PaymentMethodContext.Provider value={{ paymentMethod, setPaymentMethod }}>
            {children}
        </PaymentMethodContext.Provider>
    );
}

export function usePaymentMethod() {
    const context = useContext(PaymentMethodContext);
    if (context === undefined) {
        throw new Error('usePaymentMethod must be used within a PaymentMethodProvider');
    }
    return context;
} 