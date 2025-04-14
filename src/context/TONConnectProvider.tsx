import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTonConnectUI, THEME, WalletInfoRemote } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';

interface TONConnectContextType {
  tonConnectUI: ReturnType<typeof useTonConnectUI>[0];
  connectedWallet: WalletInfoRemote | null;
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
  const [wallet, setWallet] = useState<WalletInfoRemote | null>(null);

  // Set UI theme
  useEffect(() => {
    setOptions({
      uiPreferences: {
        theme: THEME.DARK
      }
    });
  }, [setOptions]);

  // Listen to wallet connection changes
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange(walletInfo => {
      setWallet(walletInfo);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [tonConnectUI]);

  const isConnected = !!wallet;

  const sendTransaction = useCallback(async (amount: number): Promise<boolean> => {
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your TON wallet first",
        variant: "destructive"
      });
      return false;
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: wallet.account.address,
            amount: (amount * 1e9).toString(),
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
  }, [isConnected, wallet, tonConnectUI, toast]);

  return (
    <TONConnectContext.Provider value={{ tonConnectUI, connectedWallet: wallet, isConnected, sendTransaction }}>
      {children}
    </TONConnectContext.Provider>
  );
}