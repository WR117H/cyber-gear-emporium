import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useTonConnectUI, useTonWallet, THEME } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';

interface TONConnectContextType {
  tonConnectUI: ReturnType<typeof useTonConnectUI>[0];
  isConnected: boolean;
  sendTransaction: (amount: number) => Promise<boolean>;
}

const TONConnectContext = createContext<TONConnectContextType | null>(null);

export const TONConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const { toast } = useToast();

  React.useEffect(() => {
    setOptions({
      uiPreferences: {
        theme: THEME.DARK
      }
    });
  }, [setOptions]);

  const isConnected = useMemo(() => !!wallet, [wallet]);

  const sendTransaction = useCallback(async (amount: number): Promise<boolean> => {
    if (!wallet) {
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
            address: 'UQDumOkL-njb-WFGwoVCTBurAnGoQ45EgI7yEpg17D_Udobf', // Receiver address
            amount: (amount * 1e9).toString(), // nanoTON
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      if (result) {
        toast({ title: "Transaction sent successfully!" });
        return true;
      } else {
        toast({ title: "Transaction failed", variant: "destructive" });
        return false;
      }

    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      return false;
    }
  }, [tonConnectUI, wallet, toast]);

  return (
    <TONConnectContext.Provider value={{ tonConnectUI, isConnected, sendTransaction }}>
      {children}
    </TONConnectContext.Provider>
  );
};

export const useTONConnect = () => {
  const context = useContext(TONConnectContext);
  if (!context) throw new Error("useTONConnect must be used within a TONConnectProvider");
  return context;
};