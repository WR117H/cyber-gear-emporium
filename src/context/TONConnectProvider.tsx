
import React, { createContext, useContext, ReactNode } from 'react';
import { TonConnectUI, THEME, TonConnectUIProvider } from '@tonconnect/ui-react';

interface TONConnectContextType {
  tonConnectUI: TonConnectUI;
}

const TONConnectContext = createContext<TONConnectContextType | undefined>(undefined);

export function useTONConnect() {
  const context = useContext(TONConnectContext);
  if (!context) {
    throw new Error("useTONConnect must be used within a TONConnectProvider");
  }
  return context;
}

const manifestUrl = 'https://cyberhacker.com/tonconnect-manifest.json';

interface TONConnectProviderProps {
  children: ReactNode;
}

export function TONConnectProvider({ children }: TONConnectProviderProps) {
  const [tonConnectUI] = React.useState(
    () => new TonConnectUI({
      manifestUrl,
      uiPreferences: {
        theme: THEME.DARK,
      }
    })
  );

  return (
    <TONConnectContext.Provider value={{ tonConnectUI }}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        {children}
      </TonConnectUIProvider>
    </TONConnectContext.Provider>
  );
}
