import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTONConnect } from '@/context/TONConnectProvider';
import { TonConnectButton } from '@tonconnect/ui-react';

interface CryptoPaymentProps {
  amount: number;
  onComplete: () => void;
}

const CryptoPayment = ({ amount, onComplete }: CryptoPaymentProps) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const { toast } = useToast();
  const { tonConnectUI, isConnected } = useTONConnect();

  // TON wallet details
  const tonWalletAddress = 'UQD73-9drgEr9RzP7vog9DuXz3Bn6KWeVp60m6DjM9wFO_y3';
  const exchangeRate = 0.015; // TON/USD rate
  
  const cryptoAmount = (amount * exchangeRate).toFixed(6);
  
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPayment = async () => {
    try {
      setPaymentStatus('processing');
      
      toast({
        title: "Processing payment",
        description: "Please confirm the transaction in your TON wallet"
      });

      // Check if wallet is connected
      if (!isConnected) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your TON wallet first",
          variant: "destructive"
        });
        setPaymentStatus('pending');
        return;
      }

      // Simulate transaction - in a real app, you would use the actual TONConnect SDK methods
      // to create and send a real transaction
      setTimeout(() => {
        setPaymentStatus('completed');
        toast({
          title: "Payment successful!",
          description: "Your TON payment has been processed"
        });
        onComplete();
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('pending');
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6 border border-white/10 rounded-xl bg-card/30 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="p-4 bg-cyber-navy/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Amount to pay:</p>
          <p className="text-2xl font-bold text-white">
            {amount.toFixed(2)} USD
            <span className="text-sm text-cyber-blue ml-2">
              ≈ {cryptoAmount} TON
            </span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              TON Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-grow p-3 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-white overflow-x-auto">
                {tonWalletAddress}
              </code>
              <Button
                size="icon"
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => handleCopy(tonWalletAddress)}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <div className="w-full">
              <TonConnectButton />
            </div>
            
            {paymentStatus === 'pending' && (
              <Button 
                onClick={handleSendPayment} 
                className="w-full mt-2"
                variant="cyber"
                disabled={!isConnected}
              >
                Pay with TON
              </Button>
            )}
            
            {paymentStatus === 'processing' && (
              <Button disabled className="w-full mt-2">
                Processing payment...
              </Button>
            )}
            
            {paymentStatus === 'completed' && (
              <Button variant="cyber" className="w-full mt-2" onClick={onComplete}>
                <Check className="mr-2 h-4 w-4" /> Payment confirmed
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1 mt-4">
          <p>1. Connect your TON wallet</p>
          <p>2. Send <span className="text-cyber-blue font-mono">{cryptoAmount} TON</span> to the address above</p>
          <p>3. Click "Pay with TON" to confirm</p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/10">
          <a 
            href="https://tonscan.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-cyber-blue"
          >
            View in block explorer <ExternalLink size={12} />
          </a>
          
          <div className="flex items-center gap-1">
            <Wallet size={12} />
            Secure TON Payments
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
