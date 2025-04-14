
import React, { createContext, useContext, ReactNode } from 'react';
import { useTonConnectUI, THEME } from '@tonconnect/ui-react';

interface TONConnectContextType {
  tonConnectUI: ReturnType<typeof useTonConnectUI>[0];
  isConnected: boolean;
}

const TONConnectContext = createContext<TONConnectContextType | undefined>(undefined);

export function useTONConnect() {
  const context = useContext(TONConnectContext);
  if (!context) {
    throw new Error("useTONConnect must be used within a TONConnectProvider");
  }
  return context;
}

interface TONConnectProviderProps {
  children: ReactNode;
}

export function TONConnectProvider({ children }: TONConnectProviderProps) {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  
  // Set theme preference once
  React.useEffect(() => {
    setOptions({
      uiPreferences: {
        theme: THEME.DARK
      }
    });
  }, [setOptions]);
  
  // Check if wallet is connected
  const isConnected = React.useMemo(() => {
    return !!tonConnectUI.wallet;
  }, [tonConnectUI.wallet]);

  return (
    <TONConnectContext.Provider value={{ tonConnectUI, isConnected }}>
      {children}
    </TONConnectContext.Provider>
  );
}
