import { IProduct } from "@/@types/IProduct";
import { createContext, useContext, useState, ReactNode } from "react";

interface ProductContextType {
  product: IProduct | null;
  setProduct: (product: IProduct | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<IProduct | null>(null);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
