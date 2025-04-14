
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useTonConnectUI, THEME } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';

interface TONConnectContextType {
  tonConnectUI: ReturnType<typeof useTonConnectUI>[0];
  isConnected: boolean;
  sendTransaction: (amount: number) => Promise<boolean>;
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
  const { toast } = useToast();
  
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

  // Handle sending transactions
  const sendTransaction = useCallback(async (amount: number): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your TON wallet first",
        variant: "destructive"
      });
      return false;
    }

    try {
      // For demo purposes - in a real app, you would specify an actual recipient address
      // This creates a minimal valid transaction that transfers 0 TON to the wallet itself
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360, // Valid for 5 minutes
        messages: [
          {
            address: tonConnectUI.wallet?.account.address || '',
            amount: (amount * 1000000000).toString(), // Convert TON to nanoTON
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      if (result) {
        toast({
          title: "Transaction sent successfully!",
          description: "Your payment is being processed",
        });
        return true;
      } else {
        toast({
          title: "Transaction failed",
          description: "Failed to send transaction",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  }, [isConnected, tonConnectUI, toast]);

  return (
    <TONConnectContext.Provider value={{ tonConnectUI, isConnected, sendTransaction }}>
      manifestUrl="https://cyber-gear-emporium.lovable.app/tonconnect-manifest.json"
    </TONConnectContext.Provider>
  );
}
