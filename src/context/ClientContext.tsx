import { IClient } from "@/@types/IClient";
import { createContext, useContext, useState, ReactNode } from "react";

interface ClientContextType {
  client: IClient | null;
  setClient: (client: IClient | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<IClient | null>(null);

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
};
