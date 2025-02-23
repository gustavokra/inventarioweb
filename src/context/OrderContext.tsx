import { IOrder } from '@/@types/IOrder';
import { createContext, useContext, useState } from 'react';

interface OrderContextType {
    order: IOrder | null;
    setOrder: (order: IOrder | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [order, setOrder] = useState<IOrder | null>(null);

    return (
        <OrderContext.Provider value={{ order, setOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within a OrderProvider');
    }
    return context;
}
